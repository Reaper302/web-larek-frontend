
export interface Product {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}


export type ProductListResponse = {
    total: number;
    items: Product[]; 
};

export type ProductItemResponse = Product;

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

export interface OrderErrorResponse {
    error: string;
}

export type ApiListResponse<Type> = {
    total: number;
    items: Type[];
};

export interface CartItem {
    product: Product;
    quantity: number; 
}

export interface ProductCardProps {
    product: Product;
    onClick: () => void;
}

export interface CartProps {
    items: CartItem[];
    onCheckout: () => void;
}

export interface CheckoutFormData {
    email: string;
    phone: string;
    address: string;
}

export interface CheckoutProps {
    formData: CheckoutFormData;
    onSubmit: (order: Order) => void;
}