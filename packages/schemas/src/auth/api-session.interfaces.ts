export interface ApiSession {
    username: string,
    name: string,
    lastName: string,
    role: "admin" | "collaborator" | "customer",
    token: string,
    pin: string | null,
    permissions: string[],
}