import { cart } from "../../data/cart-class.js";
// UNCOMMENT cart BELOW WHEN TESTING AND COMMENT THE ABOVE ONE
// import { cart } from "../../tests/checkout-tests/orderSummaryTests.js";
import { getMatchingProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { formatedAddedDate } from "../utils/cart-utils.js";
import { deliveryOptions, getSelectedDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";

export function renderOrderSummary () {
  let cartSummaryHTML = '';

  cart.cartItems.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getMatchingProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOptionSelected = getSelectedDeliveryOption(deliveryOptionId);

    const dateFormated = formatedAddedDate(deliveryOptionSelected);

    cartSummaryHTML +=
    `<div class="js-cart-item-container-${matchingProduct.id} cart-item-container">
      <div class="js-delivery-date-${matchingProduct.id} delivery-date">
        Delivery date: ${dateFormated}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name js-product-name-${matchingProduct.id}">
            ${matchingProduct.name}
          </div>
          <div class="product-price js-product-price-${matchingProduct.id}">
            ${matchingProduct.getPrice()}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="js-quantity-label-${matchingProduct.id} quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="js-update-quantity-link update-quantity-link link-primary"
            data-product-id = ${matchingProduct.id}>
              Update
            </span>
            <input class="js-quantity-input-${matchingProduct.id} quantity-input">
            <span class="js-save-quantity-link save-quantity-link link-primary" data-product-id="${matchingProduct.id}">
            Save</span>
            <span class="js-delete-link js-delete-link-${matchingProduct.id} delete-quantity-link link-primary"
            data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHtml(cartItem)}
        </div>
      </div>
    </div>`;
  });

  function deliveryOptionsHtml(cartItem) {
    let html = ''

    deliveryOptions.forEach( (option) => {
      const dateFormated = formatedAddedDate(option);
      const priceString = option.priceCents === 0? 'Free' : `$${(formatCurrency(option.priceCents))}`;
      const isChecked = (option.id === cartItem.deliveryOptionId);

      html +=`<div class="delivery-option js-delivery-option js-delivery-option-${cartItem.productId}-${option.id}"
              data-product-id = ${cartItem.productId}
              data-delivery-option-id = ${option.id}>
              <input type="radio" 
                ${isChecked? 'checked' : ''}
                class="delivery-option-input js-delivery-option-input-${cartItem.productId}-${option.id}"
                name="delivery-option-${cartItem.productId}">
              <div>
                <div class="delivery-option-date">
                  ${dateFormated}
                </div>
                <div class="delivery-option-price">
                  ${priceString} - Shipping
                </div>
              </div>
            </div>
            `
    });

    return html;
  }

  document.querySelector('.js-order-summary').
  innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-update-quantity-link').
  forEach(link => {

    link.addEventListener( 'click',() => {
      const productId = link.dataset.productId;

      document.querySelector(`.js-cart-item-container-${productId}`).classList.add('is-editing-quantity');

    });
  });

  function updateCartAndPageOnSave (updateLink) {
    const productId = updateLink.dataset.productId;
    
    const inputQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

    cart.cartItems.forEach((cartItem) => {
      if(cartItem.productId === productId &&
        (inputQuantity > 0 && inputQuantity < 1000)){
        cartItem.quantity = inputQuantity;

        cart.saveToStorage();

        document.querySelector(`.js-quantity-label-${productId}`).
        innerHTML = inputQuantity;

        renderCheckoutHeader();
        renderOrderSummary();
        renderPaymentSummary();
      }
    });
  } 

  document.querySelectorAll('.js-save-quantity-link').
  forEach( link => {
    link.addEventListener( 'click' ,() => {
      updateCartAndPageOnSave(link);
    });
    
    document.body.addEventListener('keydown', event => {
      if(event.key === 'Enter') {
        updateCartAndPageOnSave(link);
      }
    });
  });

  document.querySelectorAll('.js-delete-link').
  forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      cart.removeFromCart(productId);
      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-delivery-option').
  forEach(element => {
    element.addEventListener('click', () => {
      const {productId, deliveryOptionId} = element.dataset;
      cart.updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

}