import { useState, useEffect } from 'react';
import axios from 'axios';
import TodoList from './TodoList';
import './Todo.css';

const sampleTodos = [{ id: 1, text: '샘플 항목 1', completed: false }];

function TodoApp() {
    const [todos, setTodos] = useState(sampleTodos);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);

    // 로컬 폴백 함수
    const saveLocal = (data) => {
        try {
            localStorage.setItem('todos', JSON.stringify(data));
        } catch {}
    };

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const res = await axios.get('/api/todos');
                if (mounted) setTodos(res.data || []);
            } catch (e) {
                // API 실패 시 로컬스토리지에서 로드
                try {
                    const raw = localStorage.getItem('todos');
                    if (raw && mounted) setTodos(JSON.parse(raw));
                } catch {}
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => (mounted = false);
    }, []);

    useEffect(() => saveLocal(todos), [todos]);

    const addTodo = async (e) => {
        e.preventDefault();
        const t = text.trim();
        if (!t) return;
        try {
            const res = await axios.post('/api/todos', { text: t });
            setTodos((prev) => [res.data, ...prev]);
            setText('');
        } catch (e) {
            // 실패 시 로컬에만 추가
            setTodos((prev) => [{ id: Date.now(), text: t, completed: false }, ...prev]);
            setText('');
        }
    };

    const toggle = async (id) => {
        const target = todos.find((t) => t.id === id);
        if (!target) return;
        const updated = { ...target, completed: !target.completed };
        try {
            const res = await axios.put(`/api/todos/${id}`, updated);
            setTodos((prev) => prev.map((t) => (t.id === id ? res.data : t)));
        } catch (e) {
            setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
        }
    };

    const remove = async (id) => {
        try {
            await axios.delete(`/api/todos/${id}`);
            setTodos((prev) => prev.filter((t) => t.id !== id));
        } catch (e) {
            setTodos((prev) => prev.filter((t) => t.id !== id));
        }
    };

    return (
        <div className='todo-app'>
            <h2>할 일 목록</h2>
            <form onSubmit={addTodo} className='todo-form'>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder='할 일을 입력하세요'
                />
                <button type='submit'>추가</button>
            </form>
            {loading ? (
                <p>로딩 중...</p>
            ) : (
                <TodoList todos={todos} onToggle={toggle} onRemove={remove} />
            )}
        </div>
    );
}

export default TodoApp;
