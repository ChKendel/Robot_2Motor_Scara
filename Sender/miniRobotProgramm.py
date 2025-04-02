
from Robot import *
import time


r = Robot("sim.schooltech.ch", 80, robotNr = 4)

r.gotoMotorXZ(20, -35)
time.sleep(4)
r.gotoMotorXZ(14, -30)
time.sleep(4)
#r.gotoMotorXZ(120, -30)

time.sleep(1)
r.close()