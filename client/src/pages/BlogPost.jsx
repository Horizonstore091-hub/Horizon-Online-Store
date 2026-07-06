import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then(r => r.json())
      .then(data => { setPost(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-horizon-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold text-midnight-900 dark:text-white mb-4">Post not found</h2>
      <Link to="/blog" className="btn-primary">Back to Blog</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-horizon-600 dark:hover:text-horizon-400 mb-8 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Blog
      </Link>
      <article className="animate-fade-in">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags && post.tags.split(',').map(tag => (
            <span key={tag} className="badge-info text-xs">{tag.trim()}</span>
          ))}
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-midnight-900 dark:text-white mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <span>{post.author}</span>
          <span>&middot;</span>
          <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        {post.image && (
          <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-10 premium-shadow-lg">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  );
}
