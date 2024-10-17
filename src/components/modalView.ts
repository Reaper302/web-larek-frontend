import { IEvents } from "./base/events";
import {IModal} from '../types'

export class Modal implements

 IModal {
  private closeButton: HTMLButtonElement;
  private contentContainer: HTMLElement;
  private pageWrapper: HTMLElement;

  constructor(
    private modalContainer: HTMLElement,
    private events: IEvents
  ) {
    this.closeButton = this._getElement<HTMLButtonElement>('.modal__close', this.modalContainer);
    this.contentContainer = this._getElement<HTMLElement>('.modal__content', this.modalContainer);
    this.pageWrapper = this._getElement<HTMLElement>('.page__wrapper', document);

    this._initializeEventListeners();
  }

  // получение элемента
  private _getElement<T extends HTMLElement>(selector: string, parent: Document | HTMLElement): T {
    const element = parent.querySelector<T>(selector);
    if (!element) {
      throw new Error(`3`);
    }
    return element;
  }


  private _initializeEventListeners(): void {
    this.closeButton.addEventListener('click', () => this.close());
    this.modalContainer.addEventListener('click', () => this.close());
    const modalContentContainer = this.modalContainer.querySelector('.modal__container');
    if (modalContentContainer) {
      modalContentContainer.addEventListener('click', event => event.stopPropagation());
    }
  }

  // контент для модалки
  public setContent(content: HTMLElement | string): void {
    if (typeof content === 'string') {
      this.contentContainer.innerHTML = content;
    } else {
      this.contentContainer.replaceChildren(content);
    }
  }

  // открытие модалки
  public open(): void {
    this._toggleModal(true);
    this.setLocked(true);
    this.events.emit('modal:open');
  }

  // закрытие
  public close(): void {
    this._toggleModal(false);
    this.setContent(''); // очистка
    this.setLocked(false);
    this.events.emit('modal:close');
  }

  private _toggleModal(isOpen: boolean): void {
    this.modalContainer.classList.toggle('modal_active', isOpen);
  }

  public setLocked(isLocked: boolean): void {
    this.pageWrapper.classList.toggle('page__wrapper_locked', isLocked);
  }

  public render(): HTMLElement {
    return this.modalContainer;
  }
}
