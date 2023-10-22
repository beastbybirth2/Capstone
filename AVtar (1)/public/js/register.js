document.addEventListener('DOMContentLoaded', () => {
  const registrationForm = document.getElementById('registrationForm');

  registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value; // Get the selected role value

    const userData = {
      name: name,
      email: email,
      password: password,
      role: role, // Update the key to 'role'
    };

    // Send the form data to the API endpoint using fetch()
    fetch('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          console.log('Registration successful!');
          location.href = '/auth/login';
        } else if (response.status === 409) {
          console.log('Unique email!');
          document.querySelector('.warning').textContent = "User with the given email already exists!";
        } else {
          console.log('Error during registration:', response.statusText);
        }
      })
      .catch(error => {
        console.log('Error during registration:', error);
      });
  });
});
