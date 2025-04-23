// Handle the signup form submission
document.getElementById('signup-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission

  const newUsername = document.getElementById('new-username').value;
  const newPassword = document.getElementById('new-password').value;

  // Normally, you'd store the user details in a database here
  // For now, we simulate a successful signup by storing it in localStorage

  localStorage.setItem('userLoggedIn', 'true'); // Automatically log in the user
  localStorage.setItem('username', newUsername); // Store the username

  // Redirect to the homepage after signup
  window.location.href = 'index.html';
});
