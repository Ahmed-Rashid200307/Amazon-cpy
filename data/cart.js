import { deliveryOptions } from "./deliveryOptions.js";

export let cart;

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart'));

if(!cart) {
  cart = [];
};
}

loadFromStorage();

export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart (productId) {
  const productQuantitySelected = Number(document.querySelector(`.js-product-quantity-${productId}`).value);

  let matchingItem;

  cart.forEach((cartItem) => {
    if(cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });

    if (matchingItem) {
      matchingItem.quantity += productQuantitySelected;
    }
    else {
      cart.push({
        productId,
        quantity: productQuantitySelected,
        deliveryOptionId: '1'
      });
    }

    saveToStorage();
}

export function removeFromCart (deleteButtonProductId) {

  cart = cart.filter( product => product.productId != deleteButtonProductId);

  saveToStorage();
};

export function updateDeliveryOption(productId, deliveryOptionId) {
  deliveryOptions.forEach(option => {
    if(option.id === deliveryOptionId) {
      cart.forEach((cartItem) => {
        if(cartItem.productId === productId) {
          cartItem.deliveryOptionId = deliveryOptionId;
          saveToStorage();
        }
      });
    }
  })
}