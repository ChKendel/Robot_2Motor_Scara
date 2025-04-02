from Robot import *
import keyboard
import time


#r = Robot("sim.schooltech.ch", 80, robotNr=4)
r = Robot("fluidncblue.local",81)
#r = Robot("sim.schooltech.ch", 80)
#r = Robot("fluidncblue.local",81)
#r = Robot("192.168.8.198",81)

while True:
    # Wait for key press
    if keyboard.is_pressed('right'):
        r.CoordX += 1
        r.gotoCoordXY()
        time.sleep(0.006)
    if keyboard.is_pressed('left'):
        r.CoordX -= 1
        r.gotoCoordXY()
        time.sleep(0.006)
    if keyboard.is_pressed('up'):
        r.CoordY += 1
        r.gotoCoordXY()
        time.sleep(0.006)
    if keyboard.is_pressed('down'):
        r.CoordY -= 1
        r.gotoCoordXY()
        time.sleep(0.006)
    if keyboard.is_pressed('m'):
        r.gotoMotorXZ(0,0)
    if keyboard.is_pressed('q') or keyboard.is_pressed('esc'):
       r.close()
       break