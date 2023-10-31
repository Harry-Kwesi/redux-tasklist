import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTask, deleteTask, toggleCompletion, editTask } from "./actions";

function TaskList() {
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();

  const [taskText, setTaskText] = useState("");
  const [editMode, setEditMode] = useState(null);

  // Function to retrieve tasks from local storage on component mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    storedTasks.forEach((task) => dispatch(addTask(task))); // Dispatch each task to Redux
  }, [dispatch]);

  // Function to update local storage with the provided tasks
  const updateLocalStorage = (updatedTasks) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // Function to add a new task
  const handleAddTask = () => {
    const trimmedText = taskText.trim();
    if (trimmedText === "") return;

    const newTask = {
      id: Date.now(),
      text: trimmedText,
      completed: false,
    };

    const updatedTasks = [...tasks, newTask];
    dispatch(addTask(newTask)); // Dispatch the addTask action to Redux
    updateLocalStorage(updatedTasks); // Update local storage with the updated tasks
    setTaskText("");
  };

  // Function to delete a task
  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    dispatch(deleteTask(id)); // Dispatch the deleteTask action to Redux
    updateLocalStorage(updatedTasks); // Update local storage with the updated tasks
  };

  // Function to toggle task completion
  const handleToggleCompletion = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    dispatch(toggleCompletion(id)); // Dispatch the toggleCompletion action to Redux
    updateLocalStorage(updatedTasks); // Update local storage with the updated tasks
  };

  // Function to enter edit mode
  const enterEditMode = (id) => {
    setEditMode(id);
  };

  // Function to exit edit mode and save changes
  const exitEditMode = (id, newText) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, text: newText };
      }
      return task;
    });
    dispatch(editTask(id, newText)); // Dispatch the editTask action to Redux
    updateLocalStorage(updatedTasks); // Update local storage with the updated tasks
    setEditMode(null);
  };

  return (
    <div>
      <h1>Task List</h1>
      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="Enter a task"
      />
      <button onClick={handleAddTask}>Add Task</button>
      <ul>
        {tasks.length === 0 ? (
          <li>No tasks yet</li>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
              onToggleCompletion={handleToggleCompletion}
              onEnterEditMode={enterEditMode}
              onExitEditMode={exitEditMode}
              editMode={editMode}
            />
          ))
        )}
      </ul>
    </div>
  );
}

function TaskItem({
  task,
  onDelete,
  onToggleCompletion,
  onEnterEditMode,
  onExitEditMode,
  editMode,
}) {
  const [editedText, setEditedText] = useState(task.text);

  return (
    <li>
      {editMode === task.id ? (
        <>
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          <button onClick={() => onExitEditMode(task.id, editedText)}>
            Save
          </button>
        </>
      ) : (
        <>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleCompletion(task.id)}
          />
          <span>{task.text}</span>
          <button onClick={() => onDelete(task.id)}>Delete</button>
          <button onClick={() => onEnterEditMode(task.id)}>Edit</button>
        </>
      )}
    </li>
  );
}

export default TaskList;
