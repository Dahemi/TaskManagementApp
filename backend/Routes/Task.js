//import the router function from the express package
const router = require("express").Router();
const { authenticateToken } = require("./auth.js");

//import the User model from the Models folder
const Task = require("../Models/Task");
const User = require("../Models/User");

//CREATE TASK API -- localhost:3000/api/v1/create-task
// **add Auth header with token**
router.post("/create-task", authenticateToken, async (req, res) => {
  try {
    const { title, description, id } = req.body;

    // Validate input
    if (!title || !description || !id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    //create a task object
    const newTask = new Task({ title, description });

    //save the task to the database
    const savedTask = await newTask.save();

    //extract the taskID of newly saved task
    const taskID = savedTask._id;

    //find the user and add the task ID to their tasks array
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { tasks: taskID } }, // Add new Task's id to the array
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Task created successfully", taskID });
  } catch (err) {
    console.error("Error in create-task:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//GET ALL TASKS API -- http://localhost:3000/api/v1/get-all-tasks?id=<User_ID>
router.get("/get-all-tasks", authenticateToken, async (req, res) => {
  try {
    // Use query parameters for GET requests
    // {id} should be passed in URL. ----?id=
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ message: "User ID is required in query parameters" });
    }

    const userdata = await User.findById(id).populate({
      path: "tasks",
      options: { sort: { createdAt: -1 } },
    });

    if (!userdata) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    if (!userdata.tasks || userdata.tasks.length === 0) {
      return res
        .status(200)
        .json({ message: "No tasks found for this user", tasks: [] });
    }

    res.status(200).json({
      user: {
        id: userdata._id,
        username: userdata.username,
      },
      tasks: userdata.tasks,
    });
  } catch (err) {
    console.error("Error in retrieving tasks:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE TASK API -- http://localhost:3000/api/v1/delete-task
router.delete("/delete-task", authenticateToken, async (req, res) => {
  try {
    const { taskId, userId } = req.body;

    // Validate input
    if (!taskId || !userId) {
      return res
        .status(400)
        .json({ message: "Task ID and User ID are required" });
    }

    // Find and delete the task
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Remove the task from the user's tasks array
    await User.findByIdAndUpdate(
      userId,
      { $pull: { tasks: taskId } }, // Remove the task ID from the array
      { new: true } //return the updated document
    );

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error in delete-task:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// UPDATE TASK API -- http://localhost:3000/api/v1/update-task
router.put("/update-task", authenticateToken, async (req, res) => {
  try {
    const { taskId, title, description } = req.body;

    // Validate input
    if (!taskId || (!title && !description)) {
      return res.status(400).json({
        message: "Task ID and at least one field to update are required",
      });
    }

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { ...(title && { title }), ...(description && { description }) }, // Update only the provided fields
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (err) {
    console.error("Error in update-task:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update Important Task API -- http://localhost:3000/api/v1/update-imp-task/<Task_ID>
router.put("/update-imp-task/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // Extract task ID from request parameters

    // Fetch the current task data using the ID
    const TaskData = await Task.findById(id);
    const ImpTask = TaskData.important; // Get the current 'important' field value

    // Toggle the 'important' field and update the task
    await Task.findByIdAndUpdate(id, { important: !ImpTask });

    res.status(200).json({ message: "Task updated successfully" }); // Send success response
  } catch (error) {
    console.error(error); // Log any errors for debugging
    res.status(400).json({ message: "Internal Server Error" }); // Send error response
  }
});

// Update Completed Task API -- http://localhost:3000/api/v1/update-completed-task/<Task_ID>
router.put(
  "/update-completed-task/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params; // Extract task ID from request parameters

      // Fetch the current task data using the ID
      const TaskData = await Task.findById(id);
      const CompletedStatus = TaskData.completed; // Get the current 'completed' field value

      // Toggle the 'completed' field and update the task
      await Task.findByIdAndUpdate(id, { completed: !CompletedStatus });

      res
        .status(200)
        .json({ message: "Task completion status updated successfully" }); // Send success response
    } catch (error) {
      console.error(error); // Log any errors for debugging
      res.status(400).json({ message: "Internal Server Error" }); // Send error response
    }
  }
);

// Get Important Tasks API -- http://localhost:3000/api/v1/get-important-tasks
router.get("/get-important-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.body; // Extract user ID from the request body

    // Find the user and populate their tasks
    const ImpTaskData = await User.findById(id).populate({
      path: "tasks",
      match: { important: true }, // Only get tasks where 'important' is true
      options: { sort: { createdAt: -1 } }, // Sort tasks by creation date in descending order
    });

    if (!ImpTaskData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ importantTasks: ImpTaskData.tasks }); // Respond with important tasks
  } catch (error) {
    console.error("Error fetching important tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get completed Tasks API -- http://localhost:3000/api/v1/get-completed-tasks
router.get("/get-completed-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.body; // Extract user ID from the request body

    // Find the user and populate their tasks
    const compTaskData = await User.findById(id).populate({
      path: "tasks",
      match: { completed: true }, // Only get tasks where 'important' is true
      options: { sort: { createdAt: -1 } }, // Sort tasks by creation date in descending order
    });

    if (!compTaskData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ CompletedTasks: compTaskData.tasks }); // Respond with important tasks
  } catch (error) {
    console.error("Error fetching completed tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
