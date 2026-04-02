import bcrypt from "bcryptjs";
import { Role, User } from "../types";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./db";


const JWT_SECRET = process.env.JWT_SECRET as string;
const SALT = process.env.BCRYPT_SALT_ROUND as string;

export const hashedPasword = async (password: string): Promise<string> => {

    return await bcrypt.hash(password, parseInt(SALT));

};


export const verifyPassword = async (password: string, hashedPasword: string): Promise<boolean> => {

    return await bcrypt.compare(password, hashedPasword);

};


export const generateToken = (userId: string): string => {

    return jwt.sign(userId, JWT_SECRET, { expiresIn: "7d" });

};


export const verifyToken = (token: string): { userId: string } => {

    return jwt.verify(token, JWT_SECRET) as { userId: string };

};


export const getUserFromDB = async (): Promise<User | null> => {

    try {

        const cookieStore = await cookies();

        const token = cookieStore.get("token")?.value;

        if (!token) return null;

        const decodedToken = verifyToken(token);

        const userFromDB = await prisma.user.findUnique({
            where: { id: decodedToken.userId }
        });

        if (!userFromDB) return null;

        const { password, ...user } = userFromDB;

        return user as User;

    } catch (error) {

        console.error("Error: ", error);

        return null

    }

}


export const checkUserPermission = (user: User, role: Role): boolean => {

    const roleHierarchy = {
        [Role.GUEST]: 0,
        [Role.USER]: 1,
        [Role.MANAGER]: 2,
        [Role.ADMIN]: 3
    }

    return roleHierarchy[user.role] >= roleHierarchy[role];

}