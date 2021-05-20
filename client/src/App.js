import "bootstrap/dist/css/bootstrap.min.css"
import Login from "./Login"
import Dashboard from "./Dashboard"
//import React, {useState} from "react"
import './App.css'
/*
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

function App(){
  const [todos, setTodos] = useState([
    {
      text: 'Learn',
      isCompleted: false

    },
    {
      text: 'Lunch',
      isCompleted: false

    }
  ]);

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
    <div className="app">
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

export default App
*/
const code = new URLSearchParams(window.location.search).get("code")

function App() {
  return (code ? <Dashboard code={code} /> : <Login />
  )

}

export default App
