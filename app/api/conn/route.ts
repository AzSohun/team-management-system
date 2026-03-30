import { checkConnectionDatabase } from "@/app/lib/db";
import { NextResponse } from "next/server";



export async function GET() {
    const isConnected = await checkConnectionDatabase();

    if (!isConnected) {
        return NextResponse.json(
            {
                status: "error",
                message: "Database connection failed"
            },
            { status: 500 }
        )
    }

    return NextResponse.json(
        {
            status: "success",
            message: "Database Connected Successfully"
        },
        { status: 200 }
    )
}
