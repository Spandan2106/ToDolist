let taskInput = document.getElementById('task-input');
let addBtn = document.getElementById('add-btn');
let taskForm = document.getElementById('task-form');
let taskList = document.getElementById('task-list');
let filterBtns = document.querySelectorAll('.filter-btn');
let toast = document.getElementById('toast');
let task = [];
let currentFilter = 'all';
let localstoragedata = localStorage.getItem("task array");

if (localstoragedata != null) {
    let ogdata = JSON.parse(localstoragedata);
    task = ogdata;
    maketodo();
}

// Add task on button click or form submit
function addTask() {
    let query = taskInput.value.trim();
    taskInput.value = "";
    if (query === "") {
        showToast("Please enter a task!", "error");
        return;
    }

    let taskObj = {
        id: Date.now(),
        text: query,
        completed: false
    };
    task.push(taskObj);
    localStorage.setItem("task array", JSON.stringify(task));
    maketodo();
    showToast("Task added successfully!", "success");
}

addBtn.addEventListener("click", addTask);
taskForm.addEventListener("submit", function(e) {
    e.preventDefault();
    addTask();
});

// Keyboard support: Enter to add
taskInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// Filter tasks
filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        maketodo();
    });
});

function maketodo() {
    taskList.innerHTML = "";
    let filteredTasks = task.filter(taskItem => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'pending') return !taskItem.completed;
        if (currentFilter === 'completed') return taskItem.completed;
    });

    filteredTasks.forEach(taskItem => {
        let { id, text, completed } = taskItem;
        let element = document.createElement('div');
        element.innerHTML = `
            <input type="checkbox" class="complete-checkbox" ${completed ? 'checked' : ''}>
            <span class="task ${completed ? 'completed' : ''}" contenteditable="false">${text}</span>
            <button class='edit'><i class="fas fa-edit"></i></button>
            <button class='delete'><i class="fas fa-trash"></i></button>
        `;
        element.classList.add('todo', 'fade-in');
        if (completed) element.classList.add('completed');

        let completeCheckbox = element.querySelector('.complete-checkbox');
        let delbtn = element.querySelector('.delete');
        let editbtn = element.querySelector('.edit');
        let taskText = element.querySelector('.task');

        // Toggle complete
        completeCheckbox.addEventListener("change", function() {
            task = task.map(taskobj => {
                if (taskobj.id === id) {
                    taskobj.completed = this.checked;
                }
                return taskobj;
            });
            localStorage.setItem("task array", JSON.stringify(task));
            maketodo();
        });

        // Delete Task
        delbtn.addEventListener("click", function() {
            element.classList.add('slide-out');
            setTimeout(() => {
                task = task.filter(taskobj => taskobj.id != id);
                localStorage.setItem("task array", JSON.stringify(task));
                maketodo();
            }, 300);
        });

        // Edit Task
        editbtn.addEventListener("click", function() {
            if (editbtn.innerHTML === '<i class="fas fa-edit"></i>') {
                taskText.setAttribute('contenteditable', 'true');
                taskText.focus();
                editbtn.innerHTML = '<i class="fas fa-save"></i>';
            } else {
                taskText.setAttribute('contenteditable', 'false');
                let updatedText = taskText.innerText.trim();
                if (updatedText !== "") {
                    task = task.map(taskobj => {
                        if (taskobj.id === id) {
                            taskobj.text = updatedText;
                        }
                        return taskobj;
                    });
                    localStorage.setItem("task array", JSON.stringify(task));
                }
                editbtn.innerHTML = '<i class="fas fa-edit"></i>';
            }
        });

        taskList.appendChild(element);
    });
}

// Toast notification
function showToast(message, type) {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}
