export function PostCardSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-800 overflow-hidden animate-pulse">
      <div className="h-48 bg-zinc-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-800 rounded w-full" />
        <div className="h-3 bg-zinc-800 rounded w-2/3" />
        <div className="flex gap-2 pt-2">
          <div className="h-5 w-12 bg-zinc-800 rounded-full" />
          <div className="h-5 w-12 bg-zinc-800 rounded-full" />
        </div>
      </div>
    </div>
  )
}