export type User = {
    id: string; // UUID
    username: string;
    email: string;
    full_name?: string;
    display_name?: string;
    country?: string;
    phone?: string;
    avatar_url?: string;
    bio?: string;
    wallet_address?: string;
    created_at: string; // ISO string
    updated_at: string; // ISO string
};
