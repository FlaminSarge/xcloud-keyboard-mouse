import React, { memo, useMemo } from 'react';
import classnames from 'classnames';
import { DefaultButton } from '@fluentui/react';
import { GamepadConfig } from '../../shared/types';
import { MAX_NUM_CONFIGS } from '../../shared/gamepadConfig';
import NewConfigButton from './NewConfigButton';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface GamepadConfigSelectorProps {
  className?: string;
  currentConfig: string;
  activeConfig: string | null;
  allConfigs: Record<string, GamepadConfig>;
  setCurrentConfig: (name: string) => void;
  addNewConfig: (newName: string) => void;
}

function ConfigTitle({ name, status }: { name: string; status?: 'New' | 'Active' | false }) {
  return (
    <div className="vertical centered">
      <span className={classnames(status && 'selector-active')}>{name}</span>
      {status ? <small>({status})</small> : null}
    </div>
  );
}

function GamepadConfigSelector({
  className,
  currentConfig,
  activeConfig,
  allConfigs,
  setCurrentConfig,
  addNewConfig,
}: GamepadConfigSelectorProps) {
  const configsArray = useMemo(() => Object.keys(allConfigs), [allConfigs]);
  const currentConfigIndex = useMemo(() => configsArray.indexOf(currentConfig), [configsArray, currentConfig]);
  const isNew = !allConfigs[currentConfig];
  const isActive = activeConfig === currentConfig;
  const onlyOneConfig = configsArray.length < 2;
  const handleMove = (isBack: boolean) => {
    const n = configsArray.length;
    const i = currentConfigIndex + (isBack ? -1 : 1);
    setCurrentConfig(configsArray[((i % n) + n) % n]);
  };
  const arrowCssClasses = classnames(onlyOneConfig && 'not-allowed-cursor');
  const rootCssClasses = classnames('horizontal centered', !isNew && 'space-between', className);
  return isNew ? (
    <div className={rootCssClasses}>
      <ConfigTitle name={currentConfig} status="New" />
    </div>
  ) : (
    <div className={rootCssClasses}>
      <DefaultButton className={arrowCssClasses} disabled={onlyOneConfig} onClick={() => handleMove(true)}>
        <ChevronLeftIcon />
      </DefaultButton>

      <ConfigTitle name={currentConfig} status={isActive && 'Active'} />

      <div className="horizontal">
        <DefaultButton className={arrowCssClasses} disabled={configsArray.length < 2} onClick={() => handleMove(false)}>
          <ChevronRightIcon />
        </DefaultButton>
        <NewConfigButton
          disabled={configsArray.length >= MAX_NUM_CONFIGS - 1}
          allConfigs={allConfigs}
          onCreate={addNewConfig}
        />
      </div>
    </div>
  );
}

export default memo(GamepadConfigSelector);
