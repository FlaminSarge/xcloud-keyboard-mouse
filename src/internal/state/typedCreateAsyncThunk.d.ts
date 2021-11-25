import { AsyncThunkPayloadCreator, AsyncThunkOptions, AsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './store';

// https://stackoverflow.com/a/69038456/2359478
declare module '@reduxjs/toolkit' {
  type AsyncThunkConfig = {
    state?: unknown;
    dispatch?: AppDispatch;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
  };

  function createAsyncThunk<
    Returned,
    ThunkArg = void,
    ThunkApiConfig extends AsyncThunkConfig = { state: RootState }, // here is the magic line
  >(
    typePrefix: string,
    payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig>,
    options?: AsyncThunkOptions<ThunkArg, ThunkApiConfig>,
  ): AsyncThunk<Returned, ThunkArg, ThunkApiConfig>;
}
