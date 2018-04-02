import os, time, sys, requests
from datetime import datetime
from threading import Thread
from pwd import getpwuid

def find_owner(filename):
    return getpwuid(os.stat(filename).st_uid).pw_name

def get_modification_time(filename):
    return datetime.fromtimestamp(os.stat(filename).st_ctime).strftime('%m/%d/%Y %H:%M:%S')

def scanFiles(path):
    files = []
    for file in os.listdir(path=path):
        try:
            tmp = dict()

            tmp['name'] = file
            tmp['dir_path'] = path
            tmp['is_dir'] = True if os.path.isdir('%s/%s' % (path, file)) else False
            tmp['user'] = find_owner('%s/%s' % (path, file))
            tmp['time'] = get_modification_time('%s/%s' % (path, file))

            files.append(tmp)
        except Exception:
            continue

    return files

def checkChanges(files, newScan, logs, flag):
    for file in files:

        old_found = list(filter(lambda f: f['name'] == file['name'], newScan))

        if len(old_found) == 0:
            while flag:
                pass
            # file removed. send to siem
            file['action'] = 'delete'
            file['time'] = datetime.now().strftime('%m/%d/%Y %H:%M:%S')
            logs.append({'content': file})
        else:
            if file['time'] != old_found[0]['time']:
                while flag:
                    pass
                old_found[0]['action'] = 'edit'
                # file modified. send found[0] to siem
                logs.append({'content': old_found[0]})

    for file in newScan:
        new_found = list(filter(lambda f: f['name'] == file['name'], files))
        if len(new_found) == 0:
            while flag:
                pass
            # file created. send to siem
            file['action'] = 'create'
            logs.append({'content': file})

if __name__ == '__main__':
    # indicator that thread received all saved logs
    flag = False

    logs = []

    url = "http://localhost:3000/logs" if not len(sys.argv) > 1 else sys.argv[1]

    headers = {'Content-type': 'application/json'}

    def sendLogs(flag):
        while True:
            time.sleep(5)
            if len(logs) > 0:
                received_logs = list(logs)
                flag = True
                logs.clear()
                r = requests.post(url, json={"logs": received_logs}, headers=headers)
                print(r.headers)
                if r.status_code == 200:
                    flag = False

    Thread(target=sendLogs, args=(flag, ), daemon=True).start()

    path = sys.argv[1]

    files = scanFiles(path)

    while True:
        newScan = scanFiles(path)

        checkChanges(files, newScan, logs, flag)

        files = newScan
