import { useState } from "react";

export const useInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: string) => {
    setValue(event);
  };

  return {
    value,
    onChange: (event: any) => handleChange(event),
  };
};
