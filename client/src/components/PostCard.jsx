import React from 'react';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <h3><Link to={`/posts/${post._id}`}>{post.title}</Link></h3>
      <div className="meta">By: {post.author?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}</div>
      {post.featuredImage && <img src={post.featuredImage} alt={post.title} className="thumb" />}
      <p>{post.excerpt || (post.body && post.body.slice(0, 160) + '...')}</p>
      <Link to={`/posts/${post._id}`}>Read more</Link>
    </article>
  );
}
