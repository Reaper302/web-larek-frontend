
export interface ProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface Order {
    payment: 'online' | 'offline';
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface OrderSuccessResponse {
    id: string;
    total: number;   
}
