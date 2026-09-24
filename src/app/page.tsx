import { redirect } from "next/navigation";

import { getAuthUser } from "@/lib/auth";

export default async function Home() {
  const user = await getAuthUser();

  if (user) {
    //if authenticated then redirect to product page as landing page
    redirect("/products");
  }

  //if not authenticated then redirect to login page
  redirect("/login");
}