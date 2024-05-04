const login_button = document.querySelector(".login-button");
const signup_button = document.querySelector(".signup-button");
const login_username = document.querySelector(".login-username");
const login_password = document.querySelector(".login-password");
const signup_username = document.querySelector(".signup-username");
const signup_password = document.querySelector(".signup-password");
let accepting_responses = true;
const url = "http://localhost:3000";

login_button.onclick = () => {
  if (accepting_responses) {
    accepting_responses = false;
    const username = login_username.value;
    const password = login_password.value;
    const login_data = {
      username: username ? username : "",
      password: password ? password : "",
    };

    console.log(login_data);
    fetch(`${url}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login_data),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((success) => {
        if (!success) {
          message("Login credentials are incorrect, please try again");
          accepting_responses = true;
        } else if (success) {
          window.location.href = "/home";
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
};

signup_button.onclick = () => {
  if (accepting_responses) {
    accepting_responses = false;
    const username = signup_username.value;
    const password = signup_password.value;
    const signup_data = {
      username: username ? username : "",
      password: password ? password : "",
    };

    fetch(`${url}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signup_data),
    })
      .then((response) => response.json())
      .then((success) => {
        if (!success) {
          message("Existing account with same email found");
          accepting_responses = true;
        } else if (success) {
          message("Signup successful, please log in");
          signup_username.value = "";
          signup_password.value = "";
          accepting_responses = true;
        }
      });
  }
};
