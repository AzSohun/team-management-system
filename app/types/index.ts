export enum Role {
    ADMIN = "ADMIN",
    LEADER = "LEADER",
    DEVELOPER = "DEVELOPER",
    INTERN = "INTERN"
}


export interface DEVELOPER {
    id: string,
    name: string,
    email: string,
    password: string,
    role: Role,
    teamId?: string,
    team?: Team,
    createdAt: Date,
    updatedAt: Date
}


export interface Team {
    id: string,
    name: string,
    description: string | null,
    code: string,
    members: DEVELOPER[],
    createdAt: Date,
    updatedAt: Date
}