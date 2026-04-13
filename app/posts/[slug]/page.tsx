import { getCachedPost } from '@/lib/cache'
import { getCurrentUser } from '@/lib/get-user'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Suspense } from 'react'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getCachedPost(slug)

  if (!post) return { title: 'Post not found' }

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const [post, user] = await Promise.all([
    getCachedPost(slug),
    getCurrentUser(),
  ])

  if (!post) notFound()

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">

      {/* Header */}
      <div className="space-y-4">
        {/* Category + Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-400">
            {post.category}
          </span>
          {post.tags.map(({ tag }) => (
            <span
              key={tag.id}
              className="text-xs px-3 py-1 rounded-full border border-zinc-700 text-zinc-400"
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>

        {/* Author + Date */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {post.author.avatarUrl && (
            <Image
              src={post.author.avatarUrl}
              alt={post.author.name ?? ''}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span>{post.author.name}</span>
          <span>·</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span>·</span>
          <span>♥ {post._count.likes}</span>
          <span>·</span>
          <span>💬 {post._count.comments}</span>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <article
        className="prose prose-invert prose-zinc max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Like Button */}
      <div className="border-t border-zinc-800 pt-8">
        <Suspense fallback={null}>
          <LikeSection postId={post.id} user={user} />
        </Suspense>
      </div>

      {/* Comments */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">
          Comments ({post._count.comments})
        </h2>
        <Suspense fallback={<p className="text-muted-foreground text-sm">Loading comments...</p>}>
          <CommentsSection
            comments={post.comments}
            postId={post.id}
            user={user}
          />
        </Suspense>
      </div>

    </main>
  )
}

// ---- Like Section ----
function LikeSection({
  postId,
  user,
}: {
  postId: string
  user: { id: string } | null
}) {
  return (
    <div className="flex items-center gap-3">
      {user ? (
        <p className="text-sm text-muted-foreground">
          Like this post? Hit the ♥ button! (coming soon)
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          <a href="/login" className="text-foreground hover:underline">Sign in</a> to like this post
        </p>
      )}
    </div>
  )
}

// ---- Comments Section ----
function CommentsSection({
  comments,
  postId,
  user,
}: {
  comments: {
    id: string
    content: string
    createdAt: Date
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    }
  }[]
  postId: string
  user: { id: string } | null
}) {
  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {user ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Comment form coming soon
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          <a href="/login" className="text-foreground hover:underline">Sign in</a> to leave a comment
        </p>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No comments yet. Be the first!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 p-4 rounded-xl border border-zinc-800"
            >
              {comment.author.avatarUrl && (
                <Image
                  src={comment.author.avatarUrl}
                  alt={comment.author.name ?? ''}
                  width={32}
                  height={32}
                  className="rounded-full h-8 w-8 object-cover"
                />
              )}
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{comment.author.name}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-sm text-zinc-300">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}