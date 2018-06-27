import threading, sys
import requests
from queue import Queue
import time
import socket, psutil
from datetime import datetime
import logging

logging.basicConfig(filename = "logs.log", level=logging.INFO,
                    format = '%(asctime)s  %(name)s  %(module)s  %(levelname)s  %(message)s')

def parseProcessInfo():
	processDict = psutil.Process().as_dict(attrs=['pid', 'name'])
	return '{}[{}]'.format(processDict['name'], processDict['pid'])

def portscan(port, sleepTime):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    try:
        con = s.connect_ex((host,port))
        with print_lock:
            #print(threading.currentThread().getName())
            if(con == 0):
                port_status = {'logged_time': datetime.now().strftime('%m/%d/%Y %H:%M:%S'),
                               'host': socket.gethostname(),
                               'process': parseProcessInfo(),
                               'message': {'port': port, 'isOpen': True}}
                port_list.append(port_status)
                time.sleep(1)
                logging.info(port_status.get('message'))
            else:
                port_status = {'logged_time': datetime.now().strftime('%m/%d/%Y %H:%M:%S'),
                               'host': socket.gethostname(),
                               'process': parseProcessInfo(),
                               'message': {'port': port, 'isOpen': False}}
                port_list.append(port_status)
                time.sleep(1)
                logging.warning(port_status.get('message'))

        con.close()

        return port_list
    except:
        return False


# The threader thread pulls an worker from the queue and processes it
def threader(sleepTime):
    while True:

        # gets an worker from the queue
        worker = q.get()

        # Run the example job with the avail worker in queue (thread)
        portscan(worker, sleepTime)

        # completed with the job
        q.task_done()

if __name__ == '__main__':

    port_list = []

    url = "http://localhost:3000/logs" if not len(sys.argv) == 2 else sys.argv[1]

    headers = {'Content-Type': 'application/json'}

    while True:
        print("Port scanner started...")
        print_lock = threading.Lock()

        host = 'localhost'
        #ip = socket.gethostbyname(target)
        #ip = '127.0.0.1'


        t1 = datetime.now()
        q = Queue()

        # how many threads are we going to allow for
        for x in range(4):
            sleep = 2*x + 4
            t = threading.Thread(target=threader, args=(sleep, ), daemon=True).start()

        for port in range(1,1025):

            q.put(port)

        # wait until the thread terminates.
        q.join()

        # Checking the time again
        t2 = datetime.now()

        # Calculates the difference of time, to see how long it took to run the script
        total =  t2 - t1
        # Printing the information to screen
        print ('Scanning Completed in: ', total)
       # r = requests.post(url, json={"agent": "vladk", "logs": port_list}, headers=headers)
        #if r.status_code == 200:
       #     port_list.clear()
       # time.sleep(5)
