export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    role?: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    product_count?: number;
}

export interface Seller {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number | string;
    stock: number;
    is_active: boolean;
    image_url?: string;
    seller_id?: number;
    seller?: Seller;
    category?: Category;
    average_rating: number;
    review_count: number;
    created_at: string;
    updated_at?: string;
}

export interface Review {
    id: number;
    rating: number;
    comment: string | null;
    user: {
        id: number;
        name: string;
    };
    created_at: string;
    is_owner: boolean;
}

export interface CartItem {
    id?: number; // DB ID if authenticated, undefined if guest
    product: Product;
    quantity: number;
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

