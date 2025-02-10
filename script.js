// Get role from URL
const urlParams = new URLSearchParams(window.location.search);
const role = urlParams.get('role');

// Redirect to signup if no account
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Simulate login logic
  if (role === 'admin') {
    window.location.href = 'admin-dashboard.html';
  } else if (role === 'user') {
    window.location.href = 'user-dashboard.html';
  }
});

// Show signup prompt
if (role === 'admin') {
  document.getElementById('signupPrompt').innerHTML = "Don't have an account? <a href='admin-signup.html'>Sign up</a>";
} else if (role === 'user') {
  document.getElementById('signupPrompt').innerHTML = "Don't have an account? <a href='user-signup.html'>Sign up</a>";
}