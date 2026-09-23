/** Toast 轻提示 */
import { bus } from '../core/events.js';

export function toast(msg, type = 'info', ms = 2600) {
  const box = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast${type !== 'info' ? ` toast-${type}` : ''}`;
  el.textContent = msg;
  box.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity .3s';
    setTimeout(() => el.remove(), 320);
  }, ms);
  return el;
}
