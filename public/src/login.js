const login_button = document.querySelector(".login-button");
const signup_button = document.querySelector(".signup-button");
const login_username = document.querySelector(".login-username");
const login_password = document.querySelector(".login-password");
const signup_username = document.querySelector(".signup-username");
const signup_password = document.querySelector(".signup-password");

let accepting_responses = true;

login_button.onclick = () => {
    if (accepting_responses) {
        accepting_responses = false

        const login_data = {
            username: login_username.value,
            password: login_password.value,
        };
        
        fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(login_data),
        })
            .then((response) => response.json())
            .then((success) => {
                if (!success) {
                    message("Login credentials are incorrect, please try again");
                    accepting_responses = true
                    
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
        accepting_responses = false

        const signup_data = {
            username: signup_username.value,
            password: signup_password.value,
        };

        fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signup_data),
        })
            .then((response) => response.json())
            .then((success) => {
                if (!success) {
                    message("Existing account with same email found");
                    accepting_responses = true

                } else if (success) {
                    message("Signup successful, please log in");
                    signup_username.value = "";
                    signup_password.value = "";
                    accepting_responses = true
                }
            });
    }
};
