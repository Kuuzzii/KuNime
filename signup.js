document.getElementById("signup-form").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission

  // Get the user data from the form
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Save the user credentials in localStorage
  localStorage.setItem("username", username);
  localStorage.setItem("password", password);

  alert("Account created successfully!");
  window.location.href = "login.html"; // Redirect to the login page after signup
});
