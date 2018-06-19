import axios from "axios";

const host = "192.168.0.13";
const AGENTS_API_URL = `https://${host}/agents`;

axios.defaults.headers.common["Authorization"] = `${localStorage.getItem(
  "token"
)}`;

function getAgents() {
  return axios.get(`${AGENTS_API_URL}`, {
    headers: {
      Accept: "application/json"
    }
  });
}

function updateAgent(data) {
  return axios.put(`${AGENTS_API_URL}/${data._id["$oid"]}`, data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });
}

function updateAgentsTree(data) {
  return axios.patch(`${AGENTS_API_URL}/update_hierarchy`, data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });
}

export { getAgents, updateAgent, updateAgentsTree };
