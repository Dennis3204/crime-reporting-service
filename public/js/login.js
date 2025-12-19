const form = document.getElementById("login-form");
const errorDiv = document.getElementById("client-error");

if (form) {
  form.addEventListener("submit", async (e) => {
    errorDiv.textContent = "";
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    if (!username || !password) {
      errorDiv.textContent = "Username and password are required.";
      return;
    }
    if (username.length < 3) {
      errorDiv.textContent = "Username must be at least 3 characters.";
      return;
    }
    if (!/^[A-Za-z0-9]+$/.test(username) || !/[A-Za-z]/.test(username)) {
      errorDiv.textContent = "Username must be 3-20 characters, letters/numbers only, and include at least one letter.";
      return;
    }

    if (password.length < 8) {
      errorDiv.textContent = "Password must be at least 8 characters.";

      return;
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      errorDiv.textContent = "Password must contain at least one letter and one number.";
      return;
    }

    try {
      const resp = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify({ username, password })
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        errorDiv.textContent = data.error || "Login failed.";
        return;
      }
      window.location.assign(data.redirect || "/");
    } catch (err) {
      errorDiv.textContent = "Network error. Please try again.";
    }
  });
}
