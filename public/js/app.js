const form = document.querySelector('form');

//inputs values
const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const email = document.querySelector('#email');
const company = document.querySelector('#company');
const username = document.querySelector('#username');
const phoneNumber = document.querySelector('#phoneNumber');
const position = document.querySelector('#position');

//alerts
const alertSpot = document.querySelector('#alerts');

//actions
const btnAction = document.getElementById('btn-action');
const isLoading = document.getElementById('isLoading');

const API_URL = 'http://localhost:5050/';

form.addEventListener('submit', formSubmitted);

async function formSubmitted(event) {
  event.preventDefault();
  toggleButton(true);
  try {
    const results = await getResult(
      firstName.value,
      lastName.value,
      email.value,
      company.value,
      username.value,
      phoneNumber.value,
      position.value
    );

    if(results.hasOwnProperty('errors')) {
      const errors = results.errors;
      setAlerts(errors, true);
      toggleButton(false);
    } else {
      const message = results.message;
      setAlerts([message], false);
      toggleButton(false);
      form.reset();
    }

  } catch (error) {
    toggleButton(false);
    setAlerts(['something wrong happened'], true);
  }
}

function toggleButton(loading) {
  if(loading) {
    isLoading.style.display = 'block';
    btnAction.style.display = 'none';
  } else {
    isLoading.style.display = 'none';
    btnAction.style.display = 'block';
  }
}

async function getResult(firstName, lastName, email, company, username, phoneNumber, position) {
  const options = {
    method: 'POST',
    body: JSON.stringify({firstName, lastName, email, company, username, phoneNumber, position}),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const response = await fetch(API_URL, options);
  const data = await response.json();
  
  return data;
}

function setAlerts(messages, error) {
  alertSpot.innerHTML = '';
  if(error) {
    alertSpot.innerHTML = `
      ${messages.reduce((acc, cv) => {
        return acc + `
        <div class="alert alert-danger">
          <strong>Error!</strong> ${cv}
        </div>
        `
      }, '')}
    `;
  } else {
    alertSpot.innerHTML = `
      ${messages.reduce((acc, cv) => {
        return acc + `
        <div class="alert alert-success">
          <strong>Success!</strong> ${cv}
        </div>
        `
      }, '')}
    `;
  }
}