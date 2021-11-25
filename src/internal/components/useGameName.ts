import { useEffect } from 'react';
import { fetchGameNameAction } from '../state/actions';
import { getGameName } from '../state/selectors';
import { useAppDispatch, useAppSelector } from './reduxHooks';

export default function useGameName() {
  const { gameName, status } = useAppSelector(getGameName);

  // fetch data if not present
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchGameNameAction());
    }
  }, [dispatch, status]);

  return { gameName, status };
}
