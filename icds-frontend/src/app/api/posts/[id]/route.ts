import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Post from "@/schemas/postsSchema";

export async function GET(
  req: NextRequest,
  params: { params: { id: string } },
) {
  const { id } = params.params;

  try {
    const post = await Post.findOne({ _id: id });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const DELETE = withApiAuthRequired(async function deletePost(
  req: NextRequest,
  { params }: { params?: Record<string, string | string[]> },
) {
  if (params === undefined) {
    return NextResponse.json({ message: "Missing id" }, { status: 400 });
  }
  const { id } = params;
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    const user = session?.user;
    const username = user?.nickname;
    if (!username) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const post = await Post.findOne({ _id: id });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    if (post.username === username) {
      const deletedPost = await Post.findOneAndDelete({ _id: id });
      return NextResponse.json(deletedPost);
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
});
