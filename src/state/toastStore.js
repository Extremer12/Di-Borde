// Toast notification system
class ToastStore {
  constructor() {
    this.listeners = new Set();
    this.toasts = [];
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.toasts));
  }

  show(message, type = 'info', duration = 3500) {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    const toast = { id, message, type, duration };
    this.toasts.push(toast);
    this.notify();

    setTimeout(() => {
      this.dismiss(id);
    }, duration);

    return id;
  }

  dismiss(id) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }
}

export const toastStore = new ToastStore();
