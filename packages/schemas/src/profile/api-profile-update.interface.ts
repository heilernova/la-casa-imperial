export interface ApiProfileUpdate {
    name?: string;
    lastName?: string;
    sex?: "M" | "F" | null;
    username?: string;
    email?: string;
}