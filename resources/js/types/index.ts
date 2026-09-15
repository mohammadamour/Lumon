export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    role?: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url?: string;
    created_at: string;
    updated_at: string;
}

export interface Pagination<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    ziggy?: {
        location: string;
        url: string;
        port: null | number;
        defaults: Record<string, unknown>;
        routes: Record<string, unknown>;
    };
};
