const host = "localhost:3000";
const LOGS_API_URL = `https://${host}/logs`;

function getLogsPerPage(page) {
  return fetch(`${LOGS_API_URL}?page=${page}`, {
    headers: {
      Accept: "application/json"
    }
  })
    .then(res => res.json())
    .catch(err => console.error(err));
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

export { getLogsPerPage, searchLogs };
