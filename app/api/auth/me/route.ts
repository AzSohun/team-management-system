import { getCurrentUser } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest) {

    try {

        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                {
                    error: "You are not authenticated."
                },
                {
                    status: 401
                }
            )
        }

        return NextResponse.json(currentUser);

    } catch (error) {

        console.error("Error: ", error);

        return NextResponse.json(
            {
                error: "Invalid Server Error"
            },
            {
                status: 500
            }
        )

    }

}








