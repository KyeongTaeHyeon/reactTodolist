import TodoItem from './TodoItem';

function TodoList({ todos, onToggle, onRemove }) {
    if (!todos || todos.length === 0) return <p className='todo-empty'>할 일이 없습니다.</p>;

    return (
        <ul className='todo-list'>
            {todos.map((t) => (
                <TodoItem key={t.id} todo={t} onToggle={onToggle} onRemove={onRemove} />
            ))}
        </ul>
    );
}

export default TodoList;
