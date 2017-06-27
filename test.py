import serial

s = serial.Serial('/dev/ttyACM0', 9600)

while (1):
    print(s.readline())
