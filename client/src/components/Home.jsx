import React, { useEffect, useState } from 'react';
import { postService } from '../api/api';
import PostCard from '../components/PostCard';
import useApi from '../api/useApi';

export default function Home() {
  const { request, loading, error } = useApi();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await request(() => postService.getAllPosts(page, 6));
        if (!mounted) return;
        setPosts(res.data);
        setPages(res.pages);
      } catch (err) { /* ignore */ }
    })();
    return () => { mounted = false; };
  }, [page]);

  return (
    <div>
      <h1>All Posts</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {posts.map(p => <PostCard key={p._id} post={p} />)}
      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
        <span>Page {page} / {pages}</span>
        <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages}>Next</button>
      </div>
    </div>
  );
}
