"use client";
import { createPost } from "@/utils/route";

function handlePost() {
  const title = document.getElementById("title") as HTMLInputElement;
  createPost({ content: title.value });
  title.value = "";
}
export default function CreatePost() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-2xl font-bold text-gray-800 my-4">Create Post</div>
      <div className="flex justify-center">
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handlePost}
        >
          Create Post
        </button>
      </div>
    </div>
  );
}
