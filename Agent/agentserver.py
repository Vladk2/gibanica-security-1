from flask import Flask, request, jsonify
from werkzeug import serving

import ssl
import sys

import json,requests
import log_agent as agent 
# To start agent, uncomment line bellow:
# agent.run()

app = Flask(__name__)

data = json.load(open('log-agent.conf'))

HTTPS_ENABLED = True
VERIFY_USER = True

API_HOST = data['address']
API_PORT = data['port']
API_CRT = data['cert_path']
API_KEY = data['cert_key_path']
API_CA_T = data['ca_cert_path']

agent_wait = False

def startup():
	url = "https://%s/agents" % data['siem_ip']
	headers = {'Content-type': 'application/json', 'Connection': 'close'}

	agentId = None
	if "id" in data:
		agentId = data["id"]

	if agentId == None:
		json_ = {'type': data['type'], 'address': '%s:%d' % (data['address'], data['port']), 'host': data['host'], 'name': data['name'], 'paths': data['paths']}
	else:
		json_ = {'type': data['type'], 'address': '%s:%d' % (data['address'], data['port']), 'id': agentId, 'host': data['host'], 'name': data['name'], 'paths': data['paths']}
	
	r = requests.post(
		url,
		# returns 401 if this agent has super agent
		json=json_, # send agent data from .conf file
		cert=(API_CRT, API_KEY), # returns 406 without cert
		headers=headers,
		verify=API_CA_T
	)

	if agentId == None:
		rJson = json.loads(r.text)
		data["id"] = rJson["_id"]["$oid"]
		with open('log-agent.conf','w') as file:
			file.write(json.dumps(data, indent=4, sort_keys=True))

	if(r.status_code == 200 or r.status_code == 201):
		agent.run(API_CRT, API_KEY, API_CA_T, data['siem_ip'])
		serving.run_simple(
					API_HOST, API_PORT, app, ssl_context=context)
	

@app.route("/logs", methods = ["POST"])
def accept_logs():
	content = request.get_json(silent=True)
	headers = {'Content-type': 'application/json', 'Connection': 'close'}
	url = 'https://' + data['siem_ip'] + '/logs'
	if "super" in data:
		if "address" in data["super"]:
			url = 'https://' + data['super']['address'] + '/logs'
	r = requests.post(
		url,
		# returns 401 if this agent has super agent
		json={'id': data['id'], 'logs': content['logs']}, # send agent data from .conf file
		cert=(API_CRT, API_KEY), # returns 406 without cert
		headers=headers,
		verify=API_CA_T
	)
	return "ok"

@app.route("/update_supervisor", methods = ["PATCH"])
def update_supervisor():
	global agent_wait
	content = request.get_json(silent=True)
	print(content)

	data['super'] = {}
	if content['super']['id'] != None:
		data['super']['id'] = content['super']['id']['$oid']
		data['super']['address'] = content['super']['address']
	agent_wait = True
	with open('log-agent.conf','w') as file:
		file.write(json.dumps(data, indent=4, sort_keys=True))
	agent_wait = False
	return "ok"

@app.route("/update", methods = ['PATCH'])
def update():
	global agent_wait
	content = request.get_json(silent=True)

	data["log_files"] = content["paths"]
	data["name"] = content["name"]
	agent_wait = True
	with open('log-agent2.conf','w') as file:
		file.write(json.dumps(data, indent=4, sort_keys=True))
	agent_wait = False
	return jsonify(content)

if __name__ == "__main__":
	context = None

	if HTTPS_ENABLED:
			context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
			if VERIFY_USER:
					context.verify_mode = ssl.CERT_REQUIRED
					context.load_verify_locations(API_CA_T)
			try:
					context.load_cert_chain(API_CRT, API_KEY)
			except Exception as e:
					sys.exit("Error starting flask server. " +
							"Missing cert or key. Details: {}"
							.format(e))
	# if startup(): app.run ... - send request to siem and update conf, then run server
	startup()
	


import threading
import time

