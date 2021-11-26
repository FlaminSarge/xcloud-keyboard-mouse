import { CodeMap, DEFAULT_SENSITIVITY, isButtonMapping } from '../shared/gamepadConfig';
import { createClickElement, firstClickText, secondClickText } from './dom/clickToEnableMouse';
import {
  fakeController,
  simulateAxeDirPress,
  simulateAxeDirUnpress,
  simulateAxeMove,
  simulateBtnPress,
  simulateBtnUnpress,
  simulateGamepadDisconnect,
} from './gamepadSimulator';
import { Direction, StickNum } from '../shared/types';

const listeners = {
  keydown: null as null | EventListener,
  keyup: null as null | EventListener,
  clickElement: null as null | HTMLDivElement,
  pointerlockchange: null as null | EventListener,
  mousemove: null as null | EventListener,
  mousedown: null as null | EventListener,
  mouseup: null as null | EventListener,
};

const getParentElement = () => {
  return document.querySelector("[data-active='ui-container']") || document.body;
};

const mouseLockError = () => {
  if (listeners.clickElement) {
    listeners.clickElement.innerText = secondClickText;
  }
};

export function listenMouseMove(axe: StickNum = 1, sensitivity = DEFAULT_SENSITIVITY) {
  console.log('Listening to mouse', axe);
  let stopMovingTimer: any;
  let needRaf = true; // used for requestAnimationFrame to only trigger at 60fps
  let movementX = 0;
  let movementY = 0;
  const parentElement = getParentElement();
  const handleMouseMove = () => {
    needRaf = true;
    if (stopMovingTimer) {
      clearTimeout(stopMovingTimer);
    }
    stopMovingTimer = setTimeout(() => {
      simulateAxeMove(axe, 0, 0);
    }, 200);
    // trigger the joystick on move
    // TODO scale based on viewport size? Does this matter?
    // (i.e. will a user move mouse fewer pixels if they are playing in a smaller viewport?)
    // const { clientWidth, clientHeight } = parentElement;
    // const scaleFactor = clientHeight / 5;
    // TODO factor in time delta as well as scaling factor, since smaller dt will mean smaller movementX/Y
    const clampedX = movementX === 0 ? 0 : Math.max(Math.min(movementX / sensitivity, 1), -1);
    const clampedY = movementY === 0 ? 0 : Math.max(Math.min(movementY / sensitivity, 1), -1);
    movementX = 0;
    movementY = 0;
    simulateAxeMove(axe, clampedX, clampedY);
  };
  listeners.mousemove = function onMouseMove(e: Event) {
    const { movementX: mx, movementY: my } = e as PointerEvent;
    movementX += mx;
    movementY += my;
    if (needRaf) {
      needRaf = false;
      // Queue processing
      requestAnimationFrame(handleMouseMove);
    }
  };
  listeners.pointerlockchange = function onPointerLockChange() {
    if (!listeners.mousemove) return;
    if (document.pointerLockElement) {
      listeners.clickElement?.remove();
      document.addEventListener('mousemove', listeners.mousemove);
    } else {
      clearTimeout(stopMovingTimer);
      document.removeEventListener('mousemove', listeners.mousemove);
      // show click element again
      listeners.clickElement!.innerText = firstClickText;
      parentElement.appendChild(listeners.clickElement!);
    }
  };
  document.addEventListener('pointerlockchange', listeners.pointerlockchange);
  document.addEventListener('pointerlockerror', mouseLockError);
  listeners.clickElement = createClickElement();
  parentElement.appendChild(listeners.clickElement);
  listeners.clickElement.addEventListener('mousedown', function onClick(e) {
    // Note: make sure the game stream is still in focus or the game will pause input!
    e.preventDefault(); // prevent bluring when clicked
    const req: any = parentElement.requestPointerLock();
    // This shouldn't be needed now with above preventDefault, but just to be safe...
    const doFocus = () => {
      const streamDiv = document.getElementById('game-stream');
      streamDiv?.focus();
    };
    if (req) {
      // Chrome returns a Promise here
      req.then(doFocus).catch(mouseLockError);
    } else {
      doFocus();
    }
  });
}

export function listenKeyboard(codeMapping: Record<string, CodeMap>) {
  console.log('Listening to keyboard');
  const handleKeyEvent = (
    code: string,
    buttonFn: (index: number) => void,
    axisFn: (axis: number, dir: Direction) => void,
  ) => {
    const mapping = codeMapping[code];
    if (mapping) {
      if (isButtonMapping(mapping)) {
        const { gamepadIndex } = mapping;
        buttonFn(gamepadIndex);
      } else {
        const { axisIndex, axisDirection } = mapping;
        axisFn(axisIndex, axisDirection);
      }
      return true;
    }
    return false;
  };

  listeners.keydown = function keyDown(e) {
    const handled = handleKeyEvent((e as KeyboardEvent).code, simulateBtnPress, simulateAxeDirPress);
    if (handled) e.preventDefault();
  };
  listeners.keyup = function keyUp(e) {
    handleKeyEvent((e as KeyboardEvent).code, simulateBtnUnpress, simulateAxeDirUnpress);
  };
  document.addEventListener('keydown', listeners.keydown);
  document.addEventListener('keyup', listeners.keyup);
  if (codeMapping.Click || codeMapping.RightClick) {
    const parentElement = getParentElement();
    listeners.mousedown = function mouseDown(e) {
      const { button } = e as MouseEvent;
      if (button === 0 && codeMapping.Click) {
        handleKeyEvent('Click', simulateBtnPress, simulateAxeDirPress);
      } else if (button === 2 && codeMapping.RightClick) {
        handleKeyEvent('RightClick', simulateBtnPress, simulateAxeDirPress);
      }
    };
    listeners.mouseup = function mouseUp(e) {
      const { button } = e as MouseEvent;
      if (button === 0 && codeMapping.Click) {
        handleKeyEvent('Click', simulateBtnUnpress, simulateAxeDirUnpress);
      } else if (button === 2 && codeMapping.RightClick) {
        handleKeyEvent('RightClick', simulateBtnUnpress, simulateAxeDirUnpress);
      }
    };
    parentElement.addEventListener('mousedown', listeners.mousedown);
    parentElement.addEventListener('mouseup', listeners.mouseup);
  }
}

export function unlistenKeyboard() {
  if (listeners.keydown) {
    document.removeEventListener('keydown', listeners.keydown);
  }
  if (listeners.keyup) {
    document.removeEventListener('keyup', listeners.keyup);
  }
  const parentElement = getParentElement();
  if (listeners.mousedown) {
    parentElement.removeEventListener('mousedown', listeners.mousedown);
  }
  if (listeners.mouseup) {
    parentElement.removeEventListener('mouseup', listeners.mouseup);
  }
}

export function unlistenMouseMove() {
  document.exitPointerLock();
  listeners.clickElement?.remove();
}

export function unlistenAll() {
  unlistenKeyboard();
  unlistenMouseMove();
}

export function destroy() {
  if (fakeController.connected) {
    simulateGamepadDisconnect();
  }
  unlistenAll();
}
