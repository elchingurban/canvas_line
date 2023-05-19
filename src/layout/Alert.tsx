import React, { useContext, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import { GridContext } from '../context/GridContext';

export const AlertComponent: React.FC = () => {
  const { area } = useContext(GridContext);

  useEffect(() => {
    if (area !== null) {
      alert(`The area of the polygon is ${area} square cm.`);
    }
  }, [area]);

  return (
    <div>
      {area !== null && <Alert severity='info'>The area of the polygon is {area} square cm.</Alert>}
    </div>
  );
};
