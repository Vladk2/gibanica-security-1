import axios from "axios";

const host = "localhost:3000";
const AGENTS_API_URL = `https://${host}/agents`;

axios.defaults.headers.common["Authorization"] = `${localStorage.getItem(
  "token"
)}`;

function getAgents() {
  return axios
    .get(`${AGENTS_API_URL}`, {
      headers: {
        Accept: "application/json"
      }
    })
    .catch(err => console.log(err));
}

function updateAgent(data) {
  return axios.put(`${AGENTS_API_URL}/${data._id["$oid"]}`, data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });
}

export { getAgents, updateAgent };
