from datetime import datetime
from pprint import pprint
from threading import Thread
import psutil, socket, json, re
import time, sys, requests

def filterLog(line, filter_by):
    if re.search(filter_by, line):
        return True
    return False

def parseProcessInfo():
	processDict = psutil.Process().as_dict(attrs=['pid', 'name'])
	return '{}[{}]'.format(processDict['name'], processDict['pid'])

def parseLog(line):
    log = {}

    log["logged_time"] = str(datetime.strptime(line.split('] [')[0][1:], '%Y-%m-%d %H:%M'))
    log["severity"] = 'ALERT' if 'removed' in line else 'WARNING' if 'installed' in line else 'INFO'
    log["host"] = socket.gethostname()
    log["process"] = parseProcessInfo()
    log["message"] = {"content": '[{}'.format(line.split('] [')[1])}

    return log

def readConf():
    data = json.load(open('pacman-log-agent.conf'))
    return data['log_file_path'], data['filter']

if __name__ == '__main__':
    log_file_path, filter_by = readConf()

    logs = []

    url = "http://localhost:3000/logs" if not len(sys.argv) == 2 else sys.argv[1]

    headers = {'Content-type': 'application/json'}

    def sendLogs():
        while True:
            if len(logs) > 0:
                received_logs = list(logs)
                logs.clear()
                r = requests.post(url, json={"agent": "pacman", "logs": received_logs}, headers=headers)
                if r.status_code == 200:
                    print('Logs have been sent successfully')
                    return

    with open(log_file_path) as f:
        lines = f.readlines()
        for line in lines:
            line = line.rstrip()
            if filterLog(line, filter_by):
                logs.append(parseLog(line))

    # Thread(target=sendLogs, daemon=True).start()
    sendLogs()
