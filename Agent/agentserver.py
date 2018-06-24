from flask import Flask, request, jsonify
from werkzeug import serving

import ssl
import sys

import json,requests

app = Flask(__name__)

data = json.load(open('log-agent2.conf'))

HTTPS_ENABLED = True
VERIFY_USER = True

API_HOST = data['address']
API_PORT = data['port']
API_CRT = data['cert_path']
API_KEY = data['cert_key_path']
API_CA_T = data['ca_cert_path']

def startup():
	url = "https://%s/agents" % data['siem_ip']
	headers = {'Content-type': 'application/json', 'Connection': 'close'}

	r = requests.post(
		url,
		# returns 401 if this agent has super agent
		json={'id': '5b27fd9c0bd44e1afc82a84e', 'logs': [{'host': 'sibalica'}]}, # send agent data from .conf file
		cert=('../certs/client.crt', '../certs/client.key'), # returns 406 without cert
		headers=headers,
		verify=API_CA_T
	)

	print(r.status_code)

	if r.status_code == 200 or r.status_code == 201:
		print(r)

@app.route("/update_supervisor", methods = ["PATCH"])
def update_supervisor():
	content = request.get_json(silent=True)
	print(content)

	data['super'] = {}
	data['super']['id'] = content['super']['id']['$oid'] if content['super']['id'] != None else None
	data['super']['address'] = content['super']['address']

	with open('log-agent2.conf','w') as file:
		file.write(json.dumps(data, indent=4, sort_keys=True))

	return "ok"

@app.route("/update", methods = ['PATCH'])
def update():
	content = request.get_json(silent=True)

	data["log_files"] = content["paths"]
	data["name"] = content["name"]

	with open('log-agent2.conf','w') as file:
		file.write(json.dumps(data, indent=4, sort_keys=True))

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
	# startup()
	serving.run_simple(
			API_HOST, API_PORT, app, ssl_context=context)

