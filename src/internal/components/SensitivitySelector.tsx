import React, { useCallback, Dispatch, SyntheticEvent } from 'react';
import { SpinButton, Position } from '@fluentui/react';
import classnames from 'classnames';
import { EditorAction } from './hooks/useKeyConfigEditorState';

interface SensitivitySelectorProps {
  dispatch: Dispatch<EditorAction>;
  sensitivity: number;
  disabled?: boolean;
  readOnly?: boolean;
}

export default function SensitivitySelector({ dispatch, disabled, readOnly, sensitivity }: SensitivitySelectorProps) {
  const handleChange = useCallback(
    (e: SyntheticEvent<HTMLElement, Event>, newValue = '50') => {
      let int = parseInt(newValue, 10);
      if (isNaN(int)) {
        int = 1;
      } else {
        int = 100 - int;
      }
      dispatch({
        type: 'updateSensitivity',
        sensitivity: int,
      });
    },
    [dispatch],
  );
  return (
    <SpinButton
      label="Mouse movement sensitivity (1-99)"
      className={classnames(readOnly && 'no-pointer-events')}
      labelPosition={Position.top}
      disabled={disabled}
      onChange={readOnly ? undefined : handleChange}
      value={disabled ? 'N/A' : (100 - sensitivity).toString()}
      min={1}
      max={99}
    />
  );
}
