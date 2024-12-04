/*import React, { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Get the token from local storage and decode it to get the user ID
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken ? decodedToken.userId : null; // Extract userId from the decoded token

  const fetchTasks = async () => {
    if (!userId) return; // Ensure userId is available before making the request
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/get-all-tasks?id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(response.data.tasks);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTasks(); // Fetch tasks when userId is available
    }
  }, [userId]); // Only depend on userId, as token doesn't change

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!userId) return;
    try {
      await axios.post(
        "http://localhost:3000/api/v1/create-task",
        { title, description, id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTitle("");
      setDescription("");
      // Refresh tasks list after adding new task
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete("http://localhost:3000/api/v1/delete-task", {
        data: { taskId, userId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh tasks list after deletion
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>
      <form onSubmit={handleCreateTask} className="mb-6">
        <input
          type="text"
          placeholder="Task Title"
          className="w-full p-2 mb-4 border rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Task Description"
          className="w-full p-2 mb-4 border rounded-md"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md"
        >
          Add Task
        </button>
      </form>

      <div>
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white p-4 mb-4 shadow-lg rounded-md"
          >
            <h3 className="text-xl font-semibold">{task.title}</h3>
            <p>{task.description}</p>
            <button
              onClick={() => handleDeleteTask(task._id)}
              className="mt-2 bg-red-500 text-white p-2 rounded-md"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskPage;*/

import React, { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [importantTasks, setImportantTasks] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(false);

  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken ? decodedToken.userId : null;

  useEffect(() => {
    const fetchTasks = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/get-all-tasks?id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTasks(response.data.tasks);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, [userId, token]);

  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
  };

  const handleSaveEditedTask = async () => {
    if (!editingTask) return;
    try {
      await axios.put(
        "http://localhost:3000/api/v1/update-task",
        {
          taskId: editingTask._id,
          title: editedTitle,
          description: editedDescription,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingTask(null);
      setEditedTitle("");
      setEditedDescription("");
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleToggleImportant = async (taskId) => {
    try {
      await axios.put(
        "http://localhost:3000/api/v1/update-task",
        { taskId, isImportant: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error("Error marking task as important:", err);
    }
  };

  const handleToggleCompletion = async (taskId, currentStatus) => {
    try {
      await axios.put(
        "http://localhost:3000/api/v1/update-task",
        { taskId, isCompleted: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error("Error updating task completion:", err);
    }
  };

  const filteredTasks = importantTasks
    ? tasks.filter((task) => task.isImportant)
    : tasks;

  const filteredByCompletionTasks = completedTasks
    ? tasks.filter((task) => task.isCompleted)
    : filteredTasks;

  return (
    <div className="max-w-3xl mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>
      {editingTask ? (
        <div>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
          <button onClick={handleSaveEditedTask}>Save</button>
        </div>
      ) : (
        <form onSubmit={handleCreateTask} className="mb-6">
          <input
            type="text"
            placeholder="Task Title"
            className="w-full p-2 mb-4 border rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Task Description"
            className="w-full p-2 mb-4 border rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md"
          >
            Add Task
          </button>
        </form>
      )}
      <button onClick={() => setImportantTasks(!importantTasks)}>
        {importantTasks ? "Show All Tasks" : "Show Important Tasks"}
      </button>
      <button onClick={() => setCompletedTasks(!completedTasks)}>
        {completedTasks ? "Show All Tasks" : "Show Completed Tasks"}
      </button>
      <div>
        {filteredByCompletionTasks.map((task) => (
          <div key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <button onClick={() => handleEditTask(task)}>Edit</button>
            <button
              onClick={() => handleToggleCompletion(task._id, task.isCompleted)}
            >
              Mark as {task.isCompleted ? "Incomplete" : "Completed"}
            </button>
            <button onClick={() => handleToggleImportant(task._id)}>
              {task.isImportant ? "Unmark as Important" : "Mark as Important"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskPage;
