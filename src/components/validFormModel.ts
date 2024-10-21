
import {Order} from '../types';
import { IEvents } from "./base/events";
import {IFormModel} from '../types'

  export class FormModel implements IFormModel {
    public payment: string = '';
    public email: string = '';
    public phone: string = '';
    public address: string = '';
    public total: number = 0;
    public items: string[] = [];
    private formErrors: Partial<Record<keyof Order, string>> = {};
  
    constructor(private events: IEvents) {}
  
    public updateAddress(field: string, value: string): void {
      if (field === 'address') {
        this.address = value;
        this.validateAndEmitOrder();
      }
    }
  
    private validateAndEmitOrder(): void {
      if (this.validateOrder()) {
        this.events.emit('order:ready', this.createOrder());
      }
    }
  

    public validateOrder(): boolean {
      const errors: Partial<Record<keyof Order, string>> = {
        ...this.validateAddress(),
        ...this.validatePayment(),
      };
  
      this.formErrors = errors;
      this.events.emit('formErrors:address', this.formErrors);
      return Object.keys(errors).length === 0;
    }
  
    private validateAddress(): Partial<Record<keyof Order, string>> {
      const errors: Partial<Record<keyof Order, string>> = {};
      const addressPattern = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,\-]{7,}$/;
  
      if (!this.address) {
        errors.address = 'Укажите адрес доставки';
      } else if (!addressPattern.test(this.address)) {
        errors.address = 'Не верно указан адрес доставки';
      }
      return errors;
    }

    private validatePayment(): Partial<Record<keyof Order, string>> {
      const errors: Partial<Record<keyof Order, string>> = {};
      if (!this.payment) {
        errors.payment = 'Выберите способ оплаты';
      }
      return errors;
    }
  
    public updateContactInfo(field: string, value: string): void {
      if (field === 'email') {
        this.email = value;
      } else if (field === 'phone') {
        this.phone = value;
      }
      this.validateAndEmitContactInfo();
    }
  
    private validateAndEmitContactInfo(): void {
      if (this.validateContactInfo()) {
        this.events.emit('order:ready', this.createOrder());
      }
    }

    public validateContactInfo(): boolean {
      const errors: Partial<Record<keyof Order, string>> = {
        ...this.validateEmail(),
        ...this.validatePhone(),
      };
  
      this.formErrors = errors;
      this.events.emit('formErrors:change', this.formErrors);
      return Object.keys(errors).length === 0;
    }
  
    // почта патерн
    private validateEmail(): Partial<Record<keyof Order, string>> {
      const errors: Partial<Record<keyof Order, string>> = {};
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
      if (!this.email) {
        errors.email = 'Укажите адрес электронной почты';
      } else if (!emailPattern.test(this.email)) {
        errors.email = 'Не верно указан адрес электронной почты';
      }
      return errors;
    }
  
    // телефон патерн
    private validatePhone(): Partial<Record<keyof Order, string>> {
      const errors: Partial<Record<keyof Order, string>> = {};
      const phonePattern = /^(\+7|8)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
  
      if (!this.phone) {
        errors.phone = 'Укажите номер телефона';
      } else if (!phonePattern.test(this.phone)) {
        errors.phone = 'Не верно указан номер телефона';
      }
      return errors;
    }
  
    public createOrder(): Order {
      return {
        payment: this.payment as 'online' | 'offline',
        email: this.email,
        phone: this.phone,
        address: this.address,
        total: this.total,
        items: this.items,
      };
    }
  }