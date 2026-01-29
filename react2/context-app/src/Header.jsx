import { useContext } from 'react';
import ThemeContext from './ThemeContext';

function Header({ children }) {
    const { theme } = useContext(ThemeContext);
  return (
    <h2
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#333' : '#fff'
      }}
    >
      {children}: {theme}
      
    </h2>
  );
}

export default Header;