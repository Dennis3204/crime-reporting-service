const form = document.getElementById("login-form");
const errorDiv = document.getElementById("client-error");

if (form) {
  form.addEventListener("submit", (e) => {
    errorDiv.textContent = "";
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    if (!username || !password) {
      e.preventDefault();
      errorDiv.textContent = "Username and password are required.";
      return;
    }
    if (username.length < 3) {
      e.preventDefault();
      errorDiv.textContent = "Username must be at least 3 characters.";
      return;
    }

    if (password.length < 8) {
      e.preventDefault();
      errorDiv.textContent = "Password must be at least 8 characters.";

      return;
    }
  });
}
