const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const Task = require("../models/Task");

const router = express.Router();

// Create task
router.post(
  "/",
  [auth, [check("title", "Title is required").notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const newTask = new Task({
        user: req.user.id,
        title: req.body.title,
        description: req.body.description,
      });

      const task = await newTask.save();
      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Get all tasks
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update task
router.put("/:id", auth, async (req, res) => {
  const { title, description, completed } = req.body;
  const updated = {};
  if (title !== undefined) updated.title = title;
  if (description !== undefined) updated.description = description;
  if (completed !== undefined) updated.completed = completed;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    task = await Task.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    await task.deleteOne();
    res.json({ message: "Task removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
