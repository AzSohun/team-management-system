import { NextResponse } from "next/server";


export async function POST() {

    const resposne = await NextResponse.json(
        {
            message: "DEVELOPER logged out successfully!"
        },
        { status: 200 }
    );

    resposne.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0
    });

    return resposne;
};