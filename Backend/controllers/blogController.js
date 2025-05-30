import Blog from '../models/Blog.js';
import { validationResult } from 'express-validator';

export const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'published', tags, author } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (tags) query.tags = { $in: tags.split(',') };
    if (author) query.author = author;

    const blogs = await Blog.find(query)
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

export const createBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags, status } = req.body;
    
    const blog = new Blog({
      title,
      content,
      tags: tags || [],
      status: status || 'draft',
      author: req.user.username || req.user.email
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Blog with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create blog' });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Check if user owns the blog
    if (blog.author !== req.user.username && blog.author !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized to update this blog' });
    }

    const { title, content, tags, status } = req.body;
    
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;
    blog.status = status || blog.status;

    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Check if user owns the blog
    if (blog.author !== req.user.username && blog.author !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};

export const autoSaveBlog = async (req, res) => {
  try {
    const { id, title, content, tags } = req.body;
    
    let blog;
    if (id) {
      // Update existing draft
      blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      
      // Check if user owns the blog
      if (blog.author !== req.user.username && blog.author !== req.user.email) {
        return res.status(403).json({ error: 'Not authorized to update this blog' });
      }
      
      blog.title = title || blog.title;
      blog.content = content || blog.content;
      blog.tags = tags || blog.tags;
      await blog.save();
    } else {
      // Create new draft
      blog = new Blog({
        title: title || 'Untitled Draft',
        content: content || '',
        tags: tags || [],
        status: 'draft',
        author: req.user.username || req.user.email
      });
      await blog.save();
    }
    
    res.json({ success: true, blog });
  } catch (error) {
    console.error('Auto-save error:', error);
    res.status(500).json({ error: 'Auto-save failed' });
  }
};

export const getUserBlogs = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { 
      author: req.user.username || req.user.email 
    };
    
    if (status) {
      query.status = status;
    }

    const blogs = await Blog.find(query).sort({ updated_at: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user blogs' });
  }
};
