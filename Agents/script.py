import os
import time
from datetime import datetime
from deepdiff import DeepDiff
import sys
from pwd import getpwuid

def scanFiles(path):
	return os.listdir(path=path)

files = scanFiles('.')

from pwd import getpwuid

def find_owner(filename):
    return getpwuid(os.stat(filename).st_uid).pw_name

def diff(list1, list2):
    c = set(list1).union(set(list2))  
    d = set(list1).intersection(set(list2)) 
    return list(c - d)

while True:
	print('LOG: No changes' + '		' + str(datetime.now()))
	newScan = scanFiles('.')

	if len(newScan) > len(files):
		print('LOG: ==New files appeared==' + '		' + str(datetime.now()))
		print(diff(newScan, files))
		newFiles = []
		newFiles = diff(newScan, files)
		for i in newFiles:
			print(i)
			print('Owner: ',find_owner(os.path.realpath('.')+'/'+i))
			t = os.path.getmtime(os.path.realpath('.')+'/'+i)
			print('Created: ', datetime.fromtimestamp(t))	
		files = newScan
		
	if len(newScan) < len(files):
		print('LOG: ==Files missing==' + '		' + str(datetime.now()))
		print(diff(newScan, files))
		missingFiles = []
		missingFiles = diff(newScan, files)
		for i in missingFiles:
			print(missingFiles)
		files = newScan

	for file1, file2 in zip(files, newScan):
		check = []
		check = diff(files, newScan)
		changes = check[::2]
		if len(changes) != 0:
			print('New files: ' ,changes)
		
		files = newScan


	time.sleep(15)

