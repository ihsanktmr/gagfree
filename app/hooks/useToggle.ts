import {useCallback, useState} from 'react';

type UseToggleReturnType = [boolean, () => void];

export const useToggle = (
  initialValue: boolean = false,
): UseToggleReturnType => {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  return [value, toggle];
};
