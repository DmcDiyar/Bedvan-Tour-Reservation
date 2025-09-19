/* eslint-disable */
export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (el.parentElement) el.parentElement.removeChild(el);
    }, 300);
  }
};

export const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  // Add slide out animation
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  window.setTimeout(hideAlert, time * 1000);
};
