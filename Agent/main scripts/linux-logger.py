import time
from random import randint

filepath = 'RFC3164.log'  
with open(filepath, encoding="utf8") as fp:  
	line = fp.readline()
	cnt = 1
	while line:
		time.sleep(randint(0, 5))
		with open("linuxlogs.log", "a") as myfile:
			myfile.write(line.strip())
			myfile.write("\n")
		line = fp.readline()

