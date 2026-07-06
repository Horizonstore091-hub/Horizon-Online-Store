import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-horizon-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="section-title">The Horizon Journal</h1>
        <p className="section-subtitle mx-auto">Stories, guides, and insights from the world of premium living.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, i) => (
          <Link key={post.id} to={`/blog/${post.slug}`} className="group animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="product-card overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags && post.tags.split(',').slice(0, 2).map(tag => (
                    <span key={tag} className="badge-info text-xs">{tag.trim()}</span>
                  ))}
                </div>
                <h2 className="font-semibold text-lg text-midnight-900 dark:text-white group-hover:text-horizon-600 dark:group-hover:text-horizon-400 transition-colors mb-2">{post.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-midnight-800">
                  <span className="text-xs text-gray-400">{post.author}</span>
                  <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
