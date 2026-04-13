import { unstable_cache } from "next/cache";
import { prisma } from '@/lib/prisma';
import {Category} from '@/lib/generated/enums'
// ---- Home page (3 posts per category) ----
export const getCachedHomePosts = unstable_cache(
  async () => {
    const [tech, dsa, blankCanvas] = await Promise.all([
      prisma.post.findMany({
        where: { status: 'PUBLISHED', category: 'TECH' },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          category: true,
          createdAt: true,
          author: {
            select: { id: true, name: true, avatarUrl: true },
          },
          tags: {
            select: {
              tag: { select: { id: true, name: true, slug: true } },
            },
          },
          _count: {
            select: { likes: true, comments: true },
          },
        },
      }),
      prisma.post.findMany({
        where: { status: 'PUBLISHED', category: 'DSA' },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          category: true,
          createdAt: true,
          author: {
            select: { id: true, name: true, avatarUrl: true },
          },
          tags: {
            select: {
              tag: { select: { id: true, name: true, slug: true } },
            },
          },
          _count: {
            select: { likes: true, comments: true },
          },
        },
      }),
      prisma.post.findMany({
        where: { status: 'PUBLISHED', category: 'BLANK_CANVAS' },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          category: true,
          createdAt: true,
          author: {
            select: { id: true, name: true, avatarUrl: true },
          },
          tags: {
            select: {
              tag: { select: { id: true, name: true, slug: true } },
            },
          },
          _count: {
            select: { likes: true, comments: true },
          },
        },
      }),
    ])

    return { tech, dsa, blankCanvas }
  },
  ['home-posts'],
  { revalidate: 86400, tags: ['posts'] }
)

export const getCachedPosts = unstable_cache(
  async (category?: Category) => {
    return prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        ...(category && { category }),
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        category: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })
  },
  ['posts'],
  { revalidate: 3600, tags: ['posts'] }
)

// ---- Single post by slug ----
export const getCachedPost = unstable_cache(
  async (slug: string) => {
    return prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })
  },
  ['post'],
  { revalidate: 3600, tags: ['posts'] }
)

// ---- Posts by tag ----
export const getCachedPostsByTag = unstable_cache(
  async (tagSlug: string, category?: Category) => {
    return prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        ...(category && { category }),
        tags: {
          some: {
            tag: { slug: tagSlug },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        category: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })
  },
  ['posts-by-tag'],
  { revalidate: 3600, tags: ['posts'] }
)

// ---- Tags by category ----
export const getCachedTagsByCategory = unstable_cache(
  async (category: Category) => {
    return prisma.tag.findMany({
      where: {
        posts: {
          some: {
            post: {
              category,
              status: 'PUBLISHED',
            },
          },
        },
      },
    })
  },
  ['tags-by-category'],
  { revalidate: 86400, tags: ['tags'] }
)