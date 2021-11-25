import { useEffect } from 'react';
import { fetchAllAction } from '../state/actions';
import { getActiveConfigName, getAllGamepadConfigs } from '../state/selectors';
import { useAppDispatch, useAppSelector } from './reduxHooks';

export default function useGamepadConfigs() {
  const { configs, status } = useAppSelector(getAllGamepadConfigs);
  const activeConfig = useAppSelector(getActiveConfigName);

  // fetch data if not present
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllAction());
    }
  }, [dispatch, status]);

  return { activeConfig, configs, status };
}
