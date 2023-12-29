export class DB {
  constructor() {
    this.db = window.localStorage;
  }

  get(key) {
    return JSON.parse(this.db.getItem(key));
  }

  set(key, value) {
    this.db.setItem(key, JSON.stringify(value));
  }

  clear() {
    this.db.clear();
  }

  remove(key) {
    this.db.removeItem(key);
  }
}

