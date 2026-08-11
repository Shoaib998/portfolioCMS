import prisma from "../../config/prisma";
import {
  CreateBlogDto,
  UpdateBlogDto,
} from "./blog.types";

export class BlogService {
  async createBlog(userId: string, data: CreateBlogDto) {
    return prisma.blog.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featuredImage,
        status: data.status ?? "draft",
        publishedAt:
          data.status === "published"
            ? data.publishedAt ?? new Date()
            : data.publishedAt,

        author: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async getBlogs() {
    return prisma.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async getPublishedBlogs() {
    return prisma.blog.findMany({
      where: {
        status: "published",
      },
      orderBy: {
        publishedAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async getBlogById(id: string) {
    return prisma.blog.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async getBlogBySlug(slug: string) {
    return prisma.blog.findUnique({
      where: {
        slug,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async updateBlog(
    id: string,
    data: UpdateBlogDto
  ) {
    return prisma.blog.update({
      where: {
        id,
      },
      data: {
        ...(data.title !== undefined && {
          title: data.title,
        }),

        ...(data.slug !== undefined && {
          slug: data.slug,
        }),

        ...(data.excerpt !== undefined && {
          excerpt: data.excerpt,
        }),

        ...(data.content !== undefined && {
          content: data.content,
        }),

        ...(data.featuredImage !== undefined && {
          featuredImage: data.featuredImage,
        }),

        ...(data.status !== undefined && {
          status: data.status,
        }),

        ...(data.publishedAt !== undefined && {
          publishedAt: data.publishedAt,
        }),

        ...(data.status === "published" &&
          data.publishedAt === undefined && {
            publishedAt: new Date(),
          }),
      },

      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async updateBlogImage(
    blogId: string,
    imagePath: string
  ) {
    return prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        featuredImage: imagePath,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteBlog(id: string) {
    return prisma.blog.delete({
      where: {
        id,
      },
    });
  }
}

export default new BlogService();