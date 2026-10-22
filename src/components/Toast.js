import { toastStore } from '../state/toastStore.js';
import { icons } from './icons.js';

export function renderToastContainer(container) {
  function render(toasts) {
    container.innerHTML = `
      <div class="toast-container" id="toast-container" aria-live="polite">
        ${toasts.map(t => `
          <div class="toast-item ${t.type}" data-id="${t.id}">
            <span>${t.type === 'success' ? icons.check('', 18) : icons.flame('', 18)}</span>
            <span>${t.message}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  toastStore.subscribe(render);
  render(toastStore.toasts);
}
