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

// JS is running, so show the info area and fill it right away
info.hidden = false;
updateCounter();