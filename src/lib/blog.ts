import { doc, getDoc } from "firebase/firestore"
import { db } from "./firebase"


export async function getBlogPostBySlug(slug: string) {
  const ref = doc(db, "blogPosts", slug);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data();

  return {
    id: snap.id,
    title: data.title,
    publishDate: data.publishDate,
    content: data.content,
    imageUrl: data.imageUrl || "", 
  };
}