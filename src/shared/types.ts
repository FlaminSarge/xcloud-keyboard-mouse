export enum Direction {
  UP = 'u',
  DOWN = 'd',
  LEFT = 'l',
  RIGHT = 'r',
}

export type StickNum = 0 | 1;

export type KeyMap = undefined | string | string[];

export interface ButtonKeyConfig {
  a?: KeyMap;
  b?: KeyMap;
  x?: KeyMap;
  y?: KeyMap;
  leftShoulder?: KeyMap;
  rightShoulder?: KeyMap;
  leftTrigger?: KeyMap;
  rightTrigger?: KeyMap;
  select?: KeyMap;
  start?: KeyMap;
  leftStickPressed?: KeyMap;
  rightStickPressed?: KeyMap;
  dpadUp?: KeyMap;
  dpadDown?: KeyMap;
  dpadLeft?: KeyMap;
  dpadRight?: KeyMap;
  home?: KeyMap;
}

export interface AxesKeyConfig {
  leftStickUp?: KeyMap;
  leftStickDown?: KeyMap;
  leftStickLeft?: KeyMap;
  leftStickRight?: KeyMap;
  rightStickUp?: KeyMap;
  rightStickDown?: KeyMap;
  rightStickLeft?: KeyMap;
  rightStickRight?: KeyMap;
}

export interface GamepadKeyConfig extends ButtonKeyConfig, AxesKeyConfig {}

export interface GamepadMouseConfig {
  mouseControls: StickNum | undefined;
  sensitivity: number;
}

export interface GamepadConfig {
  keyConfig: GamepadKeyConfig;
  mouseConfig: GamepadMouseConfig;
}

export interface AllMyGamepadConfigs {
  configs: Record<string, GamepadConfig>;
  activeConfig: string | null;
}
