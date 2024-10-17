import { IEvents } from "./base/events";
import {IOrderSuccess} from '../types'


export class OrderSuccess implements IOrderSuccess {
  successElement: HTMLElement;
  descriptionElement: HTMLElement;
  closeButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, public events: IEvents) {
    this.successElement = this._cloneTemplate(template);
    this.descriptionElement = this._ensureElement<HTMLElement>('.order-success__description');
    this.closeButton = this._ensureElement<HTMLButtonElement>('.order-success__close');

    this._initializeEventListeners();
  }

  private _cloneTemplate(template: HTMLTemplateElement): HTMLElement {
    const success = template.content.querySelector('.order-success')?.cloneNode(true) as HTMLElement;
    if (!success) throw new Error('8');
    return success;
  }

  private _ensureElement<T extends HTMLElement>(selector: string): T {
    const element = this.successElement.querySelector<T>(selector);
    if (!element) throw new Error(`9`);
    return element;
  }

  private _initializeEventListeners(): void {
    this.closeButton.addEventListener('click', () => this._handleCloseClick());
  }

  private _handleCloseClick(): void {
    this.events.emit('success:close');
  }

  render(total: number): HTMLElement {
    this.descriptionElement.textContent = `Списано ${total} синапсов`;
    return this.successElement;
  }
}
