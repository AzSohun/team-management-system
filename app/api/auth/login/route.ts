import { generateToken, verifyPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    try {

        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                {
                    error: "Invalid email or password"
                },
                { status: 400 }
            )
        }

        const userFromDB = await prisma.user.findUnique({
            where: { email },
            include: {
                team: true
            }
        })

        if (!userFromDB) {
            return NextResponse.json(
                {
                    error: "DEVELOPER does not exist."
                },
                {
                    status: 409
                }
            );
        };

        const isPasswordMatched = await verifyPassword(password, userFromDB.password);

        if (!isPasswordMatched) {
            return NextResponse.json(
                {
                    error: "Invalid password."
                },
                {
                    status: 401
                }
            )
        };

        const token = generateToken(userFromDB.id);

        const resposne = await NextResponse.json({

            message: "DEVELOPER logged in successfully.",

            DEVELOPER: {
                id: userFromDB.id,
                name: userFromDB.name,
                email: userFromDB.name,
                role: userFromDB.role,
                teamId: userFromDB.teamId,
                team: userFromDB.team,
                token
            }
        });


        resposne.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7
        });


        return resposne;

    } catch (error) {

        console.error("Unable to logged in DEVELOPER", error)

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Internal Server Error."
            },
            {
                status: 500
            }
        )
    }
}