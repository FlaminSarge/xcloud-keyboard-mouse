import { createReducer, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { AllMyGamepadConfigs } from '../../shared/types';
import { defaultGamepadConfig, DEFAULT_CONFIG_NAME } from '../../shared/gamepadConfig';
import {
  activateGamepadConfigAction,
  deleteGamepadConfigAction,
  disableGamepadConfigAction,
  fetchAllAction,
  fetchGameNameAction,
  modifyGamepadConfigAction,
} from './actions';

export const currentGameReducer = createReducer<string | null>(null, (builder) => {
  builder.addCase(fetchGameNameAction.fulfilled, (state, action) => action.payload || null);
});

export const activeConfigReducer = createReducer<AllMyGamepadConfigs['activeConfig']>(null, (builder) => {
  builder.addCase(fetchAllAction.fulfilled, (state, action) => {
    return action.payload.activeConfig;
  });
  builder.addCase(activateGamepadConfigAction.fulfilled, (state, action) => {
    // Add user to the state array
    return action.payload.name;
  });
  builder.addCase(disableGamepadConfigAction.fulfilled, () => {
    return null;
  });
});

export const configDetailsReducer = createReducer<AllMyGamepadConfigs['configs']>(
  {
    [DEFAULT_CONFIG_NAME]: defaultGamepadConfig,
  },
  (builder) => {
    builder.addCase(fetchAllAction.fulfilled, (state, action) => {
      return action.payload.configs;
    });
    builder.addCase(deleteGamepadConfigAction.fulfilled, (state, action) => {
      delete state[action.payload.name];
    });
    builder.addCase(modifyGamepadConfigAction.fulfilled, (state, action) => {
      state[action.payload.name] = action.payload.gamepadConfig;
    });
  },
);

export type PendingReadStatus = 'idle' | 'reading' | 'success' | 'failure';
export type PendingReadWriteStatus = PendingReadStatus | 'writing';

interface PendingStatusesState {
  readAll: PendingReadStatus;
  gameName: PendingReadStatus;
  configs: Record<string, PendingReadWriteStatus>;
}

const isWriteAction = (action: { type: string }) =>
  action.type.startsWith(deleteGamepadConfigAction.typePrefix) ||
  action.type.startsWith(modifyGamepadConfigAction.typePrefix);

export const pendingStatusesReducer = createReducer<PendingStatusesState>(
  {
    readAll: 'idle',
    gameName: 'idle',
    configs: {},
  },
  (builder) => {
    builder.addCase(fetchAllAction.pending, (state) => {
      state.readAll = 'reading';
    });
    builder.addCase(fetchAllAction.fulfilled, (state) => {
      state.readAll = 'success';
    });
    builder.addCase(fetchAllAction.rejected, (state) => {
      state.readAll = 'failure';
    });
    builder.addCase(fetchGameNameAction.pending, (state) => {
      state.gameName = 'reading';
    });
    builder.addCase(fetchGameNameAction.fulfilled, (state) => {
      state.gameName = 'success';
    });
    builder.addCase(fetchGameNameAction.rejected, (state) => {
      state.gameName = 'failure';
    });
    builder.addMatcher(
      (action) => isWriteAction(action) && isPending(action),
      (state, action) => {
        state.configs[action.meta.arg.name] = 'writing';
      },
    );
    builder.addMatcher(
      (action) => isWriteAction(action) && isFulfilled(action),
      (state, action) => {
        state.configs[action.payload.name] = 'success';
      },
    );
    builder.addMatcher(
      (action) => isWriteAction(action) && isRejected(action),
      (state, action) => {
        if (action.payload) {
          state.configs[action.payload.name] = 'failure';
        }
      },
    );
  },
);
