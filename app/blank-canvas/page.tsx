import { getCachedPosts, getCachedTagsByCategory } from '@/lib/cache'
import { PostCard } from '@/components/posts/post-card'
import { PostCardSkeleton } from '@/components/posts/post-card-skeleton'
import { Suspense } from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Blank Canvas',
  description: 'Creative writing and everything else',
}

export default async function BlankCanvasPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  const { tag } = await searchParams
  const [posts, tags] = await Promise.all([
    getCachedPosts('BLANK_CANVAS'),
    getCachedTagsByCategory('BLANK_CANVAS'),
  ])

  const filteredPosts = tag
    ? posts.filter((post) =>
        post.tags.some(({ tag: t }) => t.slug === tag)
      )
    : posts

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Blank Canvas</h1>
        <p className="text-muted-foreground">
          Creative writing and everything else
        </p>
      </div>

      {/* Tag Filter */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blank-canvas"
            className={`text-xs px-3 py-1 rounded-full border transition ${
              !tag
                ? 'bg-foreground text-background border-foreground'
                : 'border-zinc-700 text-muted-foreground hover:border-zinc-500'
            }`}
          >
            All
          </Link>
          {tags.map((t) => (
            <Link
              key={t.id}
              href={`/blank-canvas?tag=${t.slug}`}
              className={`text-xs px-3 py-1 rounded-full border transition ${
                tag === t.slug
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-zinc-700 text-muted-foreground hover:border-zinc-500'
              }`}
            >
              {t.name}
            </Link>
          ))}
        </div>
      )}

      {/* Posts */}
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      }>
        {filteredPosts.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No posts found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Suspense>
    </main>
  )
}