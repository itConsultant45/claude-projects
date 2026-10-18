const STORAGE_KEY = "quick-tasks";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const count = document.getElementById("task-count");
const clearDone = document.getElementById("clear-done");

let tasks = load();

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Storage unavailable (e.g. private mode); keep working in memory.
  }
}

function render() {
  list.innerHTML = "";
  for (const task of tasks) {
    const li = document.createElement("li");
    li.className = task.done ? "done" : "";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      update();
    });

    const text = document.createElement("span");
    text.textContent = task.text;

    const del = document.createElement("button");
    del.className = "delete";
    del.setAttribute("aria-label", "Delete task");
    del.textContent = "×";
    del.addEventListener("click", () => {
      tasks = tasks.filter((t) => t !== task);
      update();
    });

    li.append(checkbox, text, del);
    list.append(li);
  }
  const left = tasks.filter((t) => !t.done).length;
  count.textContent = `${left} task${left === 1 ? "" : "s"} left`;
}

function update() {
  save();
  render();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  input.value = "";
  update();
});

clearDone.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.done);
  update();
});

render();
