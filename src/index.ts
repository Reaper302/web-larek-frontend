import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ensureElement } from './utils/utils';
import { Order, ProductItem } from './types';

import { ApiModel, DataModel, BasketModel } from './components/Model';
import { FormModel } from './components/validFormModel';
import { Card, CardPreview } from './components/cardCreate';
import { Modal } from './components/modalView';
import { Basket, BasketItem } from './components/basket';
import { Order as OrderView, OrderContacts } from './components/order';
import { OrderSuccess } from './components/success';

const templates = {
  cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
  previewCard: ensureElement<HTMLTemplateElement>('#card-preview'),
  basketContainer: ensureElement<HTMLTemplateElement>('#basket'),
  basketCard: ensureElement<HTMLTemplateElement>('#card-basket'),
  orderForm: ensureElement<HTMLTemplateElement>('#order'),
  contactInfo: ensureElement<HTMLTemplateElement>('#contacts'),
  successScreen: ensureElement<HTMLTemplateElement>('#success'),
};

const api = new ApiModel(CDN_URL, API_URL);
const evt = new EventEmitter();
const dataModel = new DataModel(evt);
const modalWindow = new Modal(ensureElement<HTMLElement>('#modal-container'), evt);
const basket = new Basket(templates.basketContainer, evt);
const basketModel = new BasketModel();
const form = new FormModel(evt);
const order = new OrderView(templates.orderForm, evt);
const contacts = new OrderContacts(templates.contactInfo, evt);

// отрисовка
const renderProductCards = () => {
  dataModel.productCards.forEach(item => {
    const productCard = new Card(templates.cardCatalog, evt, { onClick: () => evt.emit('card:select', item) });
    ensureElement<HTMLElement>('.gallery').append(productCard.render(item));
  });
};

const renderBasketItems = () => {
  basket.items = basketModel.basketProducts.map((item, index) => {
    const basketCard = new BasketItem(templates.basketCard, evt, () => evt.emit('basket:basketItemRemove', item));
    return basketCard.render(item, index + 1);
  });
  basket.renderSumAllProducts(basketModel.getTotalSum());
};

const setupEventListeners = () => {
  evt.on('productCards:receive', renderProductCards);

  evt.on('card:select', (item: ProductItem) => {
    dataModel.setPreview(item);
  });

  evt.on('modalCard:open', (item: ProductItem) => {
    const productPreview = new CardPreview(templates.previewCard, evt);
    modalWindow.setContent(productPreview.render(item));
    modalWindow.open();
  });

  evt.on('card:addBasket', () => {
    basketModel.addProduct(dataModel.selectedCard!);
    basket.renderHeaderBasketCounter(basketModel.getCount());
    modalWindow.close();
  });

  evt.on('basket:open', () => {
    renderBasketItems();
    modalWindow.setContent(basket.render());
    modalWindow.open();
  });

  evt.on('basket:basketItemRemove', (item: ProductItem) => {
    basketModel.removeProduct(item);
    renderBasketItems();
    basket.renderHeaderBasketCounter(basketModel.getCount());
  });

  evt.on('order:open', () => {
    modalWindow.setContent(order.render());
    modalWindow.open();
    form.items = basketModel.basketProducts.map(item => item.id);
  });

  evt.on('order:paymentSelection', (button: HTMLButtonElement) => {
    form.payment = button.name;
    form.validateOrder();
  });

  evt.on('order:changeAddress', (data: { field: string, value: string }) => {
    form.updateAddress(data.field, data.value);
  });
  
  evt.on('formErrors:address', (errors: Partial<Order>) => {
    const { address, payment } = errors;
    order.valid = !address && !payment;
    order.errorContainer.textContent = Object.values({ address, payment }).filter(Boolean).join('; ');
  });

  evt.on('contacts:open', () => {
    form.total = basketModel.getTotalSum();
    modalWindow.setContent(contacts.render());
    modalWindow.open();
  });

  evt.on('contacts:changeInput', (data: { field: string, value: string }) => {
    form.updateContactInfo(data.field, data.value);
  });

  evt.on('formErrors:change', (errors: Partial<Order>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errorContainer.textContent = Object.values({ email, phone }).filter(Boolean).join('; ');
  });

  evt.on('success:open', async () => {
    try {
      const data = await api.submitOrder(form.createOrder());
      console.log('Order success:', data);
      const successScreen = new OrderSuccess(templates.successScreen, evt);
      modalWindow.setContent(successScreen.render(basketModel.getTotalSum()));
      basketModel.clearBasket();
      basket.renderHeaderBasketCounter(basketModel.getCount());
      modalWindow.open();
    } catch (error) {
      console.error('Order error:', error);
    }
  });

  evt.on('success:close', () => modalWindow.close());

  evt.on('modal:open', () => {
    modalWindow.setLocked(true);
  });

  evt.on('modal:close', () => {
    modalWindow.setLocked(false);
  });
};
// инициализация
const init = async () => {
  setupEventListeners();

  try {
    const data = await api.fetchProductCards();
    console.log('cards:', data);
    dataModel.productCards = data;
  } catch (error) {
    console.error('1');
  }
};  init();

