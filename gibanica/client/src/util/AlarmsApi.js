import axios from "axios";

const host = "192.168.0.13";
const ALARMS_API_URL = `https://${host}/alarms`;

axios.defaults.headers.common["Authorization"] = `${localStorage.getItem(
  "token"
)}`;

function getHello() {
  return axios.get("https://localhost:8000/hello");
}

function getAlarmsPerPage(page) {
  return axios
    .get(`${ALARMS_API_URL}`, {
      headers: {
        Accept: "application/json"
      }
    })
    .catch(err => console.log(err));
}

export { getAlarmsPerPage, getHello };
