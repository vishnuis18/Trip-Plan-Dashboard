const express = require('express');
const router = express.Router();
const storage = require('../services/storage');

router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id || '660000000000000000000001';
    const notifications = await storage.getNotifications(userId);
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

router.put('/:id/read', async (req, res) => {
  try {
    const notif = await storage.markNotificationRead(req.params.id);
    res.json({ notification: notif });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification' });
  }
});

module.exports = router;
