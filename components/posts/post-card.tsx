import Link from 'next/link'
import Image from 'next/image'
import type { PostCard as PostCardType } from '@/types'

export function PostCard({ post }: { post: PostCardType }) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <article className="rounded-2xl border border-zinc-800 overflow-hidden hover:border-zinc-600 transition-all duration-200 group">

        {/* Featured Image */}
        {post.featuredImage ? (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-48 bg-zinc-900 flex items-center justify-center">
            <span className="text-zinc-600 text-sm">No image</span>
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-foreground group-hover:text-white transition line-clamp-2">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map(({ tag }) => (
                <span
                  key={tag.id}
                  className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <span>{post.author.name}</span>
            <div className="flex items-center gap-3">
              <span>♥ {post._count.likes}</span>
              <span>💬 {post._count.comments}</span>
            </div>
          </div>
        </div>

      </article>
    </Link>
  )
}