from flask import Flask, request, jsonify
import json,requests

app = Flask(__name__)
data = json.load(open('log-agent.conf'))

def startup():
	url = "https://192.168.0.12/agents" 
	headers = {'Content-type': 'application/json', 'Connection': 'close'}

	r = requests.post(url, json=data,
					  headers=headers, verify='cert.pem')

	if r.status_code == 200 or r.status_code == 201:
		print('Logs have been sent successfully')
		print(r)

@app.route("/update", methods = ['PATCH'])
def hello():
	content = request.get_json(silent=True);
	data["log_files"] = content["paths"]
	data["name"] = content["name"]                                    
	with open('log-agent.conf','w') as file: 
		file.write(json.dumps(data, indent=4, sort_keys=True))

	return jsonify(content)


if __name__ == "__main__":
	startup()
	app.run(host="192.168.0.13",port=9000)
	# app.run(ssl_context=('cert.pem', 'key.pem')) 
	
	