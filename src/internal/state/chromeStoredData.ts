import { AllMyGamepadConfigs, GamepadConfig } from '../../shared/types';
import { defaultGamepadConfig, DEFAULT_CONFIG_NAME } from '../../shared/gamepadConfig';

// Chrome Sync Storage Limits:
// max items = 512
// max writes per second = 2
// max bytes per item = 8.192 KB

enum LocalStorageKeys {
  GAME_NAME = 'GAME_NAME',
}

enum SyncStorageKeys {
  GAMEPAD_CONFIGS = 'GP_CONF',
  ACTIVE_GAMEPAD_CONFIG = 'ACTIVE_GP_CONF',
}

export function updateGameName(gameName: string) {
  return chrome.storage.local.set({ [LocalStorageKeys.GAME_NAME]: gameName });
}

export async function getGameName(): Promise<string | undefined> {
  const keys = await chrome.storage.local.get(LocalStorageKeys.GAME_NAME);
  return keys[LocalStorageKeys.GAME_NAME];
}

/**
 * Updates a stored gamepad config by name (does not set it as active)
 */
export function storeGamepadConfig(name: string, gamepadConfig: GamepadConfig) {
  return chrome.storage.sync.set({ [`${SyncStorageKeys.GAMEPAD_CONFIGS}:${name}`]: gamepadConfig });
}

/**
 * Deletes a stored gamepad config.
 * Be careful not to delete the active config!
 */
export function deleteGamepadConfig(name: string) {
  if (name === DEFAULT_CONFIG_NAME) {
    throw new Error('Cannot delete default config');
  }
  return chrome.storage.sync.remove(`${SyncStorageKeys.GAMEPAD_CONFIGS}:${name}`);
}

/**
 * Sets a gamepad config as active.
 */
export function storeActiveGamepadConfig(name: string | null) {
  // TODO validate the name exists before setting it active?
  return chrome.storage.sync.set({ [SyncStorageKeys.ACTIVE_GAMEPAD_CONFIG]: name });
}

function normalizeGamepadConfigs(data: Record<string, any>): AllMyGamepadConfigs {
  const activeConfig = data[SyncStorageKeys.ACTIVE_GAMEPAD_CONFIG];
  const keys = Object.keys(data).filter((key) => key.startsWith(SyncStorageKeys.GAMEPAD_CONFIGS));
  const initialConfigsMap: AllMyGamepadConfigs['configs'] = {
    [DEFAULT_CONFIG_NAME]: defaultGamepadConfig,
  };
  return {
    activeConfig,
    configs: keys.reduce((configs, key) => {
      const name = key.split(':')[1];
      configs[name] = data[key];
      return configs;
    }, initialConfigsMap),
  };
}

// TODO keep a global cache of this somewhere
export async function getAllStoredSync() {
  const data = await chrome.storage.sync.get(null);
  return normalizeGamepadConfigs(data);
}
