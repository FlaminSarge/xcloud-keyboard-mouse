import React, { memo, MouseEventHandler, useCallback, useMemo, useRef, useState } from 'react';
import { IconButton, TooltipHost, DirectionalHint } from '@fluentui/react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { KeyMap } from '../../shared/types';
import { camelToSpace } from '../utils/formattingUtils';
import { ExclamationCircle } from './icons';

const MAX_BINDINGS = 2; // TODO do people want/need tripple keybinds?

interface TrippleKeybindProps {
  button: string;
  value: KeyMap;
  onChange: (button: string, updated: KeyMap) => void;
  error?: string;
  readOnly?: boolean;
  useSpacers?: boolean;
}

const formatCodeName = (code: string) => {
  return camelToSpace(code.replace(/^(Key|Digit)/, ''));
};

function KeybindingsForButton({ button, value, onChange, readOnly, error, useSpacers = false }: TrippleKeybindProps) {
  const [isListening, setIsListening] = useState(false);
  const keyListener = useRef<null | ((e: KeyboardEvent) => void)>(null);
  const codes = useMemo(() => (!value ? [] : Array.isArray(value) ? value : [value]), [value]);

  const handleCancelListen = useCallback(() => {
    setIsListening(false);
    if (keyListener.current) document.removeEventListener('keydown', keyListener.current);
  }, []);

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      e.preventDefault();
      const { button: mouseButton } = e;
      if (mouseButton === 0 || mouseButton === 2) {
        const code = mouseButton === 0 ? 'Click' : 'RightClick';
        if (codes.indexOf(code) === -1) {
          onChange(button, codes.concat([code]));
        }
      }
      handleCancelListen();
      return false;
    },
    [button, codes, handleCancelListen, onChange],
  );

  const handleClickAdd = useCallback(() => {
    if (readOnly) return;
    console.log('Listening.....');
    setIsListening(true);
    keyListener.current = function onKeyDown(e: KeyboardEvent) {
      console.log('GOT KEYDOWN!!');
      e.preventDefault();
      const { code } = e;
      if (code !== 'Escape' && codes.indexOf(code) === -1) {
        onChange(button, codes.concat([code]));
      }
      handleCancelListen();
    };
    document.addEventListener('keydown', keyListener.current, false);
  }, [button, codes, readOnly, handleCancelListen, onChange]);

  const handleRemove = (i: number) => {
    onChange(
      button,
      codes.filter((_, j) => i !== j),
    );
  };

  const showNoneMessage = !codes.length && readOnly;
  const canAddMore = codes.length < MAX_BINDINGS;
  const showAddBtn = !readOnly && canAddMore;
  const numSpacers = readOnly || codes.length >= MAX_BINDINGS - 1 ? 0 : 1;
  const spacers: string[] = !useSpacers || showNoneMessage ? [] : new Array(numSpacers).fill(' ');
  const modal = (
    <Modal
      center
      open={isListening}
      onClose={handleCancelListen}
      showCloseIcon={false}
      focusTrapped={true}
      closeOnEsc={false}
    >
      <div
        className="vertical centered unselectable"
        style={{ width: '60vw', height: '50vh', padding: 20 }}
        onMouseDown={isListening ? handleMouseDown : undefined}
      >
        <h3>Press any key or click to bind...</h3>
        <p>(Press Esc to cancel)</p>
      </div>
    </Modal>
  );
  const errorNotice = error ? (
    <TooltipHost content={error} id={`keybind-error-tooltip-${button}`} directionalHint={DirectionalHint.rightCenter}>
      <ExclamationCircle className="error margin-left-s" />
    </TooltipHost>
  ) : null;
  return (
    <tr>
      <th>
        {camelToSpace(button)}
        {modal}
        {errorNotice}
      </th>
      {showNoneMessage ? (
        <td className="none" colSpan={3}>
          No bindings for button
        </td>
      ) : null}
      {codes.map((code, i) => (
        <td key={code}>
          <div>
            <span>{formatCodeName(code)}</span>
            {readOnly ? null : (
              <IconButton
                className="error-bg delete-icon"
                size={18}
                iconProps={{ iconName: 'BoxMultiplySolid', className: 'error' }}
                title="Remove binding"
                disabled={isListening}
                onClick={() => handleRemove(i)}
              />
            )}
          </div>
        </td>
      ))}
      {showAddBtn ? (
        <td>
          <IconButton
            iconProps={{ iconName: 'Add' }}
            title="Add binding"
            size={18}
            disabled={isListening}
            onClick={handleClickAdd}
          />
        </td>
      ) : null}
      {spacers.map((_, i) => (
        <td className="empty" key={`s${i}`}>
          <div>Empty Binding</div>
        </td>
      ))}
    </tr>
  );
}

export default memo(KeybindingsForButton);
