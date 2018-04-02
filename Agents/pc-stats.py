import time
import psutil
from datetime import datetime
import requests, sys
from threading import Thread

def parseCPU():
	log = psutil.cpu_freq(percpu=False).current
	return log

def parseTemp():
	log = str(psutil.sensors_temperatures()).split("current=")[1].split(",")[0]
	return '{} C'.format(log)

def parseMemory():
	log = psutil.virtual_memory().percent
	return '{}%'.format(log)

def parseSwap():
	log = psutil.swap_memory().used
	return '%s MB' % str(int(log)/1024*1024)

if __name__ == "__main__":

	flag = False
	logs = []
	url = "http://localhost:3000/logs" if not len(sys.argv) == 2 else sys.argv[1]
	headers = {'Content-type': 'application/json'}

	def sendLogs(flag):
		while True:
			time.sleep(5)
			if len(logs) > 0:
				received_logs = list(logs)
				flag = True
				logs.clear()
				r = requests.post(url, json={"agent": "stanija", "logs": received_logs},
					 headers=headers)
				if r.status_code == 200:
				    flag = False

	Thread(target=sendLogs, args=(flag, ), daemon=True).start()

	while True:
		log = {}
		stats = {}
		stats['frequency'] = parseCPU()
		stats['time'] = datetime.now().strftime('%m/%d/%Y %H:%M:%S')
		stats['temperature'] = parseTemp()
		stats['memory'] = parseMemory()
		stats['swap'] = parseSwap()
		log["content"] = stats
		logs.append(log)
		time.sleep(3)
