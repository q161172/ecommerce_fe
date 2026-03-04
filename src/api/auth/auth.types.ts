// ─── Auth Request DTOs ───────────────────────────────────────────────────────
export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    name: string;
    email: string;
    password: string;
}

// ─── Auth Response Types ─────────────────────────────────────────────────────
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        role: 'ADMIN' | 'CUSTOMER';
    };
    accessToken: string;
}
