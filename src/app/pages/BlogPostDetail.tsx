import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPost, BlogPost } from '../services/api';
import { Loader2, Facebook, Instagram, Linkedin, Youtube, Twitter, Share2, Link as LinkIcon } from 'lucide-react';

export default function BlogPostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getBlogPost(id)
      .then(data => setPost(data))
      .catch(err => {
        console.error(err);
        setError('Failed to load blog post');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(post?.title || '');
  const encodedSummary = encodeURIComponent(post?.shortDescription || post?.description?.slice(0, 120) || '');
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const twitterShare = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const pinterestShare = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(post?.image || '')}&description=${encodedSummary}`;
  const instagramShare = `https://www.instagram.com/`;
  const youtubeShare = `https://www.youtube.com/upload`;

  const handleCopyLink = async () => {
    if (!pageUrl) return;
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center px-6 py-12 bg-slate-50">
        <Loader2 className="animate-spin text-slate-500" size={36} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center px-6 py-12 bg-slate-50">
        <div className="max-w-3xl w-full rounded-3xl border border-red-100 bg-white p-10 shadow-lg">
          <p className="mb-5 text-lg font-semibold text-red-700">{error || 'Blog post not found'}</p>
          <Link to="/blog" className="inline-flex rounded-full border border-slate-200 bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700">
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.timestamp || '').toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
          {post.image && (
            <div className="relative overflow-hidden bg-slate-900">
              <img
                src={post.image}
                alt={post.title}
                className="h-80 w-full object-cover object-center transition duration-500 ease-in-out hover:scale-[1.02]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent px-6 py-4 text-white">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-200">{post.type.replace(/-/g, ' ')}</p>
                <p className="mt-2 text-2xl font-semibold leading-tight">{post.title}</p>
              </div>
            </div>
          )}

          <div className="space-y-10 px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">{post.department || 'News'}</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                  {post.title}
                </h1>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700">
                {formattedDate}
              </div>
            </div>

            <div className="space-y-10">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Share this article</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">Spread the story across your network</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={facebookShare}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#3b5998] text-white transition hover:scale-105"
                      aria-label="Share on Facebook"
                    >
                      <Facebook size={18} />
                    </a>
                    <a
                      href={twitterShare}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1da1f2] text-white transition hover:scale-105"
                      aria-label="Share on Twitter"
                    >
                      <Twitter size={18} />
                    </a>
                    <a
                      href={linkedInShare}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#0077b5] text-white transition hover:scale-105"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin size={18} />
                    </a>
                    <a
                      href={pinterestShare}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#bd081c] text-white transition hover:scale-105"
                      aria-label="Share on Pinterest"
                    >
                      <Share2 size={18} />
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                    >
                      <LinkIcon size={16} />
                      {copied ? 'Link copied' : 'Copy link'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
<div className="prose prose-slate max-w-none text-slate-700 prose-headings:font-semibold prose-headings:text-slate-900 prose-p:text-lg prose-li:text-lg prose-strong:text-slate-900 prose-a:text-sky-600 prose-a:underline prose-a:no-underline hover:prose-a:underline whitespace-pre-wrap">
                  <div dangerouslySetInnerHTML={{ __html: post.description || post.shortDescription || '' }} />
                </div>

                <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-700 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Post details</p>
                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Type</p>
                      <p className="mt-1 text-base font-medium text-slate-900">{post.type.replace(/-/g, ' ')}</p>
                    </div>
                    {post.platform && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Platform</p>
                        <p className="mt-1 text-base font-medium text-slate-900">{post.platform}</p>
                      </div>
                    )}
                    {post.url && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">External link</p>
                        <a href={post.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm font-medium text-sky-600 hover:text-sky-500">
                          Visit source
                        </a>
                      </div>
                    )}
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Published</p>
                      <p className="mt-1 text-base font-medium text-slate-900">{formattedDate}</p>
                    </div>
                  </div>
                </aside>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div>
                <p className="text-sm text-slate-500">Want to browse more stories?</p>
                <p className="text-lg font-semibold text-slate-900">See the full blog archive.</p>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Back to blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
