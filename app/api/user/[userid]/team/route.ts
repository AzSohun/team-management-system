import { checkUserPermission, getCurrentUser, } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";



export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ userId: string }> }) {

    try {

        const { userId } = await context.params;

        const currentUser = await getCurrentUser();

        if (!currentUser || !checkUserPermission(currentUser, Role.ADMIN)) {
            return NextResponse.json(
                { error: "You're not authorized to assign user's role." },
                { status: 401 }
            );
        };

        // To assign a DEVELOPER into a team we need get the teamId from client-side,
        const { teamId } = await request.json();

        if (teamId) {
            const team = await prisma.team.findUnique({
                where: { id: teamId },
            });

            if (!team) {
                return NextResponse.json(
                    { error: "Team not found." },
                    { status: 404 }
                );
            };
        };


        // Updating the DEVELOPER
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { teamId: teamId },
            include: { team: true }
        });


        return NextResponse.json(
            {
                user: updatedUser,
                message: "Team assigned successfully."

            },
        );

    } catch (error) {

        console.error("Team assignment error: ", error);

        if (error instanceof Error && error.message.includes("Record to update not found")) {
            return NextResponse.json(
                { error: "Internal Server Error. Something went wrong." },
                { status: 500 }
            );
        };
    };
};