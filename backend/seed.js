const db = require('./config/database');
const bcrypt = require('bcryptjs');

async function seed() {
    console.log('Seeding database...');

    const hashedPassword = await bcrypt.hash('password123', 10);
    
    db.serialize(() => {
        // Create a default admin user
        db.run(`INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)`, 
            ['admin', 'admin@zenpost.com', hashedPassword], function(err) {
            
            const userId = this.lastID || 1; // Assume 1 if already exists

            const posts = [
                {
                    title: 'The Art of Mindfulness in a Digital Age',
                    content: 'In our fast-paced, always-connected world, finding moments of peace can be challenging. ZenPost is here to help you navigate the noise and find your center...',
                    image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800'
                },
                {
                    title: 'Minimalist Workspaces: Less is More',
                    content: 'A cluttered desk often leads to a cluttered mind. Discover how simplifying your environment can lead to profound increases in productivity and creative clarity...',
                    image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'
                },
                {
                    title: 'Morning Rituals for a Balanced Day',
                    content: 'The way you start your morning sets the tone for the rest of your day. We explore three simple rituals that take less than 10 minutes but provide lasting energy...',
                    image_url: 'https://images.unsplash.com/photo-1447078806655-40579c2520d6?auto=format&fit=crop&q=80&w=800'
                }
            ];

            posts.forEach(post => {
                db.run(`INSERT INTO posts (user_id, title, content, image_url) VALUES (?, ?, ?, ?)`,
                    [userId, post.title, post.content, post.image_url]);
            });

            console.log('Seed data inserted successfully!');
        });
    });
}

seed();
