/* ==========================
   FOCUSFLOW V2
========================== */

/* NAVIGATION */

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".nav-btn");

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const pageId =
            button.dataset.page;

        pages.forEach(page =>
            page.classList.remove("active")
        );

        navButtons.forEach(btn =>
            btn.classList.remove("active-nav")
        );

        document
            .getElementById(pageId)
            .classList.add("active");

        button.classList.add("active-nav");
    });

});

/* DATE */

const currentDate =
document.getElementById("currentDate");

const today = new Date();

currentDate.textContent =
today.toDateString();

/* DARK MODE */

const themeToggle =
document.getElementById("themeToggle");

const savedTheme =
localStorage.getItem(
    "focusflow_theme"
);

if(savedTheme === "dark"){

    document.body.classList.add(
        "dark"
    );

    themeToggle.textContent = "☀️";
}

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );

        if(
            document.body.classList.contains(
                "dark"
            )
        ){

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
    }
);

/* TASKS */

const taskInput =
document.getElementById("taskInput");

const taskCategory =
document.getElementById("taskCategory");

const addTaskBtn =
document.getElementById("addTaskBtn");

const taskList =
document.getElementById("taskList");

let tasks =
JSON.parse(
localStorage.getItem(
"focusflow_tasks"
)
) || [];

function saveTasks(){

    localStorage.setItem(
        "focusflow_tasks",
        JSON.stringify(tasks)
    );

    updateDashboard();
}

function renderTasks(){

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const li =
        document.createElement("li");

        li.className =
        "task-item";

        li.innerHTML = `

        <div class="task-info">

            <strong class="${
                task.completed
                ? "completed"
                : ""
            }">

                ${task.text}

            </strong>

            <span class="task-category">

                ${task.category}

            </span>

        </div>

        <div>

            <button onclick="
            toggleTask(${task.id})
            ">
            ✓
            </button>

            <button onclick="
            deleteTask(${task.id})
            ">
            ✕
            </button>

        </div>

        `;

        taskList.appendChild(li);
    });

    updateDashboard();
}

function addTask(){

    const text =
    taskInput.value.trim();

    if(!text) return;

    tasks.push({

        id: Date.now(),

        text,

        category:
        taskCategory.value,

        completed:false
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();
}

function toggleTask(id){

    tasks = tasks.map(task => {

        if(task.id === id){

            task.completed =
            !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

function deleteTask(id){

    tasks = tasks.filter(
        task =>
        task.id !== id
    );

    saveTasks();
    renderTasks();
}

addTaskBtn.addEventListener(
    "click",
    addTask
);

/* NOTES */

const notesArea =
document.getElementById(
    "notesArea"
);

const saveNoteBtn =
document.getElementById(
    "saveNoteBtn"
);

const saveStatus =
document.getElementById(
    "saveStatus"
);

notesArea.value =
localStorage.getItem(
"focusflow_notes"
) || "";

notesArea.addEventListener(
    "input",
    () => {

        localStorage.setItem(
            "focusflow_notes",
            notesArea.value
        );

        saveStatus.textContent =
        "Auto Saved ✓";
    }
);

saveNoteBtn.addEventListener(
    "click",
    () => {

        localStorage.setItem(
            "focusflow_notes",
            notesArea.value
        );

        saveStatus.textContent =
        "Saved Successfully ✓";
    }
);

/* DASHBOARD */

function updateDashboard(){

    const total =
    tasks.length;

    const completed =
    tasks.filter(
        task =>
        task.completed
    ).length;

    const pending =
    total - completed;

    document.getElementById(
        "totalTasks"
    ).textContent = total;

    document.getElementById(
        "completedTasks"
    ).textContent =
    completed;

    document.getElementById(
        "pendingTasks"
    ).textContent =
    pending;

    const percentage =
    total === 0
    ? 0
    : Math.round(
        completed /
        total * 100
      );

    document.getElementById(
        "progressFill"
    ).style.width =
    percentage + "%";

    document.getElementById(
        "progressText"
    ).textContent =
    percentage +
    "% Completed";
}

/* QUOTES */

const quotes = [

"Stay focused and never quit.",

"Success starts with consistency.",

"Discipline beats motivation.",

"Small progress is still progress.",

"Focus on the goal, not the obstacle.",

"Done is better than perfect."
];

const quote =
document.getElementById(
"quote"
);

quote.textContent =
quotes[
Math.floor(
Math.random() *
quotes.length
)
];

/* POMODORO */

let focusTime =
25 * 60;

let currentTime =
focusTime;

let timer = null;

let focusSessions =
parseInt(
localStorage.getItem(
"focus_sessions"
)
) || 0;

document.getElementById(
"focusSessions"
).textContent =
focusSessions;

const timerDisplay =
document.getElementById(
"timerDisplay"
);

function updateTimer(){

    const min =
    Math.floor(
        currentTime / 60
    );

    const sec =
    currentTime % 60;

    timerDisplay.textContent =

    `${String(min).padStart(2,"0")}
    :
    ${String(sec).padStart(2,"0")}`

    .replace(/\s/g,'');
}

document
.getElementById("startBtn")
.addEventListener(
"click",
() => {

if(timer) return;

timer = setInterval(() => {

currentTime--;

updateTimer();

if(currentTime <= 0){

clearInterval(timer);

timer = null;

focusSessions++;

localStorage.setItem(
"focus_sessions",
focusSessions
);

document.getElementById(
"focusSessions"
).textContent =
focusSessions;

alert(
"Focus Session Completed!"
);

currentTime =
focusTime;

updateTimer();
}

},1000);

}
);

document
.getElementById("pauseBtn")
.addEventListener(
"click",
() => {

clearInterval(timer);

timer = null;

}
);

document
.getElementById("resetBtn")
.addEventListener(
"click",
() => {

clearInterval(timer);

timer = null;

currentTime =
focusTime;

updateTimer();

}
);

/* CLEAR DATA */

document
.getElementById(
"clearDataBtn"
)
.addEventListener(
"click",
() => {

const confirmDelete =
confirm(
"Delete all saved data?"
);

if(confirmDelete){

localStorage.clear();

location.reload();
}

}
);

/* INITIAL LOAD */

renderTasks();
updateDashboard();
updateTimer();
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
