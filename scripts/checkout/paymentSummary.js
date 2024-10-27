import { cart } from "../../data/cart-class.js";
// UNCOMMENT cart IMPORT BELOW WHEN TESTING AND COMMENT THE ABOVE ONE
// import { cart } from "../../tests/checkout-tests/orderSummaryTests.js";
import { getMatchingProduct } from "../../data/products.js";
import { getSelectedDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";
import { updateDisplayedCartQuantity } from "../utils/cart-utils.js";
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary() {
  let productsPriceCents = 0;
  let shippingPriceCents = 0;

  cart.cartItems.forEach(cartItem => {
    const product = getMatchingProduct(cartItem.productId);
    productsPriceCents += product.priceCents * cartItem.quantity;
    
    const deliveryOption = getSelectedDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productsPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;

  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHtml = `
          <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${updateDisplayedCartQuantity()}):</div>
            <div class="payment-summary-money">
            $${formatCurrency(productsPriceCents)}
            </div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="js-shipping-price payment-summary-money">
            $${formatCurrency(shippingPriceCents)}
            </div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">
            $${formatCurrency(totalBeforeTaxCents)}
            </div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">
            $${formatCurrency(taxCents)}
            </div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="js-total-price payment-summary-money">
            $${formatCurrency(totalCents)}
            </div>
          </div>

          <button class="js-place-order-button place-order-button button-primary">
            Place your order
          </button>`;

  document.querySelector('.js-payment-summary').
  innerHTML = paymentSummaryHtml;

  document.querySelector('.js-place-order-button').addEventListener('click',async () => {
    
    try {
      const response = await fetch('https://supersimplebackend.dev/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart: cart.cartItems
        })
      });
  
      const order = await response.json();
      addOrder(order);
    } catch (error) {
      console.log("Unexpected error. Try again later.");
    }

    window.location.href = 'orders.html';
    localStorage.removeItem('cart');
  });
}