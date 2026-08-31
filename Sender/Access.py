import re, requests, websocket

r = requests.post(f"https://roboter.schooltech.ch/api/login",
                  json={"user": "abc", "pass": "abc"}, timeout=10)
r.raise_for_status()

sid = r.cookies.get("SESSIONID")
#ws = websocket.create_connection(f"wss://jetsonmini-simulationscara.schooltech.ch/echo",
ws = websocket.create_connection(f"wss://biomqtt-scara-scaragreen.schooltech.ch/echo",
                                 header=[f"Cookie: SESSIONID={sid}"],
                                 suppress_origin=True)

print(ws.recv())                             # Begrüssung: Connected to default
ws.send("simNr=0");            print(ws.recv())   # Quittung prüfen: "simNr":"7"
ws.send("G1 x60 z40");  print(ws.recv())