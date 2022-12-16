import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from './Header';
import Body from './Body';
import { useCallback, useMemo, useState } from 'react';
import { getItem, setItem } from './localStorage';

const THEME_LOCAL = 'fish-theme';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const localTheme = getItem(THEME_LOCAL);

  const [mode, setMode] = useState(localTheme ? localTheme : (prefersDarkMode ? 'dark' : 'light'));

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  const handleToggleColorMode = useCallback(() => {
    setMode((prevMode) => {
      const newMode =  (prevMode === 'light' ? 'dark' : 'light');
      setItem(THEME_LOCAL, newMode);
      return newMode;
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header handleToggleColorMode={handleToggleColorMode} />
      <Body />
    </ThemeProvider>
  );
}

export default App;
