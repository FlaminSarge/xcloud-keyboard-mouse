import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { activeConfigReducer, configDetailsReducer, currentGameReducer, pendingStatusesReducer } from './reducers';

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(process.env.NODE_ENV === 'production' ? [] : [logger]),
  reducer: {
    gameName: currentGameReducer,
    active: activeConfigReducer,
    configs: configDetailsReducer,
    pending: pendingStatusesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
