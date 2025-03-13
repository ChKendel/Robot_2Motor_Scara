import threading, websocket
import time, math

#pip install websocket-client


class Robot:
    def __init__(self, host="localhost", port=5080, arm=147.5, robotNr = 0):
        self.isRunning = True
        self.arm = arm
        self.robotNr = robotNr
        self.MotorX = 0.0
        self.MotorZ = 0.0
        self.CoordX = 0.0
        self.CoordY = 0.0
        self.lastPing = time.time()
        print(self.lastPing)
        self.ws = websocket.WebSocket()
        self.ws.connect(f"ws://{host}:{port}")
        self.rec_thread = threading.Thread(target=self.receiver)
        self.rec_thread.start()
        time.sleep(0.1)
        self.ws.send("?")
        self.ping_thread = threading.Thread(target=self.send_ping)
        self.ping_thread.start()

        if(robotNr > 0):
            self.ws.send("simNr="+str(robotNr))

    def close(self):
        self.isRunning = False
        self.ws.close()
        self.rec_thread.join()
        self.ping_thread.join()

    # Reception needs to be done in a separate thread; you cannot
    # assume that a given command will always result in exactly one
    # response at a predictable time
    def receiver(self):
        while self.isRunning:
            for l in self.ws.recv().splitlines():
                if isinstance(l, str):
                    #print(l)
                    self.processResponse(l)
                else:
                    #print(str(l, 'utf-8'))
                    self.processResponse(str(l, 'utf-8'))

    def send(self, msg):
        self.ws.send(msg)

    def send_ping(self):
        while self.isRunning:
            self.ws.send("Ping")
            for _ in range(100):
                if(not self.isRunning):
                    break
                time.sleep(0.04)

    def gotoMotorXZ(self, newMotorX, newMotorZ, feed = 5000):
        self.MotorX = newMotorX
        self.MotorZ = newMotorZ
        
        self.CoordX = math.cos(newMotorX*math.pi/180)*self.arm + math.cos(newMotorZ*math.pi/180)*self.arm
        self.CoordY = math.sin(newMotorX*math.pi/180)*self.arm + math.sin(newMotorZ*math.pi/180)*self.arm

        self.send("G1 x" +str(newMotorX)+ " z"+str(newMotorZ) + " f"+str(feed) + ' \n')

    def gotoCoordXY(self, x=None, y=None, feed=5000):
        if(x == None):
            x = self.CoordX
        if(y == None):
            y = self.CoordY
            
        
        r = math.sqrt(x**2 + y**2)
        phi = math.asin(y/r)
        if(x < 0):
            phi = math.pi - phi

        if(r  > 2*self.arm):
            print("Ausserhalb des gültigen Bereiches")
            self.gotoMotorXZ(120, 0, feed)
            return
        
        #Cos-Satz für a b r und den Winkel am Origin
        EllbogenWinkel = math.acos((2*((self.arm)**2)-(r)**2)/(2*((self.arm)**2)))
        MotorXminusPhi =  math.acos(((r)**2)/(2*self.arm*r))
        
        self.MotorX = (MotorXminusPhi + phi) * 180.0 / math.pi
        self.MotorZ = -(180  - self.MotorX - EllbogenWinkel*180/math.pi)
        
        self.gotoMotorXZ(self.MotorX, self.MotorZ, feed)

    def processResponse(self, response):
        if("{" not in response and ":" in response and "," in response):
            xyz = response.split(":")[1].split("|")[0].split(",")

            if(len(xyz) < 2):
                print("Unerwartete Antwort vom Roboter")
                return

            self.MotorX = float(xyz[0])
            self.MotorZ = float(xyz[2])

            self.CoordX = math.cos(self.MotorX*math.pi/180)*self.arm + math.cos(self.MotorZ*math.pi/180)*self.arm
            self.CoordY = math.sin(self.MotorX*math.pi/180)*self.arm + math.sin(self.MotorZ*math.pi/180)*self.arm