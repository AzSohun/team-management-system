import { checkUserPermission, getCurrentUser, } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";



export async function PATCH(request: NextRequest, context: { params: Promise<{ userId: string }> }) {


    try {

        const { userId } = await context.params;
        const currentUser = await getCurrentUser();

        if (!currentUser || !checkUserPermission(currentUser, Role.ADMIN)) {
            return NextResponse.json(
                { error: "You are not authorized to assign team." },
                { status: 401 }
            )
        };


        // Prevent DEVELOPERs from changing their own role
        if (userId === currentUser.id) {
            return NextResponse.json(
                { error: "Ypu cannot change your own role." },
                { status: 401 }
            );
        };

        const { role } = await request.json();

        // Validate role
        const validateRoles = [Role.DEVELOPER, Role.LEADER];

        if (!validateRoles.includes(role)) {
            return NextResponse.json(
                { error: "Invalid role or you cannot have more than one Admin role." },
                { status: 404 }
            )
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
            include: { team: true }
        });


        return NextResponse.json({
            user: updatedUser,
            message: `DEVELOPER role updated to ${role} succefully.`
        });


    } catch (error) {

        console.error("Role assignment error: ", error);

        if (error instanceof Error && error.message.includes("Record to update not found.")) {
            return NextResponse.json(
                { error: "Internal server error." },
                { status: 500 }
            );
        };
    };
};