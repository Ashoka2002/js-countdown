const inputContainer = document.getElementById("input-container");
const form = document.getElementById("countdownForm");
const dateEl = document.getElementById("date-picker");
const title = document.getElementById("title");

const countdownEl = document.getElementById("countdown");
const countdownTitleEl = document.getElementById("countdown-title");
const countdownResetBtn = document.getElementById("countdown-reset-btn");
const timeElements = document.querySelectorAll("#countdown ul li span");

const completeEl = document.getElementById("complete");
const completeElInfo = document.getElementById("Complete-info");
const completeBtn = document.getElementById("new-countdown");

let countdownTitle = "";
let countdownDate = "";
let countdownValue = new Date();

let countdownActive;
let countdownCompleted = false;
let savedCountdownObj;

let second = 1000;
let minute = second * 60;
let hour = minute * 60;
let day = hour * 24;

// Set input date min-value with today date So we can't selet past date from today
const today = new Date().toISOString().split("T")[0];
dateEl.setAttribute("min", today);

// Populate countdown / complete ui
function updateDom() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;
    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    // Hide input
    inputContainer.hidden = true;

    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} Finished on ${countdownDate}`;
      completeEl.hidden = false;
      countdownCompleted = true;
      return;
    }

    //Populating countdown
    countdownTitleEl.textContent = countdownTitle;
    timeElements[0].textContent = days;
    timeElements[1].textContent = hours;
    timeElements[2].textContent = minutes;
    timeElements[3].textContent = seconds;

    // show countdown
    countdownEl.hidden = false;
  }, second);
}

// Get value from inputs
function updateCountdown(e) {
  e.preventDefault();
  countdownTitle = e.target[0].value;
  countdownDate = e.target[1].value;
  if (!countdownTitle || !countdownDate) return alert("Please Enter Valid Date And Title");
  // Get number version of date, updateDom
  countdownValue = new Date(countdownDate).getTime();
  savedCountdownObj = {
    title: countdownTitle,
    date: countdownDate,
    dateInValue: countdownValue,
  };
  localStorage.setItem("countdown", JSON.stringify(savedCountdownObj));
  updateDom();
}

// Reset All Values
function resetAndRestart() {
  // Hide Countdown & show Input
  countdownEl.hidden = true;
  inputContainer.hidden = false;

  // Stop the Countdown
  clearInterval(countdownActive);
  // Remove localstorage
  localStorage.removeItem("countdown");
  countdownDate = "";
  countdownTitle = "";

  // if Countdown Complted clear inputs
  if (countdownCompleted) {
    completeEl.hidden = true;
    title.value = "";
    dateEl.value = "";
    countdownCompleted = false;
  }
}

// Event Listeners
form.addEventListener("submit", updateCountdown);
countdownResetBtn.addEventListener("click", resetAndRestart);
completeBtn.addEventListener("click", resetAndRestart);

// Restore the previous countdown if it exist
(function restorePreviousCountdown() {
  savedCountdownObj = JSON.parse(localStorage.getItem("countdown"));
  if (!savedCountdownObj) return;
  inputContainer.hidden = true;
  countdownTitle = savedCountdownObj.title;
  countdownDate = savedCountdownObj.date;
  countdownValue = savedCountdownObj.dateInValue;
  updateDom();
})();
