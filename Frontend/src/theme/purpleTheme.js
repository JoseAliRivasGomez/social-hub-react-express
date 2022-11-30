import { createTheme } from '@mui/material';
import { red } from '@mui/material/colors';

export const purpleTheme = createTheme({
  palette: {
    primary: {
      main: '#1E3A8A',
    },
    secondary: {
      main: '#2563EB',
    },
    error: {
      main: red.A400,
    },
  },
});
