import { DB } from "./db.js";

export class Task {
  static main() {
    const form = document.querySelector('#new-task');
    const title = document.querySelector('#title');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const task = new Task(title.value);
      task.save();
      task.render();

      title.value = '';
    });

    Task.renderAll();
  }

  constructor(title) {
    this.db = new DB();
    this.title = title;
    this.done = false;
  }

  save() {
    const tasks = this.db.get('tasks') || [];
    tasks.push(this);
    this.db.set('tasks', tasks);
  }

  check() {
    this.done = !this.done;
    const tasks = this.db.get('tasks') || [];
    const taskIndex = tasks.findIndex((task) => task.title === this.title);
    tasks[taskIndex] = this;
    this.db.set('tasks', tasks);
  }

  remove() {
    const tasks = this.db.get('tasks') || [];
    const taskIndex = tasks.findIndex((task) => task.title === this.title);
    tasks.splice(taskIndex, 1);
    this.db.set('tasks', tasks);
  }

  static renderAll() {
    const tasks = new DB().get('tasks') || [];
    tasks.forEach((taskData) => {
      const task = new Task(taskData.title);
      task.done = taskData.done;
      task.render();
    });
  }


  render() {
    const tasksList = document.querySelector('#tasks-list');
    const taskElement = document.createElement('li');
    taskElement.innerHTML = `
      <input type="checkbox" id="${this.title}" ${this.done ? 'checked' : ''} />
      <label for="${this.title}">${this.title}</label>
    `;

  
    const checkboxElement = taskElement.querySelector(`#${this.title}`);
    checkboxElement.addEventListener('change', () => {
      console.log('mudou');
      this.check();
    });

    const labelElement = taskElement.querySelector(`label[for="${this.title}"]`);
    labelElement.addEventListener('dblclick', () => {
      this.remove();
      taskElement.remove();
    });

  
    tasksList.appendChild(taskElement);
  }
  
}

Task.main();
