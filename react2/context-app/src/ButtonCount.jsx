import { useContext, useState } from 'react';
import ThemeContext from './ThemeContext';

function ButtonCount() {

    const { theme } = useContext(ThemeContext);
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount((count) => count + 1)}
            style={{
                backgroundColor: theme === 'light' ? '#fff' : '#333',
                color: theme === 'light' ? '#333' : '#fff'
            }}
        >
            count is {count}
        </button>
    );
}

export default ButtonCount;