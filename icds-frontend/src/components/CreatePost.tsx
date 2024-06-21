"use client";
import { IcTextField, IcButton } from "@ukic/react";
import { createPost } from "@/utils/route";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function CreatePost() {
  const router = useRouter();
  const { user } = useUser();
  const [imageBase64, setImageBase64] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setIsImageUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
        setIsImageUploading(false);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = document.getElementById("create-title") as HTMLInputElement;
    if (!title.value) return;
    if (!user) {
      router.push('/api/auth/login');
    } else {
      createPost({ content: title.value, image: imageBase64 });
      title.value = "";
      setImageBase64("");
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center">
        <form onSubmit={handleSubmit}>
          <IcTextField
            rows={3}
            label="Create Post"
            placeholder="Please enter…"
            id="create-title"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <IcButton 
            type="submit" 
            disabled={isImageUploading}
          >
            {isImageUploading ? "Uploading..." : "Submit"}
          </IcButton>
        </form>
      </div>
    </div>
  );
}
