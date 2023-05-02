import { redirect } from "next/navigation";

export default async function Page() {
  redirect("/");
  return <div>Something went wrong...</div>;
}
