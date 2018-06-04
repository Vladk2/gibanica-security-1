import sys
import json, re, requests, time, platform
from pygtail import Pygtail
import threading
import win32evtlog # pip install pywin32
from win32event import *
import win32evtlogutil



def readConf():
	'''
	CONF.JSON SPEC:

	CONFIGURATION FILE EXAMPLE:
	{
	"log_formats": [
    				{"sample_format": <regex>},
    				{"pacman_format": <regex>}
    				],
	"log_files": [
					  { "path": PATH_TO_LOGFILE,"log_format": "sample_format", "filter_by": "ERROR|WARNING"} ,
					  { "path": PATH_TO_OTHER_LOGFILE,"log_format": "pacman_format", "filter_by": "2018-06-03"}
					  ],
	"win_event_logs": {"read_event_logs": boolean, "log_type(s)": "system | application"}
	"batch_size" : NUMBER,
	"max_time" : NUMBER_OF_SECONDS
	}

	EXPLANATION AND USAGE:
	log_formats: Contains a list of log formats. Every format has its name as key, and a regular expression of log format as value.
				 If you're defining a new format, make sure that you escape all special characters in regex (for example, replace "\" with "\\").
				 Also make sure that you give provided names for groups in regex. Only groups with provided names can be parsed. Provided names so far are: date, time, host, process, severity and message.
				 Example of one log format: {"example_format": "(?P<date>[a-zA-Z0-9]+)\\s+(?P<host>\w*)}"
	log_files: Contains a list of log files with its configuration.
			path: Path to the logfile that you want to read from.
			log_format: Format of your logs that you're reading - must be one from list in "log_formats"(object key is the name of the format).
			filter by: Read only logs that matches with this regular expression. If you leave an empty string, then it will read all logs from the file.
	win_event_logs: This field is only for Windows users.
			read_event_logs: Boolean value. Agent will read system event logs only if it's True.
			log_type(s): Choose what kind of system logs You want to read (system or application). If you leave an empty string, then it will read them both.
			filter by: Read only logs that matches with this regular expression. If you leave an empty string, then it will read all logs from the file.
	batch_size: Max. number of logs that Agent can store before sending them to the SIEM.
	max_time: Max. number of seconds that Agent can store logs before sending them to the SIEM.
	'''

	data = json.load(open('log-agent.conf'))
	return data['log_files'], data['batch_size'], data['max_time'], data['win_event_logs'], data['log_formats']


def sendLogs(logs):
	print("\n\nSENDING LOGS: \n")
	print(logs)
	print("\n")


class WinEventLogReader(threading.Thread):


	def __init__(self, server, logtype):
		threading.Thread.__init__(self)
		self.server = server
		self.logtype = logtype

	def run(self):

		self.hand = win32evtlog.OpenEventLog(self.server,self.logtype)
		global time_limit
		flags = win32evtlog.EVENTLOG_FORWARDS_READ|win32evtlog.EVENTLOG_SEEK_READ
		prevNumOfRecs = win32evtlog.GetNumberOfEventLogRecords(self.hand)
		evnthndl = CreateEvent(None, True, False, None)
		win32evtlog.NotifyChangeEventLog(self.hand, evnthndl)
		levels_dict = {1:'ERROR', 2:'WARNING', 4:'INFO'}
		while True:
			print ('hi')
			evntsgnld = WaitForSingleObject(evnthndl, 10000)
			if evntsgnld == WAIT_OBJECT_0:
				print ('New event: \n')
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
					evJson["message"] = str(win32evtlogutil.FormatMessage(event, self.logtype))
					ev = evJson["logged_time"] + " " + evJson["process"] + " " + evJson["host"]  + " " + evJson["severity"] + " " + evJson["message"]

					filter_pattern = re.compile(log_file_conf["filter_by"])
					if(event_logs["filter_by"] == "" or filter_pattern.search(ev)):
						logs.append(evJson)
						if(len(logs) >= batch_size or time.time() > time_limit):
							now = time.time()
							time_limit = now + max_time
							sendLogs(logs)
							logs.clear()
						print(" EVENT: \n")
						print(evJson)
						#print("\n All events: \n")
						#print(logs)
						print("\n\n")
				ResetEvent(evnthndl)
				prevNumOfRecs = numOfRec




def readLogFiles():
	now = time.time()
	global time_limit
	time_limit = now + max_time
	for file in log_files:
		print(file)
		w2 = threading.Thread(target=readLogFile, args = [file])
		w2.start()

def readLogFile(log_file_conf):
	global time_limit
	while True:
		for log in Pygtail(log_file_conf["path"]):
			log = checkLog(log, log_file_conf)
			if(log != None):
				logs.append(log)
				if(len(logs) >= batch_size or time.time() > time_limit):
					now = time.time()
					time_limit = now + max_time
					sendLogs(logs)
					logs.clear()

def checkLog(log, log_file_conf):
	#log: 2018-06-02 04:58:04,977  root  port-scanner2  ERROR  {'port': 445, 'isOpen': True}
	#regex: (?P<date>[0-9]+-[0-9]+-[0-9]+)\s(?P<time>([0-9]+:[0-9]+:[0-9,]+)\s+(?P<host>.*?)\s+(?P<process>.*?)\s+(?P<severity>.*?)\s+(?P<message>.*)

	#log: May 24 18:50:48 notebook sudo[1144]:   stefan : TTY=pts/0 ; PWD=/var/log ; USER=root ; COMMAND=/usr/bin/pacman -Ss syslog ng
	#regex: (?P<date>[a-zA-Z]+\s+[0-9]+)\s+(?P<time>[0-9]+:[0-9]+:[0-9]+)\s+(?P<host>.*?)\s+(?P<process>.*?)\s+(?P<message>.*)

	parsed_log = parseLog(log, log_file_conf["log_format"])
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
		#time = match.group("time").split(",")[0]
		if("date" in pattern.groupindex and "time" in pattern.groupindex):
			datetime = match.group("date") + " " + match.group("time")
			log_json["logged_date"] = match.group("date")
			log_json["logged_time"] = datetime
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
	if(event_logs["log_type(s)"] == "system"):
		log_type = "System"
	elif(event_logs["log_type(s)"] == "application"):
		log_type = "Application"
	if(event_logs["log_type(s)"] == ""):
		systemEventViewer1 = WinEventLogReader('localhost', "System")
		systemEventViewer2 = WinEventLogReader('localhost', "Application")
		systemEventViewer1.start()
		systemEventViewer2.start()
	if(log_type != None):
		systemEventViewer = WinEventLogReader('localhost', log_type)
		systemEventViewer.start()
	else:
		print("Cannot read event logs. Possible reason: Bad configuration.")



if __name__ == '__main__':

	logs = []
	time_limit = 0
	log_files, batch_size, max_time, event_logs, log_formats = readConf()

	if(platform.system() == "Windows" and event_logs["read_event_logs"]):
		readWinEventLogs()
	if log_files:
		readLogFiles()








