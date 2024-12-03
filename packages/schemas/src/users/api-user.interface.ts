export interface ApiUser {
    id: string;
    createdAt: string;
    updatedAt: string;
    role: string;
    status: string;
    username: string;
    email: string;
    name: string;
    lastName: string;
    sex: string | null;
    cellphone: string;
    permissions: string[];
}