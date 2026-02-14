import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, Search, BookOpen, Clock } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAdminStore, BlogPost } from '../utils/adminStore';

const Blog: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const loadPosts = () => {
            const store = getAdminStore();
            const publishedPosts = store.blogs.filter(blog => blog.status === 'Published');
            setPosts(publishedPosts);
            return publishedPosts;
        };

        const publishedPosts = loadPosts();

        // Deep linking: Automatically open post if id is in URL
        const postId = searchParams.get('id');
        if (postId) {
            const post = publishedPosts.find(p => p.id === Number(postId));
            if (post) {
                setSelectedPost(post);
            }
        }

        const handleUpdate = () => {
            console.log("[Blog] Store updated, refreshing...");
            loadPosts();
        };

        window.addEventListener('adminStoreUpdate', handleUpdate);
        return () => window.removeEventListener('adminStoreUpdate', handleUpdate);
    }, [searchParams]);

    const handleBack = () => {
        setSelectedPost(null);
        setSearchParams({});
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // If viewing a single post
    if (selectedPost) {
        return (
            <div className="bg-gray-50 min-h-screen py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
                    >
                        ← Back to Blog
                    </button>

                    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        {selectedPost.imageUrl && (
                            <img
                                src={selectedPost.imageUrl}
                                alt={selectedPost.title}
                                className="w-full h-64 object-cover"
                            />
                        )}
                        <div className="p-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedPost.title}</h1>

                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
                                <div className="flex items-center gap-1">
                                    <User size={14} />
                                    <span>{selectedPost.author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>{selectedPost.date}</span>
                                </div>
                            </div>

                            <div
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                            />

                            {/* Linked Exam CTA */}
                            {selectedPost.linkedExamId && (
                                <div className="mt-12 p-8 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Start Preparing?</h3>
                                        <p className="text-gray-600">Practice the exam mentioned in this article on our exact-match simulation platform.</p>
                                    </div>
                                    <Link
                                        to={`/practice-exams?examId=${selectedPost.linkedExamId}`}
                                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2 whitespace-nowrap"
                                    >
                                        Practice Now <ArrowRight size={18} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </article>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-2 block">TypingNexus.in Blog</span>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Tips, Guides & Exam Updates</h1>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Stay updated with the latest typing tips, exam notifications, and preparation strategies for RSSB, SSC, and Railway exams.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-12">
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Blog Grid */}
                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <article
                                key={post.id}
                                onClick={() => {
                                    setSelectedPost(post);
                                    setSearchParams({ id: post.id.toString() });
                                }}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                            >
                                {post.imageUrl ? (
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                        <BookOpen size={48} className="text-blue-400" />
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            <span>{post.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User size={12} />
                                            <span>{post.author}</span>
                                        </div>
                                    </div>

                                    <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>

                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                        {post.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                                    </p>

                                    <div className="flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                                        Read More <ArrowRight size={14} />
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-600 mb-2">No Blog Posts Yet</h3>
                        <p className="text-gray-400">Check back soon for typing tips and exam updates!</p>
                    </div>
                )}

                {/* Newsletter CTA */}
                <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
                    <p className="text-blue-100 mb-6 max-w-md mx-auto">
                        Get the latest exam notifications and typing tips delivered to your WhatsApp.
                    </p>
                    <a
                        href="https://wa.me/919142793580?text=Hi, I want to subscribe to TypingNexus updates"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
                    >
                        Subscribe on WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Blog;
