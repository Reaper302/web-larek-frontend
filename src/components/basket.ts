import { createElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { ProductItem } from "../types"; 

export class Basket {
  private basket: HTMLElement;
  private modalTitle: HTMLElement;
  private basketList: HTMLElement;
  private basketButton: HTMLButtonElement;
  private basketPrice: HTMLElement;
  private headerBasketButton: HTMLButtonElement;
  private headerBasket: HTMLElement;

  constructor(template: HTMLTemplateElement, private events: IEvents) {
    this.basket = template.content.querySelector('.basket')!.cloneNode(true) as HTMLElement;
    this.modalTitle = this.basket.querySelector('.modal__title')!;
    this.basketList = this.basket.querySelector('.basket__list')!;
    this.basketButton = this.basket.querySelector('.basket__button')!;
    this.basketPrice = this.basket.querySelector('.basket__price')!;
    this.headerBasketButton = document.querySelector('.header__basket')!;
    this.headerBasket = document.querySelector('.header__basket-counter')!;

    this.basketButton.addEventListener('click', () => this.events.emit('order:open'));
    this.headerBasketButton.addEventListener('click', () => this.events.emit('basket:open'));

    this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.basketList.replaceChildren(...items);
      this.basketButton.removeAttribute('disabled');
    } else {
      this.basketButton.setAttribute('disabled', 'disabled');
      this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
    }
  }


  renderHeaderBasketCounter(value: number) {
    this.headerBasket.textContent = String(value);
  }


  renderSumAllProducts(sumAll: number) {
    this.basketPrice.textContent = `${sumAll} синапсов`;
  }

  // рендер корзины
  render() {
    this.modalTitle.textContent = 'Корзина';
    return this.basket;
  }
}

export class BasketItem {
  private basketItem: HTMLElement;
  private title: HTMLElement;
  private price: HTMLElement;
  private buttonDelete: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, private events: IEvents, onDeleteClick?: () => void) {
    this.basketItem = template.content.querySelector('.basket__item')!.cloneNode(true) as HTMLElement;
    this.title = this.basketItem.querySelector('.card__title')!;
    this.price = this.basketItem.querySelector('.card__price')!;
    this.buttonDelete = this.basketItem.querySelector('.basket__item-delete')!;

    if (onDeleteClick) {
      this.buttonDelete.addEventListener('click', onDeleteClick);
    }
  }

  private formatPrice(value: number | null): string {
    return value === null ? 'Бесценно' : `${value} синапсов`;
  }

  // рендер элемента корзины
  render(data: ProductItem, index: number): HTMLElement {
    this.basketItem.querySelector('.basket__item-index')!.textContent = String(index);
    this.title.textContent = data.title;
    this.price.textContent = this.formatPrice(data.price);
    return this.basketItem;
  }
}
