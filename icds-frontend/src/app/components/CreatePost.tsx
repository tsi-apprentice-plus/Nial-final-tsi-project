"use client";
import { IcTextField, IcButton } from "@ukic/react";
import { createPost } from "@/utils/route";

export default function CreatePost() {
  function handleSubmit() {
    const title = document.getElementById("create-title") as HTMLInputElement;
    console.log(title.value);
    createPost({ content: title.value });
  }
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center">
        <form>
          <IcTextField
            rows={3}
            label="Create Post"
            placeholder="Please enter…"
            id="create-title"
          />
          <IcButton onClick={handleSubmit}>Submit</IcButton>
        </form>
      </div>
    </div>
  );
}
