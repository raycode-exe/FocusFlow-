/* =========================
   FOCUSFLOW
   SCRIPT.JS
========================= */

/* =========================
   ELEMENTS
========================= */

const todoInput = document.getElementById("todoInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const todoList = document.getElementById("todoList");

const notesArea = document.getElementById("notesArea");
const saveNotesBtn = document.getElementById("saveNotesBtn");

const taskCount = document.getElementById("taskCount");
const completedCount = document.getElementById("completedCount");
const noteCount = document.getElementById("noteCount");

const themeToggle = document.getElementById("themeToggle");

const timerDisplay = document.getElementById("timerDisplay");
const sessionType = document.getElementById("sessionType");

const startTimer = document.getElementById("startTimer");
const pauseTimer = document.getElementById("pauseTimer");
const resetTimer = document.getElementById("resetTimer");

const installBtn = document.getElementById("installBtn");

/* =========================
   LOCAL STORAGE
========================= */

let todos = JSON.parse(localStorage.getItem("focusflow_todos")) || [];

let notes =
  localStorage.getItem("focusflow_notes") || "";

let darkMode =
  localStorage.getItem("focusflow_theme") || "light";

/* =========================
   DARK MODE
========================= */

if (darkMode === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {

    localStorage.setItem(
      "focusflow_theme",
      "dark"
    );

    themeToggle.textContent = "☀️";

  } else {

    localStorage.setItem(
      "focusflow_theme",
      "light"
    );

    themeToggle.textContent = "🌙";
  }
});

/* =========================
   NOTES
========================= */

notesArea.value = notes;

saveNotesBtn.addEventListener("click", () => {

  localStorage.setItem(
    "focusflow_notes",
    notesArea.value
  );

  updateDashboard();

  saveNotesBtn.textContent = "Saved ✓";

  setTimeout(() => {
    saveNotesBtn.textContent =
      "Save Notes";
  }, 1500);

});

/* =========================
   TODO FUNCTIONS
========================= */

function saveTodos() {

  localStorage.setItem(
    "focusflow_todos",
    JSON.stringify(todos)
  );

  updateDashboard();
}

function addTask() {

  const text = todoInput.value.trim();

  if (!text) return;

  todos.push({
    id: Date.now(),
    text,
    completed: false
  });

  todoInput.value = "";

  saveTodos();
  renderTodos();
}

function deleteTask(id) {

  todos = todos.filter(
    task => task.id !== id
  );

  saveTodos();
  renderTodos();
}

function toggleTask(id) {

  todos = todos.map(task => {

    if (task.id === id) {

      task.completed =
        !task.completed;
    }

    return task;
  });

  saveTodos();
  renderTodos();
}

function renderTodos() {

  todoList.innerHTML = "";

  todos.forEach(task => {

    const li =
      document.createElement("li");

    li.className = "todo-item";

    li.innerHTML = `
      <div class="todo-left">
        <input
          type="checkbox"
          ${task.completed ? "checked" : ""}
        >

        <span class="${
          task.completed
            ? "completed"
            : ""
        }">
          ${task.text}
        </span>
      </div>

      <div class="todo-actions">
        <button class="delete-btn">
          ✕
        </button>
      </div>
    `;

    li.querySelector("input")
      .addEventListener(
        "change",
        () => toggleTask(task.id)
      );

    li.querySelector(".delete-btn")
      .addEventListener(
        "click",
        () => deleteTask(task.id)
      );

    todoList.appendChild(li);
  });

  updateDashboard();
}

addTaskBtn.addEventListener(
  "click",
  addTask
);

todoInput.addEventListener(
  "keypress",
  e => {

    if (e.key === "Enter") {
      addTask();
    }

  }
);

/* =========================
   DASHBOARD STATS
========================= */

function updateDashboard() {

  taskCount.textContent =
    todos.length;

  completedCount.textContent =
    todos.filter(
      t => t.completed
    ).length;

  const noteText =
    notesArea.value.trim();

  noteCount.textContent =
    noteText.length > 0
      ? 1
      : 0;
}

/* =========================
   POMODORO TIMER
========================= */

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let currentTime = FOCUS_TIME;
let timer = null;
let isRunning = false;
let isFocus = true;

function updateTimerDisplay() {

  const minutes =
    Math.floor(currentTime / 60);

  const seconds =
    currentTime % 60;

  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  sessionType.textContent =
    isFocus
      ? "Focus Session"
      : "Break Time";
}

function startPomodoro() {

  if (isRunning) return;

  isRunning = true;

  timer = setInterval(() => {

    currentTime--;

    updateTimerDisplay();

    if (currentTime <= 0) {

      clearInterval(timer);

      isFocus = !isFocus;

      currentTime =
        isFocus
          ? FOCUS_TIME
          : BREAK_TIME;

      updateTimerDisplay();

      playNotification();

      isRunning = false;

      startPomodoro();
    }

  }, 1000);
}

function pausePomodoro() {

  clearInterval(timer);

  isRunning = false;
}

function resetPomodoro() {

  clearInterval(timer);

  isRunning = false;

  isFocus = true;

  currentTime =
    FOCUS_TIME;

  updateTimerDisplay();
}

function playNotification() {

  try {

    const audio =
      new Audio(
        "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
      );

    audio.play();

  } catch (err) {
    console.log(err);
  }
}

startTimer.addEventListener(
  "click",
  startPomodoro
);

pauseTimer.addEventListener(
  "click",
  pausePomodoro
);

resetTimer.addEventListener(
  "click",
  resetPomodoro
);

/* =========================
   QUOTES
========================= */

const quotes = [

  "Success is the sum of small efforts repeated every day.",

  "Focus on progress, not perfection.",

  "Small steps every day lead to big results.",

  "Discipline beats motivation.",

  "Done is better than perfect.",

  "Deep work creates extraordinary results.",

  "Consistency compounds over time."
];

const quoteElement =
  document.getElementById("quote");

if (quoteElement) {

  const randomQuote =
    quotes[
      Math.floor(
        Math.random() * quotes.length
      )
    ];

  quoteElement.textContent =
    randomQuote;
}

/* =========================
   PWA INSTALL
========================= */

let deferredPrompt;

window.addEventListener(
  "beforeinstallprompt",
  e => {

    e.preventDefault();

    deferredPrompt = e;

    installBtn.classList.remove(
      "hidden"
    );
  }
);

installBtn.addEventListener(
  "click",
  async () => {

    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    installBtn.classList.add(
      "hidden"
    );

    deferredPrompt = null;
  }
);

/* =========================
   SERVICE WORKER
========================= */

if (
  "serviceWorker" in navigator
) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register(
          "./service-worker.js"
        )
        .then(() =>
          console.log(
            "Service Worker Registered"
          )
        )
        .catch(err =>
          console.log(err)
        );
    }
  );
}

/* =========================
   INITIAL LOAD
========================= */

renderTodos();
updateDashboard();
updateTimerDisplay();

/* =========================
   ONLINE/OFFLINE STATUS
========================= */

window.addEventListener(
  "offline",
  () => {

    console.log(
      "App Offline"
    );
  }
);

window.addEventListener(
  "online",
  () => {

    console.log(
      "App Online"
    );
  }
);