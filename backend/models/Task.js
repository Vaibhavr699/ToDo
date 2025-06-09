const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  dueDate: Date,
  priority: { type: String, enum: ['Low', 'Medium', 'High'] },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'] }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
