import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!textInput.trim()) {
      return;
    }
    if (editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = {
        text: textInput,
        date: dateInput,
        time: timeInput,
        description: descriptionInput,
        completed: tasks[editIndex].completed // Preserve completion status when editing
      };
      setTasks(updatedTasks);
      setEditIndex(null);
    } else {
      const newTask = {
        text: textInput,
        date: dateInput,
        time: timeInput,
        description: descriptionInput,
        completed: false // Initialize as not completed when adding a new task
      };
      setTasks([...tasks, newTask]);
    }
    setTextInput('');
    setDateInput('');
    setTimeInput('');
    setDescriptionInput('');
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const editTask = (index) => {
    const taskToEdit = tasks[index];
    setTextInput(taskToEdit.text);
    setDateInput(taskToEdit.date);
    setTimeInput(taskToEdit.time);
    setDescriptionInput(taskToEdit.description);
    setEditIndex(index);
  };

  return (
    <div className="main">
      <h3>TODO App</h3>
      <form onSubmit={addTask}>
        <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Task Title" />
        <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
        <input type="time" value={timeInput} onChange={(e) => setTimeInput(e.target.value)} />
        <textarea value={descriptionInput} onChange={(e) => setDescriptionInput(e.target.value)} placeholder="Description"></textarea>
        <button type="submit">{editIndex !== null ? 'Update Task' : 'Add Task'}</button>
      </form>
      <div className="tasks">
        {tasks.map((task, index) => (
          <div key={index} className={`task ${task.completed ? 'completed' : ''}`} onClick={() => toggleTaskCompletion(index)}>
            <h4>{task.text}</h4>
            <p>Date: {task.date}</p>
            <p>Time: {task.time}</p>
            <p>{task.description}</p>
            <div className="buttons">
              <button onClick={(e) => { e.stopPropagation(); editTask(index); }}>Edit</button>
              <button onClick={(e) => { e.stopPropagation(); deleteTask(index); }}>Delete</button>
              <button onClick={(e) => { e.stopPropagation(); toggleTaskCompletion(index); }}>
                {task.completed ? 'Pending' : 'Complete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
