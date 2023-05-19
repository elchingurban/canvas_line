import React from 'react';

export const GridContext = React.createContext<{
  area: number | null;
  setArea: React.Dispatch<React.SetStateAction<number | null>>;
}>({
  area: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setArea: () => {},
});
