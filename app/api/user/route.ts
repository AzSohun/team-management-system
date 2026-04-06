import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Prisma, Role } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest) {

    try {

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    error: "You are not authorized to access the users!"
                },
                {
                    status: 401
                }
            )
        };

        const searchParams = request.nextUrl.searchParams;

        const name = searchParams.get("name");
        const teamId = searchParams.get("teamId");
        const role = searchParams.get("role");

        const where: Prisma.UserWhereInput = {};

        // Admin can see all
        if (user.role === Role.ADMIN) {

        }
        // Maneager can see only all team members.
        else if (user.role === Role.MANAGER) {
            where.OR = [{ teamId: user.teamId }, { role: Role.USER }]
        }
        // User only can see same user 
        else {
            where.teamId = user.teamId;
            where.role = { not: Role.ADMIN }
        };


        // Filter the teamId and role
        if (name) {
            where.name = name;
        }
        if (teamId) {
            where.teamId = teamId;
        }
        if (role) {
            where.role = role as Role;
        }


        const users = await prisma.user.findMany({
            where,
            select: {
                name: true,
                email: true,
                role: true,
                team: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdAt: true
            },

            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json({ users });

    } catch (error) {

        console.error("Error: ", error);

        return NextResponse.json(
            {
                error: "Internal server error!"
            },
            { status: 500 }
        )
    }
}

