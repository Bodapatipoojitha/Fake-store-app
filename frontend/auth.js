const API_URL = "http://localhost:5000";

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await axios.post(`${API_URL}/register`, {
                name,
                email,
                password
            });

            document.getElementById("message").innerText =
                response.data.message;

            document.getElementById("message").style.color = "green";

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);

        } catch (error) {
            document.getElementById("message").innerText =
                error.response?.data?.message || "Registration failed";

            document.getElementById("message").style.color = "red";
        }
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            document.getElementById("message").innerText =
                "Login successful";

            document.getElementById("message").style.color = "green";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);

        } catch (error) {
            document.getElementById("message").innerText =
                error.response?.data?.message || "Login failed";

            document.getElementById("message").style.color = "red";
        }
    });
}
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

if (passwordInput && togglePassword) {
    togglePassword.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.innerText = "🙈";
        } else {
            passwordInput.type = "password";
            togglePassword.innerText = "👁";
        }
    });
}
