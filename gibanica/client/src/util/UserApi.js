//var React = require("react-on-rails");
import axios from "axios";

const host = "localhost:3000";
const USER_API_URL = `https://${host}/users`;

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

function checkUserEmail(email) {
  return axios({
    url: `${USER_API_URL}/email_valid`,
    method: "POST",
    data: {
      email: email
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }).catch(err => console.log(err));
}

function sendResetLink(email) {
  return axios({
    url: `${USER_API_URL}/password_reset_link`,
    method: "POST",
    data: {
      email: email
    },
    headers: {
      Accept: "application/json",
      ContentType: "application/json"
    }
  }).catch(err => console.log(err));
}

export { login, logout, checkUserEmail, sendResetLink };
