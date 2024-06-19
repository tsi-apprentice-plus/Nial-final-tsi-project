"use client";
import { IcTextField, IcButton } from "@ukic/react";
import { createPost } from "@/utils/route";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from 'next/navigation'

export default function CreatePost() {
  const router = useRouter()
  const { user } = useUser();
  function handleSubmit() {
    const title = document.getElementById("create-title") as HTMLInputElement;
    if (!title.value) return;
    if (!user) {
      router.push('/api/auth/login')
    } else {
    createPost({ content: title.value });
    title.value = "";
    }
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
