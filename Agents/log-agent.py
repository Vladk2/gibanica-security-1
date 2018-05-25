import sys
import json, re, requests, time
from pygtail import Pygtail


def readConf():
    data = json.load(open('log-agent.conf'))
    return data['log_file_path'], data['filter'], data['batch_size'], data['max_time']


def sendLogs(logs):
	print(logs)
	print("\n")

if __name__ == '__main__':

	log_file_path, filter_by, batch_size, max_time = readConf()
	logs = []
	now = time.time()
	time_limit = now + max_time
	while True:
		for log in Pygtail(log_file_path):
				logs.append(log)
				
				if(len(logs) == batch_size or time.time() > time_limit):
					now = time.time()
					time_limit = now + max_time
					sendLogs(logs)
					logs.clear()
