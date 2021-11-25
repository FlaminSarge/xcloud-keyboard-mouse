export const firstClickText = 'Click here to enable analog mouse control';
export const secondClickText = 'Click again to enable';

export const createClickElement = () => {
  const clickElement = document.createElement('div');
  clickElement.id = 'click-to-enable-mouse-xmc';
  clickElement.innerText = firstClickText;
  return clickElement;
};
