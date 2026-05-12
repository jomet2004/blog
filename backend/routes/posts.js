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

// Get all posts
router.get('/', (req, res) => {
    const sql = `
        SELECT posts.*, users.username as author 
        FROM posts 
        JOIN users ON posts.user_id = users.id 
        ORDER BY posts.created_at DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Error fetching posts' });
        res.json(rows);
    });
});

// Get single post
router.get('/:id', (req, res) => {
    const sql = `
        SELECT posts.*, users.username as author 
        FROM posts 
        JOIN users ON posts.user_id = users.id 
        WHERE posts.id = ?
    `;
    db.get(sql, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ message: 'Error fetching post' });
        if (!row) return res.status(404).json({ message: 'Post not found' });
        res.json(row);
    });
});

// Create post
router.post('/', authenticateToken, (req, res) => {
    const { title, content, image_url } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
        return res.status(400).json({ message: 'Please provide title and content' });
    }

    const sql = `INSERT INTO posts (user_id, title, content, image_url) VALUES (?, ?, ?, ?)`;
    db.run(sql, [userId, title, content, image_url], function(err) {
        if (err) return res.status(500).json({ message: 'Error creating post' });
        res.status(201).json({ id: this.lastID, message: 'Post created successfully' });
    });
});

// Update post
router.put('/:id', authenticateToken, (req, res) => {
    const { title, content, image_url } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;

    const sql = `UPDATE posts SET title = ?, content = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`;
    db.run(sql, [title, content, image_url, postId, userId], function(err) {
        if (err) return res.status(500).json({ message: 'Error updating post' });
        if (this.changes === 0) return res.status(404).json({ message: 'Post not found or unauthorized' });
        res.json({ message: 'Post updated successfully' });
    });
});

// Delete post
router.delete('/:id', authenticateToken, (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    const sql = `DELETE FROM posts WHERE id = ? AND user_id = ?`;
    db.run(sql, [postId, userId], function(err) {
        if (err) return res.status(500).json({ message: 'Error deleting post' });
        if (this.changes === 0) return res.status(404).json({ message: 'Post not found or unauthorized' });
        res.json({ message: 'Post deleted successfully' });
    });
});

module.exports = router;
