import { redirect } from "next/navigation";
import { EmptyShelf } from "@/components/empty-shelf";
import { getShelf } from "@/lib/inventory";

export default async function Home() {
    const works = await getShelf("available");
    const first = works[0];
    if (!first) return <EmptyShelf shelf="available" />;
    redirect(first.href);
}
