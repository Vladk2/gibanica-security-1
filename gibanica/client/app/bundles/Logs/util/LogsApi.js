import axios from "axios";

const host = "localhost:3000";
const LOGS_API_URL = `https://${host}/logs`;

function getLogsPerPage(page) {
  return axios
    .get(`${LOGS_API_URL}?page=${page}`, {
      headers: {
        Accept: "application/json",
        Authorization: `${localStorage.getItem("token")}`
      }
    })
    .then(res => res.json())
    .catch(err => console.err(err));
  /*return fetch(`${LOGS_API_URL}?page=${page}`, {
    headers: {
      Accept: "application/json"
    }
  })
    .then(res => res.json())
    .catch(err => console.error(err));*/
}

function getLogsPageAfterLogin() {
  return axios
    .get(`${LOGS_API_URL}?home=1`, {
      headers: {
        Authorization: `${localStorage.getItem("token")}`
      }
    })
    .catch(err => console.log(err));
}

function searchLogs(page, query) {
  return fetch(`https://${LOGS_API_URL}?page=${page}` + `&query=${query}`, {
    headers: {
      Accept: "application/json"
    }
  })
    .then(res => res.json())
    .catch(err => console.error(err));
}

export { getLogsPerPage, getLogsPageAfterLogin, searchLogs };
