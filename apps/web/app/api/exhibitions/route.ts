import { getExhibitions } from "@/lib/actions/exhibitions"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const exhibitions = await getExhibitions()
        return NextResponse.json(exhibitions)
    } catch (error) {
        console.error("Error fetching exhibitions:", error)
        return NextResponse.json(
            { error: "Failed to fetch exhibitions" },
            { status: 500 }
        )
    }
}

