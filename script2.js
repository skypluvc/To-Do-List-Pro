const MAX_TASKS = 8;
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const tasksContainer = document.getElementById('tasks-container');
const progressCount = document.getElementById('progress-count');
const progressPercent = document.getElementById('progress-percent');
const progressFill = document.getElementById('progress-fill');
const circleText = document.getElementById('circle-text');
const listFullMessage = document.getElementById('list-full-message');

// Load data dari LocalStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    tasksContainer.innerHTML = '';
    
    if (tasks.length === 0) {
        tasksContainer.innerHTML = `<p style="text-align:center; color:#ccc;">No tasks today</p>`;
    }

    tasks.forEach(task => {
        const item = document.createElement('div');
        item.className = `task-item ${task.completed ? 'completed' : ''}`;
        item.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
        `;
        tasksContainer.appendChild(item);
    });

    updateUI();
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateUI() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Sembunyikan jika 0
    if (total === 0) {
        progressCount.textContent = "";
        progressPercent.textContent = "";
        circleText.textContent = "";
        progressFill.style.width = "0%";
    } else {
        progressCount.textContent = `${completed} / ${total}`;
        progressPercent.textContent = `${percent}%`;
        circleText.textContent = `${completed}/${total}`;
        progressFill.style.width = `${percent}%`;
    }

    listFullMessage.style.display = total >= MAX_TASKS ? 'block' : 'none';
}

function addTask() {
    const text = taskInput.value.trim();
    if (text && tasks.length < MAX_TASKS) {
        tasks.push({ id: Date.now(), text: text, completed: false });
        taskInput.value = '';
        renderTasks();
    }
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });

// Jalankan saat startup
renderTasks();