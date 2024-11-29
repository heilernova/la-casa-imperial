export interface ApiProfile {
    name: string;
    lastName: string;
    sex: "M" | "F";
    email: string;
    username: string;
    permissions: [];
}