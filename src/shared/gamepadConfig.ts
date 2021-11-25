import {
  ButtonKeyConfig,
  AxesKeyConfig,
  Direction,
  GamepadKeyConfig,
  GamepadConfig,
  GamepadMouseConfig,
} from './types';

export const DEFAULT_CONFIG_NAME = 'default';
export const MAX_NUM_CONFIGS = 25;
export const DEFAULT_SENSITIVITY = 10;

const buttonToGamepadIndex: Record<keyof ButtonKeyConfig, number> = {
  a: 0,
  b: 1,
  x: 2,
  y: 3,
  leftShoulder: 4,
  rightShoulder: 5,
  leftTrigger: 6,
  rightTrigger: 7,
  select: 8,
  start: 9,
  leftStickPressed: 10,
  rightStickPressed: 11,
  dpadUp: 12,
  dpadDown: 13,
  dpadLeft: 14,
  dpadRight: 15,
  home: 16,
};

const buttonToAxisIndex = (button: keyof AxesKeyConfig): number => {
  return button[0] === 'l' ? 0 : 1;
};

const buttonToAxisDirection = (button: keyof AxesKeyConfig): Direction => {
  return button.replace(/^(left|right)Stick/, '')[0].toLowerCase() as Direction;
};

export const isButtonMapping = (mapping: ButtonCodeMap | AxisCodeMap): mapping is ButtonCodeMap => {
  return (mapping as ButtonCodeMap).gamepadIndex !== undefined;
};

interface CodeMapBase {
  button: string;
}

export interface ButtonCodeMap extends CodeMapBase {
  gamepadIndex: number;
}

export interface AxisCodeMap extends CodeMapBase {
  axisIndex: number;
  axisDirection: Direction;
}

export type CodeMap = ButtonCodeMap | AxisCodeMap;
export type KeyConfigErrors = Partial<Record<keyof GamepadKeyConfig, string | undefined>>;
export interface MouseConfigErrors {
  mouseControls?: string;
  sensitivity?: string;
}

export function processGamepadConfig(config: GamepadKeyConfig) {
  // Validate a given code has only one button
  // and normalize from code to buttons array
  const codeMapping: Record<string, CodeMap> = {};
  const invalidButtons: KeyConfigErrors = {};
  (Object.keys(config) as Array<keyof GamepadKeyConfig>).forEach((button) => {
    const keyMap = config[button];
    if (!keyMap) {
      return;
    }
    const codes = !Array.isArray(keyMap) ? [keyMap] : keyMap;
    for (const code of codes) {
      if (code === 'Escape') {
        invalidButtons[button] = 'Binding Escape key is not allowed';
        continue;
      }
      if (codeMapping[code]) {
        invalidButtons[button] = `'${code}' is already bound to button '${codeMapping[code].button}'`;
        continue;
      }
      const gamepadIndex = buttonToGamepadIndex[button as keyof ButtonKeyConfig];
      if (gamepadIndex !== undefined) {
        codeMapping[code] = { button, gamepadIndex };
      } else {
        const axisIndex = buttonToAxisIndex(button as keyof AxesKeyConfig);
        const axisDirection = buttonToAxisDirection(button as keyof AxesKeyConfig);
        codeMapping[code] = { button, axisIndex, axisDirection };
      }
    }
  });
  return { codeMapping, invalidButtons, hasErrors: Object.keys(invalidButtons).length > 0 };
}

export function validateMouseConfig(mouseConfig: GamepadMouseConfig): {
  errors: MouseConfigErrors;
  hasErrors: boolean;
} {
  const { sensitivity, mouseControls } = mouseConfig;
  const errors: MouseConfigErrors = {};
  if (mouseControls !== undefined && mouseControls !== 0 && mouseControls !== 1) {
    errors.mouseControls = 'Invalid stick number';
  }
  if (sensitivity < 1 || sensitivity > 1000) {
    errors.mouseControls = 'Invalid sensitivity value. Must be between 1 and 1000.';
  }
  return { errors, hasErrors: Object.keys(errors).length > 0 };
}

export const defaultGamepadConfig: GamepadConfig = {
  mouseConfig: {
    mouseControls: 1,
    sensitivity: DEFAULT_SENSITIVITY,
  },
  // https://keycode.info/
  keyConfig: {
    a: 'Space',
    b: ['KeyE', 'Backspace'],
    x: 'KeyR',
    y: 'KeyQ',
    leftShoulder: 'KeyZ',
    leftTrigger: 'ShiftLeft',
    rightShoulder: 'KeyX',
    rightTrigger: ['ShiftRight', 'Click'],
    start: 'Enter',
    select: undefined,
    home: undefined,
    dpadUp: 'ArrowUp',
    dpadLeft: 'ArrowLeft',
    dpadDown: 'ArrowDown',
    dpadRight: 'ArrowRight',
    leftStickUp: 'KeyW',
    leftStickLeft: 'KeyA',
    leftStickDown: 'KeyS',
    leftStickRight: 'KeyD',
    rightStickUp: 'KeyO',
    rightStickLeft: 'KeyK',
    rightStickDown: 'KeyL',
    rightStickRight: 'Semicolon',
    leftStickPressed: undefined,
    rightStickPressed: undefined,
  },
};

export const emptyGamepadConfig: GamepadConfig = {
  mouseConfig: {
    mouseControls: undefined,
    sensitivity: DEFAULT_SENSITIVITY,
  },
  keyConfig: (Object.keys(defaultGamepadConfig.keyConfig) as Array<keyof GamepadKeyConfig>).reduce((keyConfig, key) => {
    keyConfig[key] = undefined;
    return keyConfig;
  }, {} as GamepadKeyConfig),
};
