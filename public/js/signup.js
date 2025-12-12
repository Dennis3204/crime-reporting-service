const form = document.getElementById("signup-form");
const errorDiv = document.getElementById("client-error");

if (form) {
  form.addEventListener("submit", (e) => {
    errorDiv.textContent = "";
    const username = document.getElementById("username").value.trim();
    const firstName = document.getElementById("first_name").value.trim();
    const lastName = document.getElementById("last_name").value.trim();
    const age = Number(document.getElementById("age").value);
    const password = document.getElementById("password").value;
    const street = document.getElementById("street").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const zipcode = document.getElementById("zipcode").value.trim();

    if (username.length < 3) {
      e.preventDefault();
      errorDiv.textContent = "Username must be at least 3 characters.";

      return;
    }

    if (firstName.length === 0 || lastName.length === 0) {
      e.preventDefault();
      errorDiv.textContent = "First and last name are required.";
      return;
    }

    if (!Number.isInteger(age) || age < 13) {
      e.preventDefault();
      errorDiv.textContent ="Age must be at least 13.";
      return;
    }

    if (password.length < 8) {
      e.preventDefault();
      errorDiv.textContent = "Password must be at least 8 characters long.";

      return;
    }

    if (street.length === 0 || city.length === 0 ||state.length === 0) {
      e.preventDefault();

      errorDiv.textContent = "Complete address is required.";
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(city)) {
      e.preventDefault();
      errorDiv.textContent = "City must contain only letters.";
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(state)) {
      e.preventDefault();
      errorDiv.textContent = "State must contain only letters.";
      return;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(street)) {
      e.preventDefault();
      errorDiv.textContent = "Street may only contain letters and numbers.";
      return;
    }

    if (!/^\d{5}$/.test(zipcode)) {
      e.preventDefault();
      errorDiv.textContent ="zip code must be exactly 5 digits.";
      return;
    }
  });
}
