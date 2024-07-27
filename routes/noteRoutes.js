const express = require("express");
const noteModel = require("../model/notesModel");
const authenticateToken = require("../middleware/authenticateToken");

const noteRouter = express.Router();

noteRouter.get("/", authenticateToken, async (req, res) => {
  const { userId } = req;
  const allNotes = await noteModel.find({ userId });
  res.send(allNotes);
});

noteRouter.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const noteData = await noteModel.find({ _id: id, userId });
  res.status(200);
  res.send(noteData);
});

noteRouter.post("/", authenticateToken, async (req, res) => {
  const { title, description, pinned, bgColor } = req.body;
  const { email, userId } = req;
  const newNote = new noteModel({
    userId,
    title,
    description,
    pinned,
    bgColor,
  });
  await newNote.save();
  res.status(200);
  res.send("Created Successfully");
});

noteRouter.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, pinned, bgColor } = req.body;
  const { userId } = req;
  const existingNote = noteModel.find({ id, userId });
  if (existingNote === null) {
    res.send("Note does not exists");
  } else {
    await noteModel.findByIdAndUpdate(id, {
      title,
      description,
      pinned,
      bgColor,
      userId,
    });
    res.status(200);
    res.send("Note updated successfully");
  }
});

noteRouter.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const deleteNote = await noteModel.deleteOne({ _id: id, userId });
  if (deleteNote.deletedCount === 1) {
    res.status(200);
    res.send("Note deleted successfully");
  } else {
    res.send("Note does not exists");
  }
});

module.exports = noteRouter;
