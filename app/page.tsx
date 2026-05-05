import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/stores/f0000000-0000-4000-8000-000000000001/products");
}
