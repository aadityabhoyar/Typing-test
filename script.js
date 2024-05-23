// Random Quotes Api URL
let quoteApiUrl = "https://api.quotable.io/random?minLength=20&maxLength=50";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;
let wordIndex = 0;
let perWordData = [];

// Update the quote length based on the selected difficulty
const updateDifficulty = () => {
  const difficulty = document.getElementById('difficulty-select').value;
  if (difficulty === "easy") {
    quoteApiUrl = "https://api.quotable.io/random?minLength=20&maxLength=50";
  } else if (difficulty === "normal") {
    quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
  } else if (difficulty === "hard") {
    quoteApiUrl = "https://api.quotable.io/random?minLength=100&maxLength=150";
  }
  renderNewQuote();
}

// Display random quotes
const renderNewQuote = async () => {
  const response = await fetch(quoteApiUrl);
  let data = await response.json();
  quote = data.content;
  let arr = quote.split("").map((value) => {
    return "<span class='quote-chars'>" + value + "</span>";
  });
  quoteSection.innerHTML = arr.join("");
};

// Logic for comparing input words with quote
userInput.addEventListener("input", () => {
  let quoteChars = document.querySelectorAll(".quote-chars");
  quoteChars = Array.from(quoteChars);
  let userInputChars = userInput.value.split("");

  quoteChars.forEach((char, index) => {
    if (char.innerText == userInputChars[index]) {
      char.classList.add("success");
    } else if (userInputChars[index] == null) {
      if (char.classList.contains("success")) {
        char.classList.remove("success");
      } else {
        char.classList.remove("fail");
      }
    } else {
      if (!char.classList.contains("fail")) {
        mistakes += 1;
        char.classList.add("fail");
      }
      document.getElementById("mistakes").innerText = mistakes;
    }

    let check = quoteChars.every((element) => {
      return element.classList.contains("success");
    });
    if (check) {
      displayResult();
    }
  });

  // Record per-word data
  if (userInput.value.endsWith(' ') || userInput.value.endsWith('.')) {
    const wordsTyped = userInput.value.trim().split(' ').length;
    const timeTaken = (60 - time) / 60;
    const currentWpm = (wordsTyped / timeTaken).toFixed(2);
    const currentAccuracy = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100);

    // Store only mistakes for specific words
    perWordData.push({
      wpm: currentWpm,
      accuracy: currentAccuracy,
      mistake: userInput.value.split(' ').map(word => word.trim()).includes(quote.split(' ')[wordsTyped - 1].trim()) ? 0 : 1
    });
  }
});

// Update Timer on screen
function updateTimer() {
  if (time == 0) {
    displayResult();
  } else {
    document.getElementById("timer").innerText = --time + "s";
  }
}

// Sets timer
const timeReduce = () => {
  time = 60;
  timer = setInterval(updateTimer, 1000);
};

// End Test and Submit Results
const displayResult = () => {
  clearInterval(timer);
  userInput.disabled = true;
  let timeTaken = 1;
  if (time != 0) {
    timeTaken = (60 - time) / 60;
  }
  const wpm = (userInput.value.length / 5 / timeTaken).toFixed(2);
  const accuracy = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100);

  document.getElementById("wpm-input").value = wpm;
  document.getElementById("accuracy-input").value = accuracy;
  document.getElementById("mistakes-input").value = mistakes;
  document.getElementById("per-word-data-input").value = JSON.stringify(perWordData);

  document.getElementById("result-form").submit();
};

// Start Test
const startTest = () => {
  mistakes = 0;
  timer = "";
  wordIndex = 0;
  perWordData = [];
  userInput.disabled = false;
  timeReduce();
  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";
};

// Reset Test
const resetTest = () => {
  clearInterval(timer);
  mistakes = 0;
  timer = "";
  wordIndex = 0;
  perWordData = [];
  time = 60;
  document.getElementById("timer").innerText = "0s";
  document.getElementById("mistakes").innerText = "0";
  userInput.value = "";
  userInput.disabled = true;
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  renderNewQuote();
};

window.onload = () => {
  userInput.value = "";
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  renderNewQuote();
};
