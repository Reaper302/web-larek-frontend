import { ApiListResponse, Api } from './base/api';
import { ProductItem, Order, OrderSuccessResponse, IBasketModel, IDataModel, IApiModel } from '../types';
import { IEvents } from "./base/events";

export class ApiModel extends Api implements IApiModel {
  public cdn: string;
  public items: ProductItem[] = [];

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  public async fetchProductCards(): Promise<ProductItem[]> {
    const data = await this.get('/product') as ApiListResponse<ProductItem>;
    return data.items.map(item => ({
      ...item,
      image: this.cdn + item.image,
    }));
  }

  public async submitOrder(order: Order): Promise<OrderSuccessResponse> {
    return await this.post('/order', order) as OrderSuccessResponse;
  }
}


export class DataModel implements IDataModel {
  private _productCards: ProductItem[] = [];
  public selectedCard: ProductItem | null = null;

  constructor(private events: IEvents) {}

  public get productCards(): ProductItem[] {
    return this._productCards.length ? this._productCards : [];
  }

  public set productCards(data: ProductItem[]) {
    if (Array.isArray(data) && data.length) {
      this._productCards = data;
      this.notifyProductsReceived();
    }
  }

  public setPreview(item: ProductItem): void {
    if (item && this._productCards.includes(item)) {
      this.selectedCard = item;
      this.events.emit('modalCard:open', item);
    }
  }

  private notifyProductsReceived(): void {
    this.events.emit('productCards:receive');
  }
}

export class BasketModel implements IBasketModel {
  private _basketProducts: ProductItem[] = [];

  public get basketProducts(): ProductItem[] {
    return [...this._basketProducts];
  }

  public getCount(): number {
    return this._basketProducts.length;
  }

  public getTotalSum(): number {
    return this._basketProducts.length 
      ? this._basketProducts.reduce((sum, item) => sum + (item.price || 0), 0)
      : 0;
  }

  public addProduct(item: ProductItem): void {
    if (!this._basketProducts.includes(item)) {
      this._basketProducts = [...this._basketProducts, item];
    }
  }

  public removeProduct(item: ProductItem): void {
    this._basketProducts = this._basketProducts.filter(product => product !== item);
  }

  public clearBasket(): void {
    if (this._basketProducts.length) {
      this._basketProducts = [];
    }
  }
}