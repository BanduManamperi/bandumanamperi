import { permanentRedirect } from "next/navigation";

// The available and sold shelves are now one catalogue.
export default function Page() {
    permanentRedirect("/paintings-and-drawings");
}
