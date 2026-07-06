import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', image: '', author: 'Horizon Editorial', tags: '', published: 1 });

  useEffect(() => {
    if (!editing && form.title) {
      setForm(f => ({ ...f, slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') }))
    }
  }, [form.title, editing])

  const load = () => {
    setLoading(true);
    fetch('/api/admin/blog').then(r => r.json()).then(data => { setPosts(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const stripHtml = (html) => {
    return html.replace(/<\/p>\s*<p>/g, '\n').replace(/<\/?p>/g, '').replace(/<br\s*\/?>/g, '\n').trim()
  }

  const toHtml = (text) => {
    return text.split('\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editing ? `/api/admin/blog/${editing}` : '/api/admin/blog';
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, content: toHtml(form.content) }) });
    setShowForm(false); setEditing(null); setForm({ title: '', slug: '', excerpt: '', content: '', image: '', author: 'Horizon Editorial', tags: '', published: 1 });
    load();
  };

  const editPost = (post) => {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: stripHtml(post.content),
      image: post.image || '',
      author: post.author || 'Horizon Editorial',
      tags: post.tags || '',
      published: post.published
    });
    setEditing(post.id);
    setShowForm(true);
  };

  const deletePost = async (id) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-midnight-950">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-midnight-900 dark:text-white">Blog Posts</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your blog content</p>
          </div>
          <button onClick={() => { setEditing(null); setForm({ title: '', slug: '', excerpt: '', content: '', image: '', author: 'Horizon Editorial', tags: '', published: 1 }); setShowForm(!showForm); }} className="btn-primary text-sm !py-2 !px-4">
            {showForm ? 'Cancel' : 'New Post'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="admin-card mb-8 animate-slide-down">
            <h2 className="text-lg font-semibold text-midnight-900 dark:text-white mb-4">{editing ? 'Edit Post' : 'New Post'}</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label><input className="input-field" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label><input className="input-field" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label><input className="input-field" value={form.image} onChange={e => setForm({...form, image: e.target.value})} /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Excerpt</label><textarea className="input-field" rows={2} value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label><textarea className="input-field text-sm" rows={10} value={form.content} onChange={e => setForm({...form, content: e.target.value})} required /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author</label><input className="input-field" value={form.author} onChange={e => setForm({...form, author: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label><input className="input-field" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Published</label><select className="input-field" value={form.published} onChange={e => setForm({...form, published: parseInt(e.target.value)})}><option value={1}>Published</option><option value={0}>Draft</option></select></div>
            </div>
            <button type="submit" className="btn-primary text-sm !py-2 !px-4">{editing ? 'Update' : 'Create'} Post</button>
          </form>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-horizon-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="admin-card overflow-hidden !p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-midnight-800/50">
                <tr><th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Title</th><th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Slug</th><th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Status</th><th className="text-right p-4 font-medium text-gray-500 dark:text-gray-400">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-midnight-800">
                {posts.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-midnight-800/30 transition-colors">
                    <td className="p-4 text-midnight-900 dark:text-white font-medium">{p.title}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{p.slug}</td>
                    <td className="p-4">{p.published ? <span className="badge-success">Published</span> : <span className="badge-warning">Draft</span>}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => editPost(p)} className="text-horizon-600 hover:text-horizon-700 dark:text-horizon-400 mr-3 transition-colors">Edit</button>
                      <button onClick={() => deletePost(p.id)} className="text-red-500 hover:text-red-600 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
