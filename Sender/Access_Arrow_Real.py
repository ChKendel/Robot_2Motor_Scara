import json
import math
import msvcrt
import ssl

import requests
import websocket

# ---- Konfiguration (siehe Access_Arrow.md) ----
L1 = 250.0        # Länge Arm 1 [mm]
L2 = 250.0        # Länge Arm 2 [mm]
STEP_MM = 10.0    # Schrittweite pro Pfeiltastendruck [mm]
MIN_RADIUS_MM = 80.0  # Sicherheitsabstand zum Zentrum (Kollision Stift/Hand mit der Basis)
FEED_RATE = 3000  # mm/min - FluidNC braucht vor dem ersten G1 eine Vorschubgeschwindigkeit (F)

# Login/Cookie wie bei der Simulation: derselbe Firewall-Layer vor
# biomqtt-scara-scaragreen.schooltech.ch verlangt dieselbe Identifizierung.
LOGIN_URL = "https://roboter.schooltech.ch/api/login"
USER = "abc"
PASS = "abc"

WS_URL = "wss://biomqtt-scara-scaragreen.schooltech.ch"
VERIFY_TLS = False   # Bridge nutzt ggf. ein selbstsigniertes Zertifikat, siehe appRobotControlScara_c/scripts/accessWss.py


def normalize_deg(angle):
    a = angle % 360.0
    if a > 180.0:
        a -= 360.0
    return a


def forward_kinematics(t1_deg, t2_deg):
    t1 = math.radians(t1_deg)
    t2 = math.radians(t2_deg)
    x = L1 * math.cos(t1) + L2 * math.cos(t2)
    y = L1 * math.sin(t1) + L2 * math.sin(t2)
    return x, y


def inverse_kinematics(x, y):
    d = math.hypot(x, y)

    if d < 1e-6:
        if abs(L1 - L2) < 1e-6:
            return 90.0, -90.0
        return None

    if d > L1 + L2 + 1e-9 or d < abs(L1 - L2) - 1e-9:
        return None

    a = (d * d + L1 * L1 - L2 * L2) / (2.0 * d)
    h = math.sqrt(max(L1 * L1 - a * a, 0.0))
    ux, uy = x / d, y / d
    px, py = a * ux, a * uy

    solutions = []
    for sign in (1.0, -1.0):
        ex = px + sign * h * (-uy)
        ey = py + sign * h * ux
        t1 = normalize_deg(math.degrees(math.atan2(ey, ex)))
        t2 = normalize_deg(math.degrees(math.atan2(y - ey, x - ex)))
        solutions.append((t1, t2))

    # Feste Ellbogenkonfiguration: Lösung mit dem größeren z-Winkel bevorzugen (siehe .md)
    solutions.sort(key=lambda s: -s[1])
    return solutions[0]


def print_state(x, y, t1, t2):
    print(f"Welt:  x={x:8.2f} mm  y={y:8.2f} mm   |   Motor:  x={t1:7.2f} deg  z={t2:7.2f} deg")


def send_move(ws, x, y):
    if math.hypot(x, y) < MIN_RADIUS_MM:
        print(f"Ziel (x={x:.2f}, y={y:.2f}) zu nah am Zentrum (< {MIN_RADIUS_MM:.0f} mm) - Kollisionsgefahr, Bewegung ignoriert.")
        return None

    result = inverse_kinematics(x, y)
    if result is None:
        print(f"Ziel (x={x:.2f}, y={y:.2f}) nicht erreichbar - Bewegung ignoriert.")
        return None

    t1, t2 = result
    gcode = f"G1 x{t1:.2f} z{t2:.2f} f{FEED_RATE}"
    ws.send(json.dumps({"type": "gcode", "cmd": gcode}))
    try:
        print("Roboter:", ws.recv())
    except websocket.WebSocketTimeoutException:
        print("Keine Antwort vom Roboter (Timeout) - ist die Bridge/FluidNC erreichbar?")

    print_state(x, y, t1, t2)
    return t1, t2


def main():
    sslopt = None if VERIFY_TLS else {"cert_reqs": ssl.CERT_NONE}

    print(f"Login bei {LOGIN_URL} ...")
    try:
        r = requests.post(LOGIN_URL, json={"user": USER, "pass": PASS}, timeout=10)
        r.raise_for_status()
        sid = r.cookies.get("SESSIONID")
    except Exception as e:
        print(f"Login fehlgeschlagen: {e}")
        return

    print(f"Verbinde zu {WS_URL} ...")
    try:
        ws = websocket.create_connection(
            WS_URL, header=[f"Cookie: SESSIONID={sid}"], sslopt=sslopt, timeout=10
        )
    except Exception as e:
        print(f"Verbindung fehlgeschlagen: {e}")
        return
    ws.settimeout(5.0)
    print("Verbunden.")

    x, y = L1 + L2, 0.0
    print_state(x, y, 0.0, 0.0)
    print("Steuerung: Pfeiltasten bewegen den Roboter, 'o' fährt zur Home-Position (500,0), 'q' oder Esc beendet das Programm.")

    try:
        while True:
            ch = msvcrt.getch()

            if ch in (b"q", b"Q", b"\x1b"):
                break

            if ch in (b"o", b"O"):  # Home-Position, NICHT der Koordinaten-Ursprung (0,0)
                new_x, new_y = L1 + L2, 0.0
            elif ch in (b"\x00", b"\xe0"):
                ch2 = msvcrt.getch()
                dx = dy = 0.0
                if ch2 == b"H":      # Pfeil hoch
                    dy = STEP_MM
                elif ch2 == b"P":    # Pfeil runter
                    dy = -STEP_MM
                elif ch2 == b"K":    # Pfeil links
                    dx = -STEP_MM
                elif ch2 == b"M":    # Pfeil rechts
                    dx = STEP_MM
                else:
                    continue
                new_x, new_y = x + dx, y + dy
            else:
                continue

            result = send_move(ws, new_x, new_y)
            if result is not None:
                x, y = new_x, new_y
    finally:
        ws.close()


if __name__ == "__main__":
    main()
