import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


export const adapter = new PrismaPg(
    {
        connectionString: process.env.DATABASE_URL
    }
)


export const prisma = new PrismaClient({ adapter });


export async function checkConnectionDatabase(): Promise<boolean> {

    try {

        await prisma.$queryRaw`SELECT 1`;
        return true

    } catch (error) {
        console.error(`Database connection failed ${error}`);
        return false;
    }
}



