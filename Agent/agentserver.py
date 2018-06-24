from flask import Flask, request, jsonify
from werkzeug import serving

import ssl
import sys

import json,requests

app = Flask(__name__)

data = json.load(open('log-agent2.conf'))

HTTPS_ENABLED = True
VERIFY_USER = False

API_HOST = data['address']
API_PORT = data['port']
API_CRT = data['cert_path']
API_KEY = data['cert_key_path']
API_CA_T = data['ca_cert_path']

def startup():
	url = "https://%s/agents" % data['siem_ip']
	headers = {'Content-type': 'application/json', 'Connection': 'close'}

	r = requests.post(url, json=data,
					  headers=headers, verify=API_CA_T)

	if r.status_code == 200 or r.status_code == 201:
		print('Logs have been sent successfully')
		print(r)

@app.route("/hello")
def bleja():
	return "buja"

@app.route("/update", methods = ['PATCH'])
def update():
	content = request.get_json(silent=True);

	data["log_files"] = content["paths"]
	data["name"] = content["name"]

	with open('log-agent.conf','w') as file:
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
	serving.run_simple(
			API_HOST, API_PORT, app, ssl_context=context)

