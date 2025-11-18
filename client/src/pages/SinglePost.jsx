import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { postService } from '../api/api';
import useApi from '../api/useApi';
import { AuthContext } from '../context/AuthContext';

export default function SinglePost() {
  const { id } = useParams();
  const { request, loading, error } = useApi();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    request(() => postService.getPost(id)).then(setPost).catch(()=>{});
  }, [id]);

  const handleComment = async () => {
    if (!comment.trim()) return;
    // optimistic UI
    const temp = { _id: 'temp-' + Date.now(), text: comment, user: { name: user?.name || 'You' }, createdAt: new Date() };
    setPost(p => ({ ...p, comments: [...(p.comments||[]), temp] }));
    try {
      await request(() => postService.addComment(id, { text: comment }));
      setComment('');
    } catch (err) {
      // revert simple approach: refetch
      const fresh = await postService.getPost(id);
      setPost(fresh);
    }
  };

  if (loading && !post) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!post) return <p>No post found</p>;

  return (
    <article>
      <h1>{post.title}</h1>
      <div className="meta">By {post.author?.name}</div>
      {post.featuredImage && <img src={post.featuredImage} alt="" className="full-img" />}
      <div dangerouslySetInnerHTML={{ __html: post.body }} />
      <section>
        <h3>Comments</h3>
        {(post.comments || []).map(c => (
          <div key={c._id || c.createdAt} className="comment">
            <strong>{c.user?.name || 'User'}</strong> <small>{new Date(c.createdAt).toLocaleString()}</small>
            <p>{c.text}</p>
          </div>
        ))}
        {user ? (
          <>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment..." />
            <button onClick={handleComment}>Post comment</button>
          </>
        ) : <p><em>Login to comment</em></p>}
      </section>
    </article>
  );
}
