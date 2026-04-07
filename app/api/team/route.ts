import { prisma } from '@/app/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Generate unique team code
function generateTeamCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function GET(request: NextRequest) {
    try {
        const teams = await prisma.team.findMany({
            include: {
                users: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({
            message: 'Teams fetched successfully',
            teams,
        });
    } catch (error) {
        console.error('Failed to fetch teams:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to fetch teams',
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, description } = await request.json();

        if (!name || name.trim() === '') {
            return NextResponse.json(
                { error: 'Team name is required' },
                { status: 400 }
            );
        }

        // Check if team name already exists
        const existingTeam = await prisma.team.findUnique({
            where: { name },
        });

        if (existingTeam) {
            return NextResponse.json(
                { error: 'Team name already exists' },
                { status: 409 }
            );
        }

        // Generate unique code
        let code = generateTeamCode();
        let codeExists = await prisma.team.findUnique({
            where: { code },
        });

        while (codeExists) {
            code = generateTeamCode();
            codeExists = await prisma.team.findUnique({
                where: { code },
            });
        }

        const team = await prisma.team.create({
            data: {
                name,
                description: description || '',
                code,
            },
            include: {
                users: true,
            },
        });

        return NextResponse.json(
            {
                message: 'Team created successfully',
                team,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Failed to create team:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to create team',
            },
            { status: 500 }
        );
    }
}
