// Google Sign-In Integration
gapi.load('auth2', function() {
  gapi.auth2.init({
    client_id: 'YOUR_GOOGLE_CLIENT_ID' // Replace with your actual Google Client ID
  });
});

// This function is called when the user successfully signs in with Google
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log("User signed in: " + profile.getName());

  // After successful sign-in, save user data to localStorage
  localStorage.setItem('username', profile.getName());
  localStorage.setItem('email', profile.getEmail());

  // Redirect to the home page after successful login
  window.location.href = "index.html"; // Redirect to the home page after successful login
}

// Form-based login validation
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
    window.location.href = "index.html"; // Redirect to the main page after successful login
  } else {
    alert("Invalid username or password. Please try again.");
  }
});
