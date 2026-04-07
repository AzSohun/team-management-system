import { prisma } from '@/app/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { teamId: string } }
) {
    try {
        const { teamId } = params;

        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: {
                users: true,
            },
        });

        if (!team) {
            return NextResponse.json(
                { error: 'Team not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Team fetched successfully',
            team,
            members: team.users,
        });
    } catch (error) {
        console.error('Failed to fetch team:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to fetch team',
            },
            { status: 500 }
        );
    }
}
