package propertyManager;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;

import org.json.JSONException;
import org.json.JSONObject;

import com.fasterxml.jackson.databind.ObjectMapper;

public class RequestsMonitoring {

	HashMap<String, Object> json;
	ArrayList<HashMap<String, HashMap<String, String>>> logList;

	public RequestsMonitoring() {
		this.json = new HashMap<>();
		this.logList = new ArrayList<>();
		
	}

	public void getLog(String username, String httpMethod) {
		HashMap<String, String> map = new HashMap<String, String>();
		HashMap<String, HashMap<String, String>> content = new HashMap<>();
		map.put("username", username);
		map.put("method", httpMethod);
		content.put("content", map);
		try {
			logList.add(content);
			json.put("logs", logList);
			if(logList.size() >= 2) {
				uploadToServer();
				logList.clear();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
	

	
	private void uploadToServer() throws IOException, JSONException {
		ObjectMapper om = new ObjectMapper();
		
		String query = "http://localhost:3000/logs";
		URL url = new URL(query);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setConnectTimeout(5000);
		conn.setRequestProperty("Content-Type", "application/json");
		conn.setDoOutput(true);
		conn.setDoInput(true);
		conn.setRequestMethod("POST");

		OutputStream os = conn.getOutputStream();
		json.put("agent", "dragan");
		os.write(om.writeValueAsString(json).getBytes("UTF-8"));
		os.close();
		
		// read the response
        InputStream in = new BufferedInputStream(conn.getInputStream());
        String result = org.apache.commons.io.IOUtils.toString(in, "UTF-8");
        System.out.println(result);
        JSONObject jsonObject = new JSONObject(result);
        System.out.println(jsonObject.toString() + "AAAAAAAAAAAA");
		conn.disconnect();

	}	
	
}
