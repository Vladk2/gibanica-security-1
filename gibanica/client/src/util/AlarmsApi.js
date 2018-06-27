import axios from "axios";

const host = "192.168.0.13";
const ALARMS_API_URL = `https://${host}/alarms`;

axios.defaults.headers.common["Authorization"] = `${localStorage.getItem(
  "token"
)}`;

function getAlarmsCount() {
  return axios.get(`${ALARMS_API_URL}/system_status`);
}

function getAlarmsCountPerHost() {
  return axios.get(`${ALARMS_API_URL}/host_status`);
}

function getAlarmsPerPage(page) {
  return axios
    .get(`${ALARMS_API_URL}?page=${page}`, {
      headers: {
        Accept: "application/json"
      }
    })
    .catch(err => console.log(err));
}

export { getAlarmsPerPage, getAlarmsCount, getAlarmsCountPerHost };
