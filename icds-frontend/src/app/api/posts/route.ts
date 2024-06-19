import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { validationResult } from "express-validator";
import Post from "@/schemas/postsSchema";
import { GetValidation, PostValidation } from "@/utils/postValidations";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

export const GET = async function GetPosts(req: NextRequest) {
  let posts;
  const username = req.nextUrl.searchParams.get("username") as string;
  const search = req.nextUrl.searchParams.get("search") as string;
  const limit = req.nextUrl.searchParams.get("limit") as string;
  const page = req.nextUrl.searchParams.get("page") as string;

  try {
    if (limit && page) {
      const limitNum = parseInt(limit, 10);
      const pageNum = parseInt(page, 10);

      if (search) {
        posts = await Post.find({
          content: { $regex: search, $options: "i" },
        })
          .limit(limitNum)
          .skip(limitNum * (pageNum - 1));
      } else {
        posts = await Post.find()
          .limit(limitNum)
          .skip(limitNum * (pageNum - 1));
      }
    } else if (username) {
      posts = await Post.find({ username });
    } else if (search) {
      posts = await Post.find({
        content: { $regex: search, $options: "i" },
      });
    } else {
      posts = await Post.find();
    }

    if (!posts || posts.length === 0) {
      return NextResponse.json({ message: "Posts not found" }, { status: 404 });
    }
    return NextResponse.json(posts); // Ensure this line explicitly returns
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    ); // Ensure this line explicitly returns
  }
};

export const POST = withApiAuthRequired(async function CreatePosts(
  req: NextRequest,
) {
  try {
    const res = new NextResponse();
    const session = await getSession(req, res);
    const user = session?.user;
    const username = user?.nickname;
    const jsonreq = await req.json();
    const { content } = jsonreq;

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const errorsPost = validationResult(req);
    if (!errorsPost.isEmpty()) {
      return NextResponse.json({ errors: errorsPost.array() }, { status: 400 });
    }

    const timestamp = new Date();
    const post = new Post({ content, username, timestamp });
    const createdPost = await post.save();
    return NextResponse.json(createdPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
});
