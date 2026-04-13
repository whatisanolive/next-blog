import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-user'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminPage() {
  const [user, posts] = await Promise.all([
    getCurrentUser(),
    prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        createdAt: true,
        _count: {
          select: { likes: true, comments: true },
        },
      },
    }),
  ])

  const published = posts.filter((p) => p.status === 'PUBLISHED').length
  const drafts = posts.filter((p) => p.status === 'DRAFT').length

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-10">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.name}</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/create">+ New Post</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl border border-zinc-800 space-y-1">
          <p className="text-muted-foreground text-sm">Total Posts</p>
          <p className="text-3xl font-bold">{posts.length}</p>
        </div>
        <div className="p-6 rounded-2xl border border-zinc-800 space-y-1">
          <p className="text-muted-foreground text-sm">Published</p>
          <p className="text-3xl font-bold text-green-400">{published}</p>
        </div>
        <div className="p-6 rounded-2xl border border-zinc-800 space-y-1">
          <p className="text-muted-foreground text-sm">Drafts</p>
          <p className="text-3xl font-bold text-yellow-400">{drafts}</p>
        </div>
      </div>

      {/* Posts Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Posts</h2>
        <div className="rounded-2xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Likes</th>
                <th className="text-left px-4 py-3 font-medium">Comments</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    No posts yet. Create your first one!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-zinc-900/50 transition">
                    <td className="px-4 py-3 font-medium max-w-xs truncate">
                      {post.title}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {post.category}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        post.status === 'PUBLISHED'
                          ? 'bg-green-400/10 text-green-400'
                          : 'bg-yellow-400/10 text-yellow-400'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {post._count.likes}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {post._count.comments}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/posts/${post.id}/edit`}>Edit</Link>
                        </Button>
                        <DeletePostButton postId={post.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

function DeletePostButton({ postId }: { postId: string }) {
  return (
    <form action={async () => {
      'use server'
      const { prisma } = await import('@/lib/prisma')
      const { revalidateTag } = await import('next/cache')
      await prisma.post.delete({ where: { id: postId } })
      revalidateTag('posts')
    }}>
      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-400">
        Delete
      </Button>
    </form>
  )
}