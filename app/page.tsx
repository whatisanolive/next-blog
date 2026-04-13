import { getCachedHomePosts } from '@/lib/cache'
import { PostCard } from '@/components/posts/post-card'
import Link from 'next/link'
import { Suspense } from 'react'
import { PostCardSkeleton } from '@/components/posts/post-card-skeleton'

export default async function HomePage() {
  const { tech, dsa, blankCanvas } = await getCachedHomePosts()

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">

      {/* TECH */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Tech</h2>
          <Link href="/tech" className="text-sm text-muted-foreground hover:text-foreground transition">
            View all →
          </Link>
        </div>
        <Suspense fallback={<PostGridSkeleton />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tech.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </Suspense>
      </section>

      {/* DSA */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">DSA</h2>
          <Link href="/dsa" className="text-sm text-muted-foreground hover:text-foreground transition">
            View all →
          </Link>
        </div>
        <Suspense fallback={<PostGridSkeleton />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dsa.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </Suspense>
      </section>

      {/* BLANK CANVAS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Blank Canvas</h2>
          <Link href="/blank-canvas" className="text-sm text-muted-foreground hover:text-foreground transition">
            View all →
          </Link>
        </div>
        <Suspense fallback={<PostGridSkeleton />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blankCanvas.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </Suspense>
      </section>

    </main>
  )
}

function PostGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}