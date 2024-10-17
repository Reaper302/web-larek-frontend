
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

export interface IApiModel {
    cdn: string;
    items: ProductItem[];
    fetchProductCards(): Promise<ProductItem[]>;
    submitOrder(order: Order): Promise<OrderSuccessResponse>;
  }

  export interface IDataModel {
    productCards: ProductItem[];
    selectedCard: ProductItem | null;
    setPreview(item: ProductItem): void;
  }

  export interface IBasketModel {
    basketProducts: ProductItem[];
    getCount(): number;
    getTotalSum(): number;
    addProduct(item: ProductItem): void;
    removeProduct(item: ProductItem): void;
    clearBasket(): void;
  }
  
export interface IFormModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  updateAddress(field: string, value: string): void;
  validateOrder(): boolean;
  updateContactInfo(field: string, value: string): void;
  validateContactInfo(): boolean;
  createOrder(): Order;
}

export interface IModal {
    open(): void;
    close(): void;
    render(): HTMLElement;
    setContent(content: HTMLElement | string): void;
    setLocked(isLocked: boolean): void;
  }

  export interface IOrderContacts {
    formElement: HTMLFormElement;
    inputs: HTMLInputElement[];
    submitButton: HTMLButtonElement;
    errorContainer: HTMLElement;
    render(): HTMLElement;
  }

  export interface IOrder {
    formElement: HTMLFormElement;
    paymentButtons: HTMLButtonElement[];
    paymentMethod: string;
    errorContainer: HTMLElement;
    render(): HTMLElement;
  }

  export interface IOrderSuccess {
    successElement: HTMLElement;
    descriptionElement: HTMLElement;
    closeButton: HTMLButtonElement;
    render(total: number): HTMLElement;
  }

export interface CardConfig {
    onClick?: (event: MouseEvent) => void;
  }