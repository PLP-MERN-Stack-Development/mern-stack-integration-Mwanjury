import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService, categoryService } from '../api/api';
import useApi from '../api/useApi';
import { AuthContext } from '../context/AuthContext';

export default function CreateEdit({ editMode }) {
  const { id } = useParams();
  const { request, loading, error } = useApi();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);
  const [file, setFile] = useState(null);
  const { user } = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    request(() => categoryService.getAllCategories()).then(setCategories).catch(()=>{});
    if (editMode && id) {
      request(() => postService.getPost(id)).then(p => {
        setTitle(p.title);
        setBody(p.body);
        setSelected((p.categories || []).map(c => c._id));
      }).catch(()=>{});
    }
  }, [editMode, id]);

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !body) return alert('Title and body required');

    const form = new FormData();
    form.append('title', title);
    form.append('body', body);
    selected.forEach(s => form.append('categories[]', s));
    if (file) form.append('featuredImage', file);

    try {
      if (editMode) await request(() => postService.updatePost(id, form));
      else await request(() => postService.createPost(form));
      nav('/');
    } catch (err) { /* handled by hook */ }
  };

  if (!user) return <p>Please login to create/edit posts.</p>;

  return (
    <form onSubmit={submit} className="post-form">
      <div><label>Title</label><input value={title} onChange={e=>setTitle(e.target.value)} required /></div>
      <div><label>Body</label><textarea value={body} onChange={e=>setBody(e.target.value)} required rows={10} /></div>
      <div>
        <label>Categories</label>
        <select multiple value={selected} onChange={(e)=> setSelected(Array.from(e.target.selectedOptions, o=>o.value))}>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>
      <div><label>Featured Image</label><input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} /></div>
      <button type="submit" disabled={loading}>{editMode ? 'Update' : 'Create'}</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
