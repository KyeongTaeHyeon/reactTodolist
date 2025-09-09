function TodoItem({ todo, onToggle, onRemove }) {
    return (
        <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <label>
                <input
                    type='checkbox'
                    checked={todo.completed}
                    onChange={() => onToggle(todo.id)}
                />
                <span className='todo-text'>{todo.text}</span>
            </label>
            <button className='todo-remove' onClick={() => onRemove(todo.id)} aria-label='삭제'>
                ✕
            </button>
        </li>
    );
}

export default TodoItem;
