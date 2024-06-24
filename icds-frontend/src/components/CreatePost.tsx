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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-4">
            <label htmlFor="create-title" className="block text-sm font-medium text-gray-700">Create Post</label>
            <textarea
              id="create-title"
              rows={3}
              placeholder="Please enter…"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
          />
          <IcButton 
            type="submit" 
            disabled={isImageUploading}
            className="w-full text-white py-2 px-4"
          >
            {isImageUploading ? "Uploading..." : "Submit"}
          </IcButton>
        </form>
      </div>
    </div>
  );
}
