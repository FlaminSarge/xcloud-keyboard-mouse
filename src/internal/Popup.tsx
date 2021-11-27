import React from 'react';
import { DEFAULT_CONFIG_NAME } from '../shared/gamepadConfig';
import Header from './components/Header';
import MainConfigEditor from './components/MainConfigEditor';
import useGameName from './components/hooks/useGameName';
import useGamepadConfigs from './components/hooks/useGamepadConfigs';

export default function Popup() {
  const { activeConfig, status, configs } = useGamepadConfigs();
  const initialConfig = activeConfig || DEFAULT_CONFIG_NAME;
  const { gameName } = useGameName();

  return (
    <div className="popup vertical">
      <Header activeConfig={activeConfig} gameName={gameName} />
      <MainConfigEditor initialConfig={initialConfig} activeConfig={activeConfig} status={status} configs={configs} />
    </div>
  );
}
