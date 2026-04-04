import { generateToken, hashedPasword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    try {

        const { name, email, password, teamCode } = await request.json();

        if (!name || !email || !password) {

            return NextResponse.json(
                {
                    error: "Name, email and password are must be required"
                },
                {
                    status: 400
                }
            )
        }

        const isUserExists = await prisma.user.findUnique({
            where: { email }
        })

        if (isUserExists) {
            return NextResponse.json(
                {
                    error: "This email is already exists."
                },
                {
                    status: 409
                }
            )
        };

        let teamId: string | undefined;

        if (teamCode) {
            const team = await prisma.team.findUnique({
                where: { code: teamCode }
            });

            if (!team) {
                return NextResponse.json(
                    {
                        error: "Team does not exists."
                    },
                    {
                        status: 400
                    }
                )
            };

            teamId = team.id;

        };

        const hashedPassword = await hashedPasword(password);

        const userCount = await prisma.user.count();

        const role = userCount === 0 ? Role.ADMIN : Role.USER;

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                teamId
            },

            include: {
                team: true
            }
        });

        const token = generateToken(user.id);


        const response = NextResponse.json({

            message: "User registration successful.",

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                teamId: user.teamId,
                team: user.team,
                token
            }
        });


        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7
        });

        return response;

    } catch (error) {

        console.error("Registration Failed:", error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Internal Server Error."
            },
            { status: 500 }
        )
    }
}