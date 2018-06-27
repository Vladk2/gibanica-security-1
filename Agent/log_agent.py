import sys
import json
import re
import requests
import time
import platform
from pygtail import Pygtail
import threading
from syslogmp import parse
from datetime import datetime as dt
import requests
import dateutil.parser as parser
if platform.system() == 'Windows':  # only for Windows users
	import win32evtlog  # pip install pywin32
	from win32event import *
	import win32evtlogutil


API_CRT = ""
API_KEY = ""
API_CA_T = ""
SIEM_IP = ""

def run(api_crt, api_key, api_ca_t, siem_ip):

	global API_CRT
	global API_KEY
	global API_CA_T
	global SIEM_IP
	API_CRT, API_KEY, API_CA_T, SIEM_IP = api_crt, api_key, api_ca_t, siem_ip

	if(platform.system() == "Windows" and event_logs != {}):
		readWinEventLogs()
	if log_files:
		readLogFiles()
		print("\nAGENT STARTED...\n")

def readConf():
	

	data = json.load(open('log-agent.conf'))

	event_logs = {}
	for path in data['paths']:
		if path['format'] == "win_event_logs":
			event_logs = path
			data['paths'].remove(path)

	return data['paths'], data['batch_size'], data['max_time'], data['log_formats'], event_logs


def sendLogs(logs):
	print("\n\nSENDING LOGS: \n")
	print(logs)
	print("\n")

	url = SIEM_IP
	headers = {'Content-type': 'application/json', 'Connection': 'close'}

	r = requests.post(
		url,
		# returns 401 if this agent has super agent
		json={'id': data['id'], 'logs': logs}, # send agent data from .conf file
		cert=(API_CRT, API_KEY), # returns 406 without cert
		headers=headers,
		verify=API_CA_T
	)

	if r.status_code == 200:
		print('Logs have been sent successfully')
		# r.connection.close()


class WinEventLogReader(threading.Thread):

	def __init__(self, server, logtype):
		threading.Thread.__init__(self)
		self.server = server
		self.logtype = logtype

	def run(self):

		self.hand = win32evtlog.OpenEventLog(self.server, self.logtype)
		global time_limit
		flags = win32evtlog.EVENTLOG_FORWARDS_READ | win32evtlog.EVENTLOG_SEEK_READ
		prevNumOfRecs = win32evtlog.GetNumberOfEventLogRecords(self.hand)
		evnthndl = CreateEvent(None, True, False, None)
		win32evtlog.NotifyChangeEventLog(self.hand, evnthndl)
		levels_dict = {1: 'ERROR', 2: 'WARNING', 4: 'INFO'}
		while True:
			print('hi')
			evntsgnld = WaitForSingleObject(evnthndl, 10000)
			if evntsgnld == WAIT_OBJECT_0:
				print('New event: \n')
				numOfRec = win32evtlog.GetNumberOfEventLogRecords(self.hand)
				NumOfNewRecs = numOfRec - prevNumOfRecs
				offset = numOfRec - NumOfNewRecs
				events = win32evtlog.ReadEventLog(self.hand, flags, offset + 1)
				for event in events:
					# 4 Info, 1 Error, 2 Warning... 3 should be Debug?
					evJson = {}
					datetime = str(event.TimeGenerated)
					evJson["logged_date"] = datetime.split(" ")[0]
					evJson["logged_time"] = datetime
					evJson["process"] = str(event.SourceName)
					evJson["host"] = str(event.ComputerName)
					if not event.EventType in levels_dict.keys():
						evJson["severity"] = "Unknown"
					else:
						evJson["severity"] = str(levels_dict[event.EventType])
					evJson["message"] = str(
						win32evtlogutil.FormatMessage(event, self.logtype))
					ev = evJson["logged_time"] + " " + evJson["process"] + " " + \
						evJson["host"] + " " + evJson["severity"] + \
						" " + evJson["message"]

					filter_pattern = re.compile(event_logs["filter_by"])
					if(event_logs["filter_by"] == "" or filter_pattern.search(ev)):
						logs.append(evJson)
						if(len(logs) >= batch_size or time.time() > time_limit):
							now = time.time()
							time_limit = now + max_time
							sendLogs(logs)
							logs.clear()
						print(" EVENT: \n")
						print(evJson)
						# print("\n All events: \n")
						# print(logs)
						print("\n\n")
				ResetEvent(evnthndl)
				prevNumOfRecs = numOfRec


def readLogFiles():
	now = time.time()
	global time_limit
	time_limit = now + max_time
	for file in log_files:
		print(file)
		w2 = threading.Thread(target=readLogFile, args=[file])
		w2.start()


''' 
	def readLogFile(log_file_conf):
	global time_limit
	while True:
		for log in Pygtail(log_file_conf["path"]):
			print(log)
			log = checkLog(log, log_file_conf)
			if(log != None):
				logs.append(log)
				if(len(logs) >= batch_size or time.time() > time_limit):
					now = time.time()
					time_limit = now + max_time
					sendLogs(logs)
					logs.clear()
'''
def readLogFile(log_file_conf):
	global time_limit
	logfile = open(log_file_conf["path"],"r")
	loglines = follow(logfile)
	for log in loglines:
		log = checkLog(log, log_file_conf)
		if(log != None):
			logs.append(log)
			if(len(logs) >= batch_size or time.time() > time_limit):
				now = time.time()
				time_limit = now + max_time
				sendLogs(logs)
				logs.clear()


def checkLog(log, log_file_conf):
	# log: 2018-06-02 04:58:04,977  root  port-scanner2  ERROR  {'port': 445, 'isOpen': True}
	# regex: (?P<date>[0-9]+-[0-9]+-[0-9]+)\s(?P<time>([0-9]+:[0-9]+:[0-9,]+)\s+(?P<host>.*?)\s+(?P<process>.*?)\s+(?P<severity>.*?)\s+(?P<message>.*)

	# log: May 24 18:50:48 notebook sudo[1144]:   stefan : TTY=pts/0 ; PWD=/var/log ; USER=root ; COMMAND=/usr/bin/pacman -Ss syslog ng
	# regex: (?P<date>[a-zA-Z]+\s+[0-9]+)\s+(?P<time>[0-9]+:[0-9]+:[0-9]+)\s+(?P<host>.*?)\s+(?P<process>.*?)\s+(?P<message>.*)

	parsed_log = parseLog(log, log_file_conf["format"])
	if(parsed_log == None):
		return None
	else:
		filter_pattern = re.compile(log_file_conf["filter_by"])
		if(log_file_conf["filter_by"] == "" or filter_pattern.search(log)):
			return parsed_log
		else:
			return None


def parseLog(log, log_format):

	format_found = False
	log_format_regex = ""
	for format_ in log_formats:
		if(log_format in format_):
			log_format_regex = format_[log_format]
			format_found = True
		if(log_format == "RFC 3164"):
			log_byte = str.encode(log)
			message = parse(log_byte)
			splited_msg = message.message.decode('utf-8').split("]:", 1)

			datetime = message.timestamp
			log_json = {}
			log_json["logged_date"] = datetime.strftime('%Y-%m-%d')
			log_json["logged_time"] = datetime.strftime(
				'%Y-%m-%d %H:%m:%S')
			log_json["host"] = message.hostname
			log_json["process"] = splited_msg[0].strip()+']'
			if(message.severity.name == "informational"):
				log_json["severity"] = "INFO"
			else:
				log_json["severity"] = message.severity.name.upper()
			log_json["message"] = splited_msg[1].strip()
			return log_json
		# <30>Jun  5 02:36:06 stefan-pc systemd: Started Syslog service for accepting logs from journald.
	if(format_found):
		log_format_raw = log_format_regex.encode('unicode_escape').decode()
		pattern = re.compile(log_format_regex)
		match = pattern.match(log)
	else:
		print("Bad or no logging format provided.")
		return None

	if(match == None):
		print("Bad configuration(log format regex) - No match")
		print(log)
		return None
	else:
		log_json = {}
		# time = match.group("time").split(",")[0]
		if("date" in pattern.groupindex and "time" in pattern.groupindex):
			datetime = match.group("date") + " " + match.group("time")
			date = parser.parse(datetime)
			datetime_formated = date.strftime('%d-%m-%Y %H:%M:%S')
			date_formated = date.strftime('%d-%m-%Y')
			log_json["logged_date"] = date_formated
			log_json["logged_time"] = datetime_formated
		if("host" in pattern.groupindex):
			log_json["host"] = match.group("host")
		if("process" in pattern.groupindex):
			log_json["process"] = match.group("process")
		if("severity" in pattern.groupindex):
			log_json["severity"] = match.group("severity")
		if("message" in pattern.groupindex):
			log_json["message"] = match.group("message")

		return log_json


def readWinEventLogs():

	log_type = None
	if(event_logs["path"] == "system"):
		log_type = "System"
	elif(event_logs["path"] == "application"):
		log_type = "Application"
	if(event_logs["path"] == ""):
		systemEventViewer1 = WinEventLogReader('localhost', "System")
		systemEventViewer2 = WinEventLogReader('localhost', "Application")
		systemEventViewer1.start()
		systemEventViewer2.start()
	if(log_type != None):
		systemEventViewer = WinEventLogReader('localhost', log_type)
		systemEventViewer.start()
	else:
		print("Cannot read event logs. Possible reason: Bad configuration.")

def follow(thefile):
	thefile.seek(0,2)
	while True:
		line = thefile.readline()
		if not line:
			time.sleep(0.1)
			continue
		yield line


logs = []
time_limit = 0
log_files, batch_size, max_time, log_formats, event_logs = readConf()
