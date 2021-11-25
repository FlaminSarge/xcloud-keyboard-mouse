import React from 'react';
import { DEFAULT_CONFIG_NAME } from '../shared/gamepadConfig';
import CurrentSetupDetails from './components/CurrentSetupDetails';
import MainConfigEditor from './components/MainConfigEditor';
import useGameName from './components/useGameName';
import useGamepadConfigs from './components/useGamepadConfigs';

export default function Popup() {
  const { activeConfig, status, configs } = useGamepadConfigs();
  const initialConfig = activeConfig || DEFAULT_CONFIG_NAME;
  const { gameName } = useGameName();

  return (
    <div className="popup vertical">
      <CurrentSetupDetails activeConfig={activeConfig} gameName={gameName} />
      <MainConfigEditor initialConfig={initialConfig} activeConfig={activeConfig} status={status} configs={configs} />
    </div>
  );
}
