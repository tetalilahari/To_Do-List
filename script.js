let tasks = [];

function showTaskForm() {
  document.getElementById("task-form-container").style.display = 'block';
}

function hideTaskForm() {
  document.getElementById("task-form-container").style.display = 'none';
}

function addTask() {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  const dueTime = document.getElementById("task-time").value;

  if (title.trim() === '') {
    alert('Task title is required!');
    return;
  }

  const newTask = {
    title,
    description,
    dueTime: new Date(dueTime),
    id: Date.now(),
    completed: false,
    timerInterval: null 
  };

  tasks.push(newTask);
  renderTasks();

  document.getElementById("task-title").value = '';
  document.getElementById("task-description").value = '';
  document.getElementById("task-time").value = '';

  document.getElementById("task-form-container").style.display = 'none';

  checkTaskTime(newTask);
}

function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
      <strong>${task.title}</strong> - ${task.description}
      <p>Due: ${task.dueTime.toLocaleString()}</p>
      <p id="timer-${task.id}">Time Remaining: ${getTimeRemaining(task.dueTime)}</p>
      <button onclick="toggleCompletion(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
    `;
    taskList.appendChild(li);
  });
}

function toggleCompletion(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    if (!task.completed) {
      task.completed = true;
      clearInterval(task.timerInterval);
      renderTasks();
      showTaskCompletionNotification(task, 'completed');
    } else {
      task.completed = false;
      renderTasks();
    }
  }
}

function getTimeRemaining(dueTime) {
  const now = new Date();
  const timeDiff = dueTime - now;

  if (timeDiff <= 0) {
    return 'Task overdue';
  }

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
}

function checkTaskTime(task) {
  const interval = setInterval(() => {
    if (new Date() >= task.dueTime && !task.completed) {
      task.completed = true;
      renderTasks();
      showTaskCompletionNotification(task, 'overdue');
      clearInterval(interval);
    }
    const timerElement = document.getElementById(`timer-${task.id}`);
    if (timerElement) {
      timerElement.textContent = `Time Remaining: ${getTimeRemaining(task.dueTime)}`;
    }
  }, 1000);

  task.timerInterval = interval;
}

function showTaskCompletionNotification(task, status) {
  let message = '';
  if (status === 'overdue') {
    message = `The task "${task.title}" is overdue.`;
  } else if (task.completed) {
    message = `The task "${task.title}" is completed successfully!`;
  }

  alert(message);

  if (Notification.permission === "granted") {
    new Notification(`Task Status: ${task.title}`, {
      body: message,
      icon: 'task_icon.png',
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(`Task Status: ${task.title}`, {
          body: message,
          icon: 'task_icon.png',
        });
      }
    });
  }
}

renderTasks();
