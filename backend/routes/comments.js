const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token is not valid' });
        req.user = user;
        next();
    });
};

// Get comments for a post
router.get('/:postId', (req, res) => {
    const sql = `
        SELECT comments.*, users.username as author 
        FROM comments 
        JOIN users ON comments.user_id = users.id 
        WHERE comments.post_id = ? 
        ORDER BY comments.created_at ASC
    `;
    db.all(sql, [req.params.postId], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Error fetching comments' });
        res.json(rows);
    });
});

// Add a comment
router.post('/', authenticateToken, (req, res) => {
    const { post_id, content } = req.body;
    const userId = req.user.id;

    if (!post_id || !content) {
        return res.status(400).json({ message: 'Please provide post_id and content' });
    }

    const sql = `INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)`;
    db.run(sql, [post_id, userId, content], function(err) {
        if (err) return res.status(500).json({ message: 'Error adding comment' });
        res.status(201).json({ id: this.lastID, message: 'Comment added successfully' });
    });
});

// Delete a comment
router.delete('/:id', authenticateToken, (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.id;

    const sql = `DELETE FROM comments WHERE id = ? AND user_id = ?`;
    db.run(sql, [commentId, userId], function(err) {
        if (err) return res.status(500).json({ message: 'Error deleting comment' });
        if (this.changes === 0) return res.status(404).json({ message: 'Comment not found or unauthorized' });
        res.json({ message: 'Comment deleted successfully' });
    });
});

module.exports = router;
