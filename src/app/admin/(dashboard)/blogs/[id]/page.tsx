import { notFound } from "next/navigation";
import { adminGetBlog } from "@/lib/cms";
import BlogForm from "./BlogForm";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";

  const blog = isNew ? null : await adminGetBlog(id);
  if (!isNew && !blog) notFound();

  return <BlogForm blog={blog} />;
}
