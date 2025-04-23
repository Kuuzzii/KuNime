// Handle the login form submission
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Normally, you would authenticate with the server here
  // For this example, we are simulating a successful login
  if (username === 'user' && password === 'password123') {
    // Save the user's login status in localStorage
    localStorage.setItem('userLoggedIn', 'true');
    
    // Redirect to the homepage after successful login
    window.location.href = 'index.html';
  } else {
    alert('Invalid username or password!');
  }
});
