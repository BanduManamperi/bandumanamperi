import { redirect } from "next/navigation";
import { EmptyShelf } from "@/components/empty-shelf";
import { getShelf } from "@/lib/inventory";

export default async function SoldPage() {
    const works = await getShelf("sold");
    const first = works[0];
    if (!first) return <EmptyShelf shelf="sold" />;
    redirect(first.href);
}
