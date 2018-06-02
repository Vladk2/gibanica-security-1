import axios from "axios";

const host = "localhost:3000";
const LOGS_API_URL = `https://${host}/logs`;

axios.defaults.headers.common["Authorization"] = `${localStorage.getItem(
  "token"
)}`;

function getLogsPerPage(page) {
  return axios
    .get(`${LOGS_API_URL}?page=${page}`, {
      headers: {
        Accept: "application/json"
      }
    })
    .catch(err => console.err(err));
}

function getNumberOfLogsInsertedPerDay(n_of_days_ago) {
  return axios.get(`${LOGS_API_URL}/monthly_status`, {
    headers: {
      Accept: "application/json"
    }
  });
}

function getNumberOfLogsInsertedPerHost() {
  return axios.get(`${LOGS_API_URL}/host_status`, {
    headers: {
      Accept: "application/json"
    }
  });
}

function searchLogs(page, query) {
  return fetch(`https://${LOGS_API_URL}?page=${page}&query=${query}`, {
    headers: {
      Accept: "application/json"
    }
  })
    .then(res => res.json())
    .catch(err => console.error(err));
}

export {
  getLogsPerPage,
  searchLogs,
  getNumberOfLogsInsertedPerDay,
  getNumberOfLogsInsertedPerHost
};
