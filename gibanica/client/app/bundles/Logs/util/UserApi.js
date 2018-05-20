//var React = require("react-on-rails");

const host = "localhost:3000";
const USER_API_URL = `https://${host}/user`;

function login(formData, headers) {
  return fetch(`${USER_API_URL}/login`, {
    headers: headers,
    body: formData,
    method: "POST"
  })
    .then(res => res.status)
    .catch(err => console.error(err));
}

export { login };
