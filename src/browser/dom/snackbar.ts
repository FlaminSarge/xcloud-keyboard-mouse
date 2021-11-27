import { getInjectedImagePaths } from '../../shared/pageInjectUtils';

const SNACKBAR_ID = 'snackbar-xmc';
const TOAST_TIME_MS = 3000;

let timeout: ReturnType<typeof setTimeout>;

function getSnackbarDiv() {
  let div = document.getElementById(SNACKBAR_ID);
  if (!div) {
    div = document.createElement('div');
    div.id = SNACKBAR_ID;
    const svg = document.createElement('img');
    svg.src = getInjectedImagePaths()['keyboard.svg'];
    div.appendChild(svg);
    const span = document.createElement('span');
    div.appendChild(span);
    document.body.appendChild(div);
  }
  return div;
}

export function showToast(message: string) {
  clearTimeout(timeout);
  const snackbar = getSnackbarDiv();
  // Add the "show" class to DIV
  snackbar.classList.add('show');
  const span = snackbar.querySelector('span')!;
  span.innerText = message;

  // After 3 seconds, remove the show class from DIV
  timeout = setTimeout(() => {
    snackbar.classList.remove('show');
  }, TOAST_TIME_MS);
}
