import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState(null);

    // 간단한 백엔드 호출 예제
    const fetchHello = async () => {
        try {
            const res = await fetch('/api/hello');
            if (!res.ok) throw new Error(res.statusText);
            const data = await res.json();
            setMessage(data.message);
        } catch (e) {
            setMessage('Error: ' + e.message);
        }
    };

    return (
        <>
            <div>
                <a href='https://vite.dev' target='_blank'>
                    <img src={viteLogo} className='logo' alt='Vite logo' />
                </a>
                <a href='https://react.dev' target='_blank'>
                    <img src={reactLogo} className='logo react' alt='React logo' />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className='card'>
                <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
                <button onClick={fetchHello} style={{ marginLeft: 12 }}>
                    Call /api/hello
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            {message && <p className='read-the-docs'>Backend: {message}</p>}
            <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
        </>
    );
}

export default App;
