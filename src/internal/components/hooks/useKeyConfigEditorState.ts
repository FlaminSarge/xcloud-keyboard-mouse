import { useCallback, useMemo, useReducer } from 'react';
import deepEqual from 'deep-equal';
import {
  KeyConfigErrors,
  MouseConfigErrors,
  processGamepadConfig,
  validateMouseConfig,
} from '../../../shared/gamepadConfig';
import { GamepadConfig, GamepadMouseConfig, KeyMap } from '../../../shared/types';

export interface EditorState {
  config: GamepadConfig;
  errors: {
    hasErrors: boolean;
    keyConfig: KeyConfigErrors;
    mouseConfig: MouseConfigErrors;
  };
  changes: {
    mouseConfig: boolean;
    keyConfig: boolean;
  };
}

// https://www.sumologic.com/blog/react-hook-typescript/
export type EditorAction =
  | { type: 'updateKeyConfig'; button: string; keyMap: KeyMap }
  | { type: 'updateSensitivity'; sensitivity: GamepadMouseConfig['sensitivity'] }
  | { type: 'updateMouseControls'; mouseControls: GamepadMouseConfig['mouseControls'] }
  | { type: 'reset'; config: GamepadConfig };

function getInitialState(initialGamepadConfig: GamepadConfig): EditorState {
  return {
    config: initialGamepadConfig,
    errors: { hasErrors: false, keyConfig: {}, mouseConfig: {} },
    changes: {
      mouseConfig: false,
      keyConfig: false,
    },
  };
}

function keyConfigReducer(initialState: EditorState, state: EditorState, action: EditorAction) {
  if (action.type === 'reset') {
    return getInitialState(action.config);
  }
  if (action.type === 'updateKeyConfig') {
    const updated = {
      ...state,
      config: {
        ...state.config,
        keyConfig: {
          ...state.config.keyConfig,
          [action.button]: Array.isArray(action.keyMap) && !action.keyMap.length ? undefined : action.keyMap,
        },
      },
    };
    const { invalidButtons, hasErrors } = processGamepadConfig(updated.config.keyConfig);
    const hasKeyConfigChanges = !deepEqual(initialState.config.keyConfig, updated.config.keyConfig);
    updated.changes = {
      ...updated.changes,
      keyConfig: hasKeyConfigChanges,
    };
    // Still allow update if there are errors, but we will block submit
    updated.errors = {
      ...updated.errors,
      keyConfig: invalidButtons,
      hasErrors: Object.keys(state.errors.mouseConfig).length > 0 || hasErrors,
    };
    return updated;
  }
  if (action.type === 'updateSensitivity' || action.type === 'updateMouseControls') {
    const { type, ...other } = action;
    const mouseConfig: GamepadMouseConfig = {
      ...state.config.mouseConfig,
      ...other,
    };
    const { errors, hasErrors } = validateMouseConfig(mouseConfig);
    const hasMouseConfigChanges = !deepEqual(initialState.config.mouseConfig, mouseConfig);
    const updated = {
      ...state,
      changes: {
        ...state.changes,
        mouseConfig: hasMouseConfigChanges,
      },
      config: {
        ...state.config,
        mouseConfig,
      },
      errors: {
        ...state.errors,
        mouseConfig: {
          ...errors,
        },
        hasErrors: Object.keys(state.errors.keyConfig).length > 0 || hasErrors,
      },
    };
    return updated;
  }
  throw new Error('Unexpected action type');
}

export default function useKeyConfigEditorState(initialGamepadConfig: GamepadConfig) {
  const initialState = useMemo(() => getInitialState(initialGamepadConfig), [initialGamepadConfig]);
  const reducer = useCallback(
    (state: EditorState, action: EditorAction) => {
      return keyConfigReducer(initialState, state, action);
    },
    [initialState],
  );
  return useReducer(reducer, initialState);
}
