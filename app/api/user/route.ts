import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Prisma, Role } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest) {

    try {

        const DEVELOPER = await getCurrentUser();

        if (!DEVELOPER) {
            return NextResponse.json(
                {
                    error: "You are not authorized to access the DEVELOPERs!"
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
        if (DEVELOPER.role === Role.ADMIN) {

        }
        // Maneager can see only all team members.
        else if (DEVELOPER.role === Role.LEADER) {
            where.OR = [{ teamId: DEVELOPER.teamId }, { role: Role.DEVELOPER }]
        }
        // DEVELOPER only can see same DEVELOPER 
        else {
            where.teamId = DEVELOPER.teamId;
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






