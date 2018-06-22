import axios from "axios";

const host = "192.168.0.12";
const USER_API_URL = `https://${host}/users`;

function login(email, password) {
  return axios({
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    data: {
      email: email,
      password: password
    },
    url: `${USER_API_URL}/login`
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
      "Content-Type": "application/json"
    }
  });
}

function sendResetLink(email) {
  return axios({
    url: `${USER_API_URL}/password_reset_link`,
    method: "POST",
    data: {
      email: email,
      host: "localhost:5000"
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
}

function resetPassword(password, token) {
  return axios({
    url: `${USER_API_URL}/reset_password`,
    method: "POST",
    data: {
      token: token,
      password: password
    },
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export { login, logout, checkUserEmail, sendResetLink, resetPassword };
