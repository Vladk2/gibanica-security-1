package propertyManager;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;

public class RequestsMonitoring {

	public void getLog(String username, String httpMethod) {
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("username",username);
		map.put("method",httpMethod);
		try {
			uploadToServer(map);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
	
	private void uploadToServer(HashMap<String, String> map) throws IOException{
        String query = "http://localhost:3000/logs";
        HashMap<String, HashMap> NOVAmapa = new HashMap<>();
        NOVAmapa.put("content", map);
        URL url = new URL(query);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setConnectTimeout(5000);
        conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        conn.setDoOutput(true);
        conn.setDoInput(true);
        conn.setRequestMethod("POST");
        
        OutputStream os = conn.getOutputStream();
        os.write(NOVAmapa.toString().getBytes("UTF-8"));
        os.close();
        System.out.println("JASTA");
        System.out.println(map);
        System.out.println(NOVAmapa);
        conn.disconnect();

	}
}
