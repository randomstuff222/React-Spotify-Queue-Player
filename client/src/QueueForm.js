import React, {useState} from "react"
import './App.css'

function Todo({todo, index, removeTodo}){
  return(
    <div 
    style={{textDecoration: todo.isCompleted ? 'line-through' : ''}}
    className="todo">
      {todo.text}
      <div>
        <button onClick={() => removeTodo(index)}>x</button>
      </div>
    </div>
  )
}

function TodoForm({addTodo}){
  const [value, setValue] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    if(!value) return;
    addTodo(value);
    setValue('');
  }
  return(
    <form onSubmit={handleSubmit}>
      <input 
      type="text" 
      className="input" 
      value={value} 
      placeholder = "Add To do..."
      onChange={e => setValue(e.target.value)}/>
    </form>
  )
}

function Queue(){
  /*const [todos, setTodos] = useState([
    {
      text: 'Learn',
      isCompleted: false

    },
    {
      text: 'Lunch',
      isCompleted: false

    }
  ]);*/
  const [todos, setTodos] = useState([]);

  const addTodo = text => {
    const newTodos = [...todos, {text}];
    setTodos(newTodos);
  };

  const removeTodo = index => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  return(
    <div className="Queue">
      <div className="todo-list">
        {todos.map((todo, index) => (
          <Todo 
          key={index} 
          index={index} 
          todo={todo} 
          removeTodo={removeTodo}/>
        ))}
        <TodoForm addTodo={addTodo} />
      </div>
    </div>
  )

}

export default Queue