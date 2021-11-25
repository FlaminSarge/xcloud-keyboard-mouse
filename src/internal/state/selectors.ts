import { RootState } from './store';

export const getAllGamepadConfigs = (state: RootState) => {
  return {
    configs: state.configs,
    status: state.pending.readAll,
  };
};

export const getGamepadConfig = (state: RootState, name: string) => {
  return {
    config: state.configs[name],
    status: state.pending.configs[name],
  };
};

export const getActiveConfigName = (state: RootState): string | null => {
  return state.active;
};

export const isConfigActive = (state: RootState, name: string): boolean => {
  return getActiveConfigName(state) === name;
};

export const getGameName = (state: RootState) => {
  return {
    gameName: state.gameName,
    status: state.pending.gameName,
  };
};
