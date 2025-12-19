const form = document.getElementById("signup-form");
const errorDiv = document.getElementById("client-error");

if (form) {
  form.addEventListener("submit", async (e) => {
    errorDiv.textContent = "";
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const firstName = document.getElementById("first_name").value.trim();
    const lastName = document.getElementById("last_name").value.trim();
    const age = Number(document.getElementById("age").value);
    const password = document.getElementById("password").value;
    const area = document.getElementById("area").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const zipcode = document.getElementById("zipcode").value.trim();

    if (username.length < 3) {
      errorDiv.textContent = "Username must be at least 3 characters.";

      return;
    }
    if (username.length > 20 || !/^[A-Za-z0-9]+$/.test(username) || !/[A-Za-z]/.test(username)) {
      errorDiv.textContent = "Username must be 3-20 characters, letters/numbers only, and include at least one letter.";
      return;
    }

    if (firstName.length === 0 || lastName.length === 0) {
      errorDiv.textContent = "First and last name are required.";
      return;
    }
    if (!/^[A-Za-z][A-Za-z .'-]*$/.test(firstName) || firstName.length < 2) {
      errorDiv.textContent = "First name must be at least 2 letters and contain only letters/spaces.";
      return;
    }
    if (!/^[A-Za-z][A-Za-z .'-]*$/.test(lastName) || lastName.length < 2) {
      errorDiv.textContent = "Last name must be at least 2 letters and contain only letters/spaces.";
      return;
    }

    if (!Number.isInteger(age) || age < 13) {
      errorDiv.textContent ="Age must be at least 13.";
      return;
    }
    if (age > 120) {
      errorDiv.textContent = "Age must be a realistic value.";
      return;
    }

    if (password.length < 8) {
      errorDiv.textContent = "Password must be at least 8 characters long.";

      return;
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password) || /\s/.test(password)) {
      errorDiv.textContent = "Password must contain at least one letter, one number, and no spaces.";
      return;
    }

    if (!area) {
      errorDiv.textContent = "Neighborhood / area is required.";

      return;
    }

    if (!/^[A-Za-z][A-Za-z .'-]*$/.test(city) || city.length < 2) {
      errorDiv.textContent = "City must be at least 2 letters and contain only letters/spaces.";
      return;
    }

    if (!/^[A-Za-z][A-Za-z .'-]*$/.test(state) || state.length < 2) {
      errorDiv.textContent = "State must be at least 2 letters and contain only letters/spaces.";
      return;
    }

    if (!/^[A-Za-z][A-Za-z .'-]*$/.test(area) || area.length < 2) {
      errorDiv.textContent = "Neighborhood / area must be at least 2 letters and contain only letters/spaces.";
      return;
    }

    if (!/^\d{5}$/.test(zipcode)) {
      errorDiv.textContent ="zip code must be exactly 5 digits.";
      return;
    }

    try {
      const resp = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify({
          username,
          first_name: firstName,
          last_name: lastName,
          age,
          password,
          area,
          city,
          state,
          zipcode
        })
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        errorDiv.textContent = data.error || "Sign up failed.";
        return;
      }
      window.location.assign(data.redirect || "/");
    } catch (err) {
      errorDiv.textContent = "Network error. Please try again.";
    }
  });
}
