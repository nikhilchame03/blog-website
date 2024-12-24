import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@nikhil_chame/medium-common-file";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const header = c.req.header("Authorization") || "";

  const token = header.split(" ")[1];

  const user = await verify(token, c.env.JWT_SECRET);

  if (user) {
    //@ts-ignore
    c.set("userId", user.id);
    await next();
  } else {
    c.status(403);
    return c.json({
      error: "unauthorised",
    });
  }
});

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const { success } = createBlogInput.safeParse(body);
  
    if (!success) {
      c.status(411);
      return c.json({
        message: "Input not correct",
      });
    }



  //@ts-ignore
  const authorIds = c.get("userId");

  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: Number(authorIds),
    },
  });

  return c.json({
    id: blog.id,
  });
});

blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();


  const { success } = updateBlogInput.safeParse(body);
  
    if (!success) {
      c.status(411);
      return c.json({
        message: "Input not correct",
      });
    }

  const blog = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return c.json({
    id: blog.id,
  });
});


blogRouter.get("/bulk", async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    try {
      const blog = await prisma.post.findMany();
  
      return c.json({
        blog,
      });
    } catch (e) {
      c.status(411);
  
      return c.json({
        msg: "error while fetching all blogs",
      });
    }
  
    
  });

blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = await c.req.param("id");

  try {
    const blog = await prisma.post.findFirst({
      where: {
        id: Number(id),
      },
    });

    return c.json({
      blog,
    });
  } catch (e) {
    c.status(411);

    return c.json({
      msg: "error while fetching the blogs",
    });
  }
});


