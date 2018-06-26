import axios from "axios";

const host = "192.168.0.15";
const ALARM_RULES_API_URL = `https://${host}/alarm_rules`;

axios.defaults.headers.common["Authorization"] = `${localStorage.getItem(
  "token"
)}`;

function createAlarmRule(data) {
  return axios.post(`${ALARM_RULES_API_URL}`, data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });
}

export { createAlarmRule };
