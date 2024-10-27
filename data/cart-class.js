import { deliveryOptions } from "./deliveryOptions.js";

export class Cart {
  cartItems;
  #localStorageKey;

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }
  
  #loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(`${this.#localStorageKey}`));
    
    if(!this.cartItems) {
      this.cartItems = [];
    };
  }

  saveToStorage() {
    localStorage.setItem(`${this.#localStorageKey}`, JSON.stringify(this.cartItems));
  }

  addToCart (productId) {
    const productQuantitySelected = Number(document.querySelector(`.js-product-quantity-${productId}`).value);
  
    let matchingItem;
  
    this.cartItems.forEach((cartItem) => {
      if(cartItem.productId === productId) {
        matchingItem = cartItem;
      }
    });
  
      if (matchingItem) {
        matchingItem.quantity += productQuantitySelected;
      }
      else {
        this.cartItems.push({
          productId,
          quantity: productQuantitySelected,
          deliveryOptionId: '1'
        });
      }
  
    this.saveToStorage();
  }

  removeFromCart (deleteButtonProductId) {

    this.cartItems = this.cartItems.filter( product => product.productId != deleteButtonProductId);
  
    this.saveToStorage();
  };

  updateDeliveryOption(productId, deliveryOptionId) {
    deliveryOptions.forEach(option => {
      if(option.id === deliveryOptionId) {
        this.cartItems.forEach((cartItem) => {
          if(cartItem.productId === productId) {
            cartItem.deliveryOptionId = deliveryOptionId;
            this.saveToStorage();
          }
        });
      }
    })
  } 
}

export const cart = new Cart('cart');