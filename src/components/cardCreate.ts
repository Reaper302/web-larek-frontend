import { ProductItem , CardConfig} from "../types";
import { IEvents} from "./base/events";


export class Card {
  protected cardElement: HTMLElement;
  protected categoryElement: HTMLElement;
  protected titleElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected priceElement: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents, config?: CardConfig) {
    this.cardElement = this.initializeCardElements(template);

    if (config?.onClick) {
      this.cardElement.addEventListener('click', config.onClick);
    }
  }

  // инцииализация элементов карточки
  protected initializeCardElements(template: HTMLTemplateElement): HTMLElement {
    const cardElement = template.content.querySelector('.card')!.cloneNode(true) as HTMLElement;
    this.categoryElement = cardElement.querySelector('.card__category')!;
    this.titleElement = cardElement.querySelector('.card__title')!;
    this.imageElement = cardElement.querySelector('.card__image')!;
    this.priceElement = cardElement.querySelector('.card__price')!;
    return cardElement;
  }

  // текст
  protected updateTextContent(element: HTMLElement, content: string): void {
    if (element) {
      element.textContent = content;
    }
  }

  // цена
  protected formatPrice(price: number | null): string {
    return price !== null ? `${price} синапсов` : 'Бесценно';
  }

  // категория
  set category(value: string) {
    this.updateTextContent(this.categoryElement, value);
  }

  // заголовок
  set title(value: string) {
    this.updateTextContent(this.titleElement, value);
  }

  // img
  set image(value: string) {
    this.imageElement.src = value;
    this.imageElement.alt = value;
  }

  // price
  set price(value: number | null) {
    this.updateTextContent(this.priceElement, this.formatPrice(value));
  }

  // рендер карточки
  render(data: ProductItem): HTMLElement {
    this.category = data.category;
    this.title = data.title;
    this.image = data.image;
    this.price = data.price;
    return this.cardElement;
  }
}

export class CardPreview extends Card {
  private descriptionElement: HTMLElement;
  private actionButton: HTMLElement;

  constructor(template: HTMLTemplateElement, events: IEvents, config?: CardConfig) {
    super(template, events, config);
   
    this.descriptionElement = this.cardElement.querySelector('.card__text')!;
    this.actionButton = this.cardElement.querySelector('.card__button')!;

    this.actionButton.addEventListener('click', () => {
      this.events.emit('card:addBasket');
    });
  }

  // описание
  set description(value: string) {
    this.updateTextContent(this.descriptionElement, value);
  }

  private updateButtonText(data: ProductItem): void {
    if (data.price) {
      this.actionButton.textContent = 'Купить';
    } else {
      this.actionButton.setAttribute('disabled', 'true');
      this.actionButton.textContent = 'Не продается';
    }
  }

  render(data: ProductItem): HTMLElement {
    const card = super.render(data);
    this.description = data.description;
    this.updateButtonText(data);
    return card;
  }
}
