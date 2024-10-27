import { deliveryOptions } from "./deliveryOptions.js";

function Cart(localStorageKey) {  
  const cart = {
    cartItems: undefined,
  
    loadFromStorage() {
      this.cartItems = JSON.parse(localStorage.getItem(localStorageKey));
    
    if(!this.cartItems) {
      this.cartItems = [];
    };
    },
  
    saveToStorage() {
      localStorage.setItem(localStorageKey, JSON.stringify(this.cartItems));
    },
  
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
    },
  
    removeFromCart (deleteButtonProductId) {
  
      this.cartItems = this.cartItems.filter( product => product.productId != deleteButtonProductId);
    
      this.saveToStorage();
    },
  
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
  };

  return cart;
}

const cart = Cart('cart-oop');
const businesscart = Cart('business-cart');

cart.loadFromStorage();
businesscart.loadFromStorage();

cart.addToCart('04701903-bc79-49c6-bc11-1af7e3651358');
