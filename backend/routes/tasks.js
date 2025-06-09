const router = require('express').Router();
const Task = require('../models/Task');
const auth = require('../middlewares/auth');

router.post('/', auth, async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.user.id });
  res.json(task);
});

router.get('/', auth, async (req, res) => {
  const { status, sort = 'createdAt', search } = req.query;
  const query = { user: req.user.id };

  if (status) query.status = status;
  if (search) query.$or = [
    { title: new RegExp(search, 'i') },
    { description: new RegExp(search, 'i') }
  ];

  const tasks = await Task.find(query).sort(sort);
  res.json(tasks);
});

router.patch('/:id', auth, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  res.json(task);
});

router.delete('/:id', auth, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ msg: 'Deleted' });
});
