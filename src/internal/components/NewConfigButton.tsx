import React, { useState, useRef, useMemo, KeyboardEventHandler, useCallback } from 'react';
import { PrimaryButton, IconButton, TextField, Callout, DirectionalHint } from '@fluentui/react';
import { GamepadConfig } from '../../shared/types';
import { PlusCircleIcon } from './icons';

interface NewConfigButtonProps {
  allConfigs: Record<string, GamepadConfig>;
  disabled?: boolean;
  onCreate: (name: string) => void;
}

export default function NewConfigButton({ disabled, onCreate, allConfigs }: NewConfigButtonProps) {
  const buttonId = 'new-config-btn';
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const isTaken = useMemo(() => {
    return (
      Object.keys(allConfigs)
        .map((existing) => existing.toLowerCase())
        .indexOf(name.toLowerCase()) !== -1
    );
  }, [name, allConfigs]);
  const triggerRef = useRef<null | HTMLButtonElement>(null);
  const handleToggleClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  const handleSubmit = useCallback(() => {
    onCreate(name);
  }, [onCreate, name]);
  const handleKeyPress: KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback(
    (e) => {
      if (e.code === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit],
  );
  return (
    <>
      <IconButton
        id={buttonId}
        elementRef={triggerRef}
        onClick={handleToggleClick}
        title="Add new preset"
        ariaLabel="Add new preset"
        disabled={disabled}
      >
        <PlusCircleIcon />
      </IconButton>
      {isOpen ? (
        <Callout
          directionalHint={DirectionalHint.bottomRightEdge}
          gapSpace={0}
          target={`#${buttonId}`}
          onDismiss={handleClose}
          setInitialFocus
        >
          <div style={{ width: 200 }} className="padding-full">
            <TextField
              placeholder="Preset name"
              autoFocus={isOpen}
              value={name}
              maxLength={18}
              onKeyPress={handleKeyPress}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            {isTaken ? <div className="error margin-top-s">Config with that name already exists!</div> : null}
            <div className="horizontal-reverse margin-top-s">
              <PrimaryButton disabled={!name || isTaken} onClick={handleSubmit}>
                Create
              </PrimaryButton>
            </div>
          </div>
        </Callout>
      ) : null}
    </>
  );
}
