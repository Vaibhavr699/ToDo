const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

cron.schedule('0 * * * *', async () => {
  const now = new Date();
  const tomorrow = new Date(Date.now() + 86400000);
  const tasks = await Task.find({
    dueDate: { $gte: now, $lte: tomorrow },
    status: { $ne: 'Completed' }
  }).populate('user');

  for (const task of tasks) {
    await sendEmail(task.user.email, `Reminder: ${task.title}`, `Due on ${task.dueDate}`);
  }
});
