import { hashedPasword } from "@/app/lib/auth";
import { PrismaClient, Role } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { error } from "console";
import 'dotenv/config';



const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
})


const prisma = new PrismaClient({ adapter });


async function main() {

    console.log("Database is seeding...")


    const teams = await Promise.all([
        prisma.team.create({
            data: {
                name: "Codex",
                description: "Frontend Development with React/Nextjs",
                code: "codeX-51"
            }
        }),

        prisma.team.create({
            data: {
                name: "Express Coder",
                description: "Handle Backend using Node",
                code: "ec-27"
            }
        }),

        prisma.team.create({
            data: {
                name: "Dot Coder",
                description: "Dotnet developer. Also handle forntend with Angular.",
                code: "dot-13"
            }
        }),

        prisma.team.create({
            data: {
                name: "Dev Titan",
                description: "Handle Testing, DevOps and Deployment Part.",
                code: "titan-7"
            }
        }),
    ]);


    const users = [
        {
            name: "Michael Thompson",
            email: "michael.thompson@company.com",
            team: teams[0],
            role: Role.MANAGER
        },
        {
            name: "Emily Carter",
            email: "emily.carter@company.com",
            team: teams[0],
            role: Role.USER
        },
        {
            name: "Daniel Rodriguez",
            email: "daniel.rodriguez@company.com",
            team: teams[1],
            role: Role.MANAGER
        },
        {
            name: "Sophia Martinez",
            email: "sophia.martinez@company.com",
            team: teams[1],
            role: Role.USER
        },
        {
            name: "James Anderson",
            email: "james.anderson@company.com",
            team: teams[2],
            role: Role.USER
        },
        {
            name: "Olivia Wilson",
            email: "olivia.wilson@company.com",
            team: teams[0],
            role: Role.USER
        },
        {
            name: "William Brown",
            email: "william.brown@company.com",
            team: teams[2],
            role: Role.MANAGER
        },
        {
            name: "Ava Taylor",
            email: "ava.taylor@company.com",
            team: teams[3],
            role: Role.USER
        },
        {
            name: "Benjamin Clark",
            email: "benjamin.clark@company.com",
            team: teams[3],
            role: Role.USER
        },
        {
            name: "Isabella Lewis",
            email: "isabella.lewis@company.com",
            team: teams[3],
            role: Role.MANAGER
        }
    ]


    for (const user of users) {
        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: await hashedPasword("123456"),
                role: user.role,
                teamId: user.team.id
            }
        })
    }

    console.log("Database seeded successfully.");

}


main().catch(
    (e) => {
        console.error("Seeding failed: ", error);
        process.exit(1)
    }
).finally(async () => {
    await prisma.$disconnect()
})