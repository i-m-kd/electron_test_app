// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }
  
  // Function to get a cookie
  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(nameEQ) == 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }
  
  // Function to check if a cookie exists and act accordingly
  function checkInstallBannerCookie() {
    const bannerDismissed = getCookie("bannerDismissed");
    if (bannerDismissed) {
      return true; // The user has dismissed the banner
    }
    return false; // No cookie found, show the banner
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
  
    // Initialize the To-Do list elements
    const todoList = document.getElementById('todo-list');
    const newTodoInput = document.getElementById('new-todo');
    const addBtn = document.getElementById('add-btn');
  
    let todos = [];
  
    function renderTodos() {
      todoList.innerHTML = '';
      todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.textContent = todo;
        li.dataset.index = index;
  
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-button');  // Add a class for styling
        editBtn.addEventListener('click', () => editTodoItem(index));
  
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-button');  // Add a class for styling
        deleteBtn.addEventListener('click', () => deleteTodoItem(index));
  
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
      });
    }
  
    function addTodoItem() {
      const newTodo = newTodoInput.value.trim();
      if (newTodo) {
        todos.push(newTodo);
        newTodoInput.value = '';
        renderTodos();
      }
    }
  
    function editTodoItem(index) {
        const editModal = document.getElementById('edit-modal');
        const editInput = document.getElementById('edit-input');
        const overlay = document.getElementById('modal-overlay');
      
        editInput.value = todos[index];
        editModal.style.display = 'block';
        overlay.style.display = 'block';
      
        const saveBtn = document.getElementById('save-edit-btn');
        const cancelBtn = document.getElementById('cancel-edit-btn');
      
        saveBtn.onclick = function () {
          todos[index] = editInput.value.trim();
          renderTodos();
          editModal.style.display = 'none';
          overlay.style.display = 'none';
        };
      
        cancelBtn.onclick = function () {
          editModal.style.display = 'none';
          overlay.style.display = 'none';
        };
      }
  
    function deleteTodoItem(index) {
      todos.splice(index, 1);
      renderTodos();
    }
  
    addBtn.addEventListener('click', addTodoItem);
    newTodoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addTodoItem();
      }
    });
  
    renderTodos();
  
    // Initialize the install banner elements
    const installBanner = document.getElementById('install-banner');
    const installAppButton = document.getElementById('install-app');
    const dismissButton = document.getElementById('dismiss-banner');
  
    // Check if the banner should be shown based on cookie
    if (!checkInstallBannerCookie() && !navigator.userAgent.toLowerCase().includes('electron')) {
      console.log("Not running in Electron, showing install banner");
      installBanner.style.display = 'block'; // Show the install prompt
    } else {
      console.log("Banner dismissed or running in Electron, not showing the banner");
    }
  
    installAppButton.addEventListener('click', () => {
      console.log("Install button clicked");
      window.location.href = 'https://yourserver.com/path-to-your-electron-installer.exe';
    });
  
    dismissButton.addEventListener('click', () => {
      console.log("Dismiss button clicked");
      setCookie("bannerDismissed", "true", 30); // Set a cookie to remember the choice for 30 days
      installBanner.style.display = 'none'; // Hide the banner
    });
  });
  