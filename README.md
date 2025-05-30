BlogApp – Modern Full-Stack Blogging Platform
Welcome to BlogApp, a modern, full-stack blogging platform built with React and Node.js!
This app lets users register, log in, write and publish blogs with images, save drafts, and view all their posts in a beautiful, responsive UI.

🚀 Features
User Authentication: Register, log in, and manage your account securely.

Rich Blog Editor: Write posts with rich text formatting and upload images.

Auto-Save Drafts: Your work is auto-saved every 30 seconds and when you pause typing.

Draft & Publish: Save posts as drafts or publish them instantly.

Image Upload: Upload images from your computer – they’re stored and served from the backend.

Blog List & Dashboard: View all your blogs, filter by drafts/published, and edit or delete any post.

Responsive UI: Clean, modern design that works great on desktop and mobile.

Related Articles: Discover similar posts based on tags.

Shareable Links: Share your blog posts with a click.

Secure Backend: Rate limiting, helmet, CORS, and robust error handling.

🛠️ Tech Stack
Frontend: React, React Router, Context API, Quill (for rich text), modern CSS

Backend: Node.js, Express, MongoDB, Mongoose

Security: Helmet, CORS, express-rate-limit, JWT authentication

project-root/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   └── config/
├   |── middleware/
│   └── controllers/
| 
|    
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── App.js
│   └── public/
