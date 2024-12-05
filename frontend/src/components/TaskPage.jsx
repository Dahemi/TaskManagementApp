import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingTask, setEditingTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const [importantTasks, setImportantTasks] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(false);

  //retrieve JWT token from localStorage,decode it
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken ? decodedToken.userId : null;

  //sends a GET request to fetch all tasks for the logged-in user
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

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  //sends a POST request to create a new task
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
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  //Set the current task to be edited
  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
  };

  //Sends a PUT request to Update the current task with the new edited values
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

  //sends a DELETE request to delete the current task
  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete("http://localhost:3000/api/v1/delete-task", {
        data: { taskId, userId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle the 'important' status of a task
  const handleToggleImportant = async (taskId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/v1/update-imp-task/${taskId}$`,

        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error("Error marking task as important:", err);
    }
  };

  // Toggle the 'completed' status of a task
  const handleToggleCompletion = async (taskId, currentStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/api/v1/update-completed-task/${taskId}$`,

        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error("Error updating task completion:", err);
    }
  };

  // Filter tasks based on importance and completion
  const filteredTasks = importantTasks
    ? tasks.filter((task) => task.important)
    : tasks;

  const filteredByCompletionTasks = completedTasks
    ? filteredTasks.filter((task) => task.completed)
    : filteredTasks;

  return (
    <div className="max-w-3xl mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>
      {!editingTask && (
        <>
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
            {Array.isArray(tasks) && tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white p-4 mb-4 shadow-lg rounded-md"
                >
                  <h3 className="text-xl font-semibold">{task.title}</h3>
                  <p>{task.description}</p>

                  {/* Want to Edit Button */}
                  <button
                    onClick={() => handleEditTask(task)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Want to Edit?
                  </button>

                  <button
                    onClick={() =>
                      handleToggleCompletion(task._id, task.completed)
                    }
                  >
                    Mark as {task.completed ? "Incomplete" : "Completed"}
                  </button>
                  <button onClick={() => handleToggleImportant(task._id)}>
                    {task.important
                      ? "Unmark as Important"
                      : "Mark as Important"}
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="mt-2 bg-red-500 text-white p-2 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No tasks to display.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default TaskPage;
