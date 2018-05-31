//var React = require("react-on-rails");
import axios from "axios";

const host = "localhost:3000";
const USER_API_URL = `https://${host}/user`;

function login(formData, headers) {
  return axios({
    method: "POST",
    headers: headers,
    data: formData,
    url: `${USER_API_URL}/login`
  }).catch(err => {
    console.log(JSON.stringify(err));
  });
}

function logout() {
  localStorage.removeItem("token");
}

export { login, logout };
