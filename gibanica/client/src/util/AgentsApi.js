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

function updateAgents() {
  // update agents
}

export { getAgents, updateAgents };
