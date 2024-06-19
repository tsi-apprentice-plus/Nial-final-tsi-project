import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import Post from "@/schemas/postsSchema";

export const POST = withApiAuthRequired(async function createComment(
  req: NextRequest,
  { params }: { params?: Record<string, string | string[]> },
) {
  try {
    if (params === undefined) {
      return NextResponse.json({ message: "Missing id" }, { status: 400 });
    }
    const { id } = params;
    const res = new NextResponse();
    const session = await getSession(req, res);
    const user = session?.user;
    const username = user?.nickname;
    const jsonreq = await req.json();
    const { content } = jsonreq;
    const post = await Post.findOne({ _id: id });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const timestamp = new Date();
    post.comments.push({ username, content, timestamp });
    const likedPost = await post.save();
    return NextResponse.json(likedPost);
  } catch (error) {
    console.error(error);
    return  NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
});

export const DELETE = withApiAuthRequired(async function unlike(
  req: NextRequest,
  { params }: { params?: Record<string, string | string[]> },
) {
  try {
    if (params === undefined) {
      return NextResponse.json({ message: "Missing id" }, { status: 400 });
    }
    const { id } = params;
    const res = new NextResponse();
    const session = await getSession(req, res);
    const user = session?.user;
    const username = user?.nickname;
    const post = await Post.findOne({ _id: id });
    if (!post) {
      return  NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    post.likes = post.likes.filter(
      (like: { username: string }) => like.username !== username,
    );
    const unlikedPost = await post.save();
    return NextResponse.json(unlikedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
});
