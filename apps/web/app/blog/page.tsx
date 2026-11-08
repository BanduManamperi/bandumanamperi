import { getAllBlogPosts } from "@/lib/data/blog";
import { DocumentSheet } from "@/components/sheet/document-sheet";
import { Journal } from "@/components/blog/journal";

export default async function BlogPage() {
    const posts = await getAllBlogPosts();
    return (
        <DocumentSheet>
            <Journal posts={posts} />
        </DocumentSheet>
    );
}
