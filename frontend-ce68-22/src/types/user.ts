export interface UserProfileDisplay {
    firstname: string;
    lastname: string;
    email: string;
    picture: string | null;
}

export interface UserProfileEdit {
    firstname: string;
    lastname: string;
}