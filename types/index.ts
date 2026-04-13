import type { Post, User, Tag, Comment, Like } from '@/lib/generated/client'
import type { Category, Role, Status } from '@/lib/generated/enums'

// ---- Re-export Prisma enums for convenience ----
export type { Category, Role, Status }

// ---- Base types ----
export type { User, Tag, Comment, Like }

// ---- Post with relations ----
export type PostWithTags = Post & {
  tags: {
    tag: Tag
  }[]
}

export type PostWithAuthor = Post & {
  author: Pick<User, 'id' | 'name' | 'avatarUrl'>
}

export type PostWithComments = Post & {
  comments: (Comment & {
    author: Pick<User, 'id' | 'name' | 'avatarUrl'>
  })[]
}

export type PostWithLikes = Post & {
  likes: Like[]
  _count: {
    likes: number
  }
}

// ---- Full post (everything) ----
export type FullPost = Post & {
  author: Pick<User, 'id' | 'name' | 'avatarUrl'>
  tags: {
    tag: Tag
  }[]
  comments: (Comment & {
    author: Pick<User, 'id' | 'name' | 'avatarUrl'>
  })[]
  _count: {
    likes: number
    comments: number
  }
}

// ---- Post card (for listing pages) ----
export type PostCard = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  category: Category
  createdAt: Date
  author: Pick<User, 'id' | 'name' | 'avatarUrl'>
  tags: {
    tag: Pick<Tag, 'id' | 'name' | 'slug'>
  }[]
  _count: {
    likes: number
    comments: number
  }
}

// ---- Auth ----
export type CurrentUser = {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  role: Role
}

// ---- Form states ----
export type FormState = {
  errors: {
    [key: string]: string[] | undefined
    formErrors?: string[]
  }
}