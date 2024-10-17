import { IEvents } from "./base/events";
import {IOrderContacts, IOrder} from '../types'

export class OrderContacts implements IOrderContacts {
  formElement: HTMLFormElement;
  inputs: HTMLInputElement[];
  submitButton: HTMLButtonElement;
  errorContainer: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.formElement = this._cloneTemplate(template);
    this.inputs = this._getElements<HTMLInputElement>(this.formElement, '.form__input');
    this.submitButton = this._getElement<HTMLButtonElement>('.button', this.formElement);
    this.errorContainer = this._getElement<HTMLElement>('.form__errors', this.formElement);

    this._addInputListeners();
    this._addSubmitListener();
  }

  private _cloneTemplate(template: HTMLTemplateElement): HTMLFormElement {
    const form = template.content.querySelector('.form')?.cloneNode(true) as HTMLFormElement;
    if (!form) throw new Error("4");
    return form;
  }

  private _getElements<T extends HTMLElement>(parent: HTMLElement, selector: string): T[] {
    return Array.from(parent.querySelectorAll(selector));
  }

  private _getElement<T extends HTMLElement>(selector: string, parent: HTMLElement): T {
    const element = parent.querySelector<T>(selector);
    if (!element) throw new Error(`5`);
    return element;
  }

  private _addInputListeners(): void {
    this.inputs.forEach(input => {
      input.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        this.events.emit('contacts:changeInput', { field: target.name, value: target.value });
      });
    });
  }

  private _addSubmitListener(): void {
    this.formElement.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('success:open');
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  render(): HTMLElement {
    return this.formElement;
  }
}

// класс формы заказа
export class Order implements IOrder {
  formElement: HTMLFormElement;
  paymentButtons: HTMLButtonElement[];
  submitButton: HTMLButtonElement;
  errorContainer: HTMLElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.formElement = this._cloneTemplate(template);
    this.paymentButtons = this._getElements<HTMLButtonElement>(this.formElement, '.button_alt');
    this.submitButton = this._getElement<HTMLButtonElement>('.order__button', this.formElement);
    this.errorContainer = this._getElement<HTMLElement>('.form__errors', this.formElement);

    this._addPaymentSelectionListeners();
    this._addInputListener();
    this._addSubmitListener();
  }

  // клонирование шаблона
  private _cloneTemplate(template: HTMLTemplateElement): HTMLFormElement {
    const form = template.content.querySelector('.form')?.cloneNode(true) as HTMLFormElement;
    if (!form) throw new Error("6");
    return form;
  }

  private _getElements<T extends HTMLElement>(parent: HTMLElement, selector: string): T[] {
    return Array.from(parent.querySelectorAll(selector));
  }

  private _getElement<T extends HTMLElement>(selector: string, parent: HTMLElement): T {
    const element = parent.querySelector<T>(selector);
    if (!element) throw new Error(`7`);
    return element;
  }

  private _addPaymentSelectionListeners(): void {
    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.paymentMethod = button.name;
        this.events.emit('order:paymentSelection', button);
      });
    });
  }

  private _addInputListener(): void {
    this.formElement.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit('order:changeAddress', { field: target.name, value: target.value });
    });
  }

  private _addSubmitListener(): void {
    this.formElement.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('contacts:open');
    });
  }

  set paymentMethod(paymentMethod: string) {
    this.paymentButtons.forEach(button => {
      button.classList.toggle('button_alt-active', button.name === paymentMethod);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  render(): HTMLElement {
    return this.formElement;
  }
}
