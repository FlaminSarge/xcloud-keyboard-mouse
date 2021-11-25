// Inspired by https://github.com/alvaromontoro/gamepad-simulator
import { Direction } from '../shared/types';

const origGetGamepads = navigator.getGamepads;

export const fakeController = {
  axes: [0, 0, 0, 0],
  buttons: [
    {
      pressed: false,
      touched: false,
      value: 0,
    },
    {
      pressed: false,
      touched: false,
      value: 0,
    },
    {
      pressed: false,
      touched: false,
      value: 0,
    },
    {
      pressed: false,
      touched: false,
      value: 0,
    },
    {
      pressed: false,
      touched: false,
      value: 0,
    },
    {
      pressed: false,
      touched: false,
      value: 0,
    },
    {
      pressed: false,
      touched: false,
      value: 0,
    },
    {
      pressed: false,
      touched: false,
      value: 0,
    },
    {
      pressed: false,
      touched: false,
      value: 0,
    },
    {
      pressed: false,
      touched: false,
      value: 0,
    },
    {
      pressed: false,
      touched: false,
      value: 0,
    },
    {
      pressed: false,
      touched: false,
      value: 0,
    },
    {
      pressed: false,
      touched: false,
      value: 0,
    },
    {
      pressed: false,
      touched: false,
      value: 0,
    },
    {
      pressed: false,
      touched: false,
      value: 0,
    },
    {
      pressed: false,
      touched: false,
      value: 0,
    },
    {
      pressed: false,
      touched: false,
      value: 0,
    },
  ],
  connected: false,
  id: 'Xbox 360 Controller (XInput STANDARD GAMEPAD)',
  index: 0,
  mapping: 'standard' as GamepadMappingType,
  timestamp: performance.now(),
  hapticActuators: [],
};

export function simulateBtnTouch(buttonIndex: number) {
  fakeController.buttons[buttonIndex].touched = true;
  fakeController.timestamp = performance.now();
}

export function simulateBtnPress(buttonIndex: number) {
  fakeController.buttons[buttonIndex].pressed = true;
  fakeController.buttons[buttonIndex].value = 1;
  fakeController.timestamp = performance.now();
}

export function simulateBtnUnpress(buttonIndex: number) {
  fakeController.buttons[buttonIndex].touched = false;
  fakeController.buttons[buttonIndex].pressed = false;
  fakeController.buttons[buttonIndex].value = 0;
  fakeController.timestamp = performance.now();
}

export function simulateAxeDirPress(axe: number, direction: Direction) {
  const value = [Direction.UP, Direction.LEFT].indexOf(direction) > -1 ? -1 : 1;
  const pos = [Direction.UP, Direction.DOWN].indexOf(direction) > -1 ? 1 : 0;
  fakeController.axes[axe * 2 + pos] = value;
  fakeController.timestamp = performance.now();
}

export function simulateAxeDirUnpress(axe: number, direction: Direction) {
  const pos = [Direction.UP, Direction.DOWN].indexOf(direction) > -1 ? 1 : 0;
  fakeController.axes[axe * 2 + pos] = 0;
  fakeController.timestamp = performance.now();
}

export function simulateAxeMove(axe: number, x: number, y: number) {
  fakeController.axes[axe * 2] = x;
  fakeController.axes[axe * 2 + 1] = y;
  fakeController.timestamp = performance.now();
}

export function simulateGamepadConnect() {
  const event = new Event('gamepadconnected');
  fakeController.connected = true;
  fakeController.timestamp = performance.now();
  (event as any).gamepad = fakeController;
  window.dispatchEvent(event);
}

export function simulateGamepadDisconnect() {
  const event = new Event('gamepaddisconnected');
  fakeController.connected = false;
  fakeController.timestamp = performance.now();
  (event as any).gamepad = fakeController;
  window.dispatchEvent(event);
}

const gamepadSimulator = {
  fakeController,
  modifyGamepadGlobals,
  resetGamepadGlobals,
};

type GamepadSimulator = typeof gamepadSimulator;

export interface CustomWindow extends Window {
  gamepadSimulator: GamepadSimulator;
}

export function modifyGamepadGlobals(): CustomWindow {
  (window as any).gamepadSimulator = gamepadSimulator;
  navigator.getGamepads = function getGamepads() {
    return [fakeController];
  };
  return window as unknown as CustomWindow;
}

export function resetGamepadGlobals(): Window {
  navigator.getGamepads = origGetGamepads;
  return window;
}
