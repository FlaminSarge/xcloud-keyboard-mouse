import React, { useCallback, useRef, useEffect } from 'react';
import { Toggle, IToggleProps, ThemeProvider } from '@fluentui/react';
import { useAppDispatch } from './hooks/reduxHooks';
import { activateGamepadConfigAction, disableGamepadConfigAction } from '../state/actions';
import { DEFAULT_CONFIG_NAME } from '../../shared/gamepadConfig';
import { fluentXboxHeaderTheme } from './theme';
import Logo from './Logo';
import HeaderMoreOptions from './HeaderMoreOptions';

interface HeaderProps {
  gameName: string | null;
  activeConfig: string | null;
}

export default function Header({ gameName, activeConfig }: HeaderProps) {
  const dispatch = useAppDispatch();
  const prevActiveRef = useRef<string>(activeConfig || DEFAULT_CONFIG_NAME);
  useEffect(() => {
    if (activeConfig) {
      // Only update if active
      prevActiveRef.current = activeConfig;
    }
  }, [activeConfig]);
  const isEnabled = !!activeConfig;
  const handleToggle: IToggleProps['onChange'] = useCallback(
    (event, checked) => {
      if (!checked) {
        dispatch(disableGamepadConfigAction());
      } else {
        dispatch(activateGamepadConfigAction({ name: prevActiveRef.current }));
      }
    },
    [dispatch, prevActiveRef],
  );

  return (
    <ThemeProvider theme={fluentXboxHeaderTheme}>
      <header className="box horizontal green-bg space-between setup-details">
        <div className="logo unselectable horizontal centered-v">
          <Logo isEnabled={isEnabled} />
          <Toggle
            title={`${isEnabled ? 'Disable' : 'Enable'} mouse and keyboard`}
            checked={isEnabled}
            onChange={handleToggle}
            className="no-margin margin-left"
          />
        </div>
        <div className="horizontal centered">
          <div className="vertical centered-v left-aligned margin-right">
            <div>
              <small>Playing:</small> {gameName || 'None'}
            </div>
            <div>
              <small>Preset:</small> {activeConfig || 'None'}
            </div>
          </div>
          <HeaderMoreOptions />
        </div>
      </header>
    </ThemeProvider>
  );
}
