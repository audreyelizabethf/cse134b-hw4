// Elements
const comments = document.querySelector("#comments");
const info = document.querySelector("#info-area");

// Character Count
const limit = comments.maxLength;
const warningThreshold = 50;

function updateCounter() {
  const remaining = limit - comments.value.length;            // limit minus how many characters are typed

  if (remaining === 0) {
    // Limit reached
    info.textContent = `You have reached the ${limit}-character limit.`;
    info.classList.add("at-limit");
    info.classList.remove("warning");

  } else if (remaining <= warningThreshold) {
    // NEAR the limit: warning message + warning style
    info.textContent = `Only ${remaining} characters remaining.`;
    info.classList.add("warning");
    info.classList.remove("at-limit");

  } else {
    // Normal: just the count, no special style
    info.textContent = `${remaining} characters remaining.`;
    info.classList.remove("warning", "at-limit");
  }
}

comments.addEventListener("input", updateCounter);

info.hidden = false;
updateCounter();

// Validation messages

const fields = document.querySelectorAll("#name, #email, #comments");
const errorArea = document.querySelector("#error-area");

const fieldNames = {
    name: "Name",
    email: "Email",
    comments: "Comments"
};

// decide whats wrong with a field. return "" if nothing is wrong.
function getMessage(field) {
    const label = fieldNames[field.id];
    if (field.validity.valueMissing){
        return `${label} is required. Please fill it in.`
    }
    if (field.validity.typeMismatch) {
        return "Email must be a valid email address, like name@example.com."
    }
    if (field.validity.tooShort) {
        return `${label} must be at least ${field.minLength} characters (you've entered ${field.value.length}).`
    }
    return "";
}

// Clear old message, recheck, set new message
function validateField(field) {
    field.setCustomValidity("");
    const message = getMessage(field);
    field.setCustomValidity(message);
    return message;
}

function showError(field, message) {
    const errorText = document.querySelector(`#${field.id}-error`);
    errorText.textContent = message;
}

errorArea.hidden = false;

for (const field of fields) {
    validateField(field)
    let edited = false;
    field.addEventListener("input", () => {
    edited = true;
    const message = validateField(field);
    const errorText = document.querySelector(`#${field.id}-error`);
    if (errorText.textContent !== "") {
      showError(field, message);
    }
  });

  field.addEventListener("blur", () => {
    if (edited) {
      showError(field, validateField(field));
    }
  });

  // Submit attempt (click OR Enter): the browser fires "invalid"
  // on each bad field before blocking submission
  field.addEventListener("invalid", () => {
    showError(field, field.validationMessage);

    // record this failed attepts field, not the content
    form_errors.push({
    field: field.id,
    message: field.validationMessage,
    time: new Date().toISOString()
  });
  });
}

// Error History
const form_errors = [];
const formErrorsField = document.querySelector("#form-errors");
const form = document.querySelector(".contact-form");

// Recheck every field and counter against contents
function syncAll() {
  for (const field of fields) {
    const message = validateField(field);
    const errorText = document.querySelector(`#${field.id}-error`);
    if (errorText.textContent !== "") {
      showError(field, message);
    }
  }
  updateCounter();
}

// After the page is shown, including Back/Forward when the browser refills the fields without firing "input"
window.addEventListener("pageshow", syncAll);

// Right before the browser validates a submit. Pressing Enter in a field also triggers a "click" on the submit button, so this covers keyboard too.
const submitButton = form.querySelector('button[type="submit"]');
submitButton.addEventListener("click", syncAll);

// Submit (only when form is valid)
form.addEventListener("submit", () => {
  formErrorsField.value = JSON.stringify(form_errors);
});