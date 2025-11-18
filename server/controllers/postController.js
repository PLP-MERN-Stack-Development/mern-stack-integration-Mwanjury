const Post = require('../models/Post');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// GET /api/posts
exports.getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', category } = req.query;
    const q = {};
    if (search) q.$or = [{ title: { $regex: search, $options: 'i' } }, { body: { $regex: search, $options: 'i' } }];
    if (category) q.categories = category;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Post.countDocuments(q);
    const posts = await Post.find(q)
      .populate('author', 'name email')
      .populate('categories', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ data: posts, page: Number(page), total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// GET /api/posts/:id
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('categories', 'name slug')
      .populate('comments.user', 'name');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) { next(err); }
};

// POST /api/posts
exports.createPost = async (req, res, next) => {
  try {
    // basic validation
    const { title, body, categories } = req.body;
    if (!title || !body) return res.status(400).json({ message: 'Title and body required' });

    const postData = {
      title,
      body,
      author: req.user._id,
      excerpt: (body || '').slice(0, 200)
    };

    // categories may be sent as array or CSV
    if (categories) {
      let cats = categories;
      if (typeof categories === 'string') {
        // supports categories[]=id or comma separated
        if (categories.includes(',')) cats = categories.split(',').map(c => c.trim());
        else cats = [categories];
      }
      // validate category ids optionally: ensure exist
      postData.categories = cats;
    }

    if (req.file) {
      postData.featuredImage = `/uploads/${req.file.filename}`;
    }

    const post = await Post.create(postData);
    const populated = await Post.findById(post._id).populate('author', 'name').populate('categories', 'name');
    res.status(201).json(populated);
  } catch (err) { next(err); }
};

// PUT /api/posts/:id
exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // optional: only author or admin can update
    if (String(post.author) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update' });
    }

    const { title, body, categories } = req.body;
    if (title) post.title = title;
    if (body) {
      post.body = body;
      post.excerpt = body.slice(0, 200);
    }
    if (categories !== undefined) {
      if (typeof categories === 'string') {
        if (categories.includes(',')) post.categories = categories.split(',').map(c => c.trim());
        else post.categories = [categories];
      } else {
        post.categories = categories;
      }
    }

    if (req.file) post.featuredImage = `/uploads/${req.file.filename}`;

    await post.save();
    const updated = await Post.findById(post._id).populate('author', 'name').populate('categories', 'name');
    res.json(updated);
  } catch (err) { next(err); }
};

// DELETE /api/posts/:id
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (String(post.author) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete' });
    }

    await post.remove();
    res.json({ message: 'Post deleted' });
  } catch (err) { next(err); }
};

// POST /api/posts/:id/comments
exports.addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = { user: req.user._id, text };
    post.comments.push(comment);
    await post.save();

    // return latest comment populated
    const last = post.comments[post.comments.length - 1];
    res.status(201).json(last);
  } catch (err) { next(err); }
};
