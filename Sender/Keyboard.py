from Robot import *
import keyboard
import time


r = Robot("localhost", 5080, robotNr=1)
#r = Robot("sim.schooltech.ch", 80)
#r = Robot("10.98.41.34",5081)
#r = Robot("10.98.41.34",5061)

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