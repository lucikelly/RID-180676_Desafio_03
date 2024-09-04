document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector("header form");
  const taskList = document.querySelector("main");
  const taskCountElement = document.querySelector(".tarefas-ok p");
  let completedTasks = 0;

  const initialTasks = [
      { id: 'task-1', name: 'Implementar tela de listagem de tarefas', label: 'frontend', isCompleted: false },
      { id: 'task-2', name: 'Criar endpoint para cadastro de tarefas', label: 'backend', isCompleted: false },
      { id: 'task-3', name: 'Implementar protótipo da listagem de tarefas', label: 'Ux', isCompleted: true }
  ];

  // Carrega tarefas do localStorage e tarefas iniciais
  loadTasksFromStorage();
  loadInitialTasks();

  form.addEventListener("submit", function(event) {
      event.preventDefault();

      const taskName = form.querySelector('input[placeholder="Nome da tarefa"]').value;
      const taskLabel = form.querySelector('input[placeholder="Etiqueta"]').value;

      if (taskName && taskLabel) {
          const taskId = `task-${Date.now()}`;
          const taskCard = createTaskElement(taskId, taskName, taskLabel, false);
          taskList.prepend(taskCard);  // Adiciona o card no topo da lista

          saveTaskToStorage(taskId, taskName, taskLabel, false);

          form.reset();
      } else {
          alert("Por favor, preencha todos os campos!");
      }
  });

  function createTaskElement(taskId, taskName, taskLabel, isCompleted) {
      const taskCard = document.createElement("section");
      taskCard.className = "card";
      taskCard.setAttribute("data-id", taskId);
      taskCard.innerHTML = `
          <h2>${taskName}</h2>
          <div class="p-card">
              <p class="etiqueta">${taskLabel}</p>
              <p>Criado em: ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="btn-mobile">
              ${isCompleted 
                  ? `<img src="assets/Checked.png" alt="Concluído" style="width: 24px; height: 24px;">` 
                  : `<button class="btn-card">Concluir</button>`}
          </div>
      `;

      if (isCompleted) {
          applyCompletedStyles(taskCard);
      } else {
          const concludeButton = taskCard.querySelector('.btn-card');
          concludeButton.addEventListener('click', function() {
              concludeTask(taskCard, taskId, taskName, taskLabel);
          });
      }

      return taskCard;
  }

  function concludeTask(taskCard, taskId, taskName, taskLabel) {
      applyCompletedStyles(taskCard);

      completedTasks++;
      updateTaskCount();

      saveTaskToStorage(taskId, taskName, taskLabel, true);
  }

  function applyCompletedStyles(taskCard) {
      const taskTitle = taskCard.querySelector('h2');
      taskTitle.style.textDecoration = "line-through";
      taskTitle.style.color = "#8F98A8";

      const taskLabelElement = taskCard.querySelector('.etiqueta');
      taskLabelElement.style.color = "#8F98A8";

      const buttonContainer = taskCard.querySelector('.btn-mobile');
      buttonContainer.innerHTML = `<img src="assets/Checked.png" alt="Concluído" style="width: 24px; height: 24px;">`;
  }

  function updateTaskCount() {
      taskCountElement.textContent = `${completedTasks} tarefa${completedTasks > 1 ? 's' : ''} concluída${completedTasks > 1 ? 's' : ''}`;
  }

  function saveTaskToStorage(taskId, taskName, taskLabel, isCompleted) {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const existingTaskIndex = tasks.findIndex(task => task.id === taskId);

      if (existingTaskIndex > -1) {
          tasks[existingTaskIndex].isCompleted = isCompleted;
      } else {
          tasks.push({ id: taskId, name: taskName, label: taskLabel, isCompleted });
      }

      localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadInitialTasks() {
      initialTasks.forEach(task => {
          if (!document.querySelector(`section[data-id="${task.id}"]`)) {
              const taskCard = createTaskElement(task.id, task.name, task.label, task.isCompleted);
              taskList.prepend(taskCard);  // Adiciona o card no topo da lista
              if (task.isCompleted) {
                  completedTasks++;
              }
          }
      });
      updateTaskCount();
  }

  function loadTasksFromStorage() {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

      tasks.forEach(task => {
          if (!document.querySelector(`section[data-id="${task.id}"]`)) {
              const taskCard = createTaskElement(task.id, task.name, task.label, task.isCompleted);
              taskList.prepend(taskCard);  // Adiciona o card no topo da lista
              if (task.isCompleted) {
                  completedTasks++;
              }
          }
      });

      // Atualiza a contagem de tarefas concluídas
      updateTaskCount();

      // Adiciona eventos de clique aos botões "Concluir" existentes
      const concludeButtons = document.querySelectorAll('.btn-card');
      concludeButtons.forEach(button => {
          button.addEventListener('click', function() {
              const taskCard = button.closest('.card');
              const taskId = taskCard.getAttribute('data-id');
              const taskTitle = taskCard.querySelector('h2').textContent;
              const taskLabel = taskCard.querySelector('.etiqueta').textContent;
              concludeTask(taskCard, taskId, taskTitle, taskLabel);
          });
      });
  }
});
