import { DB } from "./db.js";

class Pomodoro {
  constructor(minutes, seconds) {
    this.db = new DB();

 
    this.minutes = this.db.get('pomodoro') ? this.db.get('pomodoro').minutes : minutes;
    this.seconds = this.db.get('pomodoro') ? this.db.get('pomodoro').seconds : seconds;
    
    this.interval = 0;
    this.ready = false;

    this.DEFAULT_TIME = 25;
    this.DEFAULT_SECONDS = 0;
  }

  getCurrentTime() {
    if (this.minutes <= 0 && this.seconds <= 0) {
      this.reset();
      return this.getCurrentTime();
    }

    return `${String(this.minutes).padStart(2, '0')}:${String(this.seconds).padStart(2, '0')}`;
  }

  finish() {
    this.reset();
  }

  saveInStorage() {
    this.db.set('pomodoro', {
      minutes: this.minutes,
      seconds: this.seconds,
    });
  }

  selectTime(minutes, seconds) {
    this.reset();

    this.minutes = minutes;
    this.seconds = seconds;
    this.saveInStorage();
  }

  start(updateUICallback) {
    this.interval = setInterval(() => {
      this.seconds--;

      if (this.seconds <= 0) {
        this.seconds = 59;

        if (this.minutes > 0) {
          this.minutes--;
        } else {
          this.stop();
          this.finish();
        }
      }

      this.ready = true;
      updateUICallback(); 
      this.saveInStorage();
    }, 1000);
  }

  stop() {
    clearInterval(this.interval);
    this.ready = false;
  }

  reset() {
    this.stop();
    this.minutes = this.DEFAULT_TIME;
    this.seconds = this.DEFAULT_SECONDS;
  }
}

export class PomodoroApp {
  constructor() {
    this.db = new DB();
    this.pomodoro = new Pomodoro(25, 0);
    
    this.tasks = this.db.get('tasks') || [];
  }

  init() {
    this.pomodoro.start(() => this.updateUI());
  }

  updateUI() {
    const counter = document.querySelector('#counter');
    counter.innerHTML = this.pomodoro.getCurrentTime();

  }

  bindEvents() {
    const start = document.querySelector('#start');
    start.addEventListener('click', () => {
      if (this.pomodoro.ready) {
        this.pomodoro.stop();
        start.textContent = 'Começar';
        return;
      }

      this.pomodoro.start(() => this.updateUI());
      start.textContent = 'Pausar';
    });

    const min = document.querySelector('#min');
    const max = document.querySelector('#max');

    min.addEventListener('click', () => {
      this.pomodoro.selectTime(1, 0);
      this.updateUI();
      start.textContent = 'Começar';
    });

    max.addEventListener('click', () => {
      this.pomodoro.selectTime(25, 0);
      this.updateUI();
      start.textContent = 'Começar';
    });
  }

  render() {
    this.updateUI();
    this.bindEvents();
  }

  run() {
    this.render();
  }
}

const app = new PomodoroApp();
app.run();