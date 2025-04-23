// Listen for the form submission
document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission

  // Get the user data from the form
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Retrieve the stored username and password from localStorage
  const storedUsername = localStorage.getItem("username");
  const storedPassword = localStorage.getItem("password");

  // Check if entered credentials match the stored credentials
  if (username === storedUsername && password === storedPassword) {
    alert("Login successful!");
    localStorage.setItem('userLoggedIn', true); // Mark user as logged in
    window.location.href = "index.html"; // Redirect to the main page after successful login
  } else {
    alert("Invalid username or password. Please try again.");
  }
});
