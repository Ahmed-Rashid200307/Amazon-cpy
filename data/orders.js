import { formatCurrency } from "../scripts/utils/money.js";
import { fetchProducts } from "./products.js";
import { getMatchingProduct } from "./products.js";
import { updateDisplayedCartQuantity } from "../scripts/utils/cart-utils.js";

export const orders = JSON.parse(localStorage.getItem('orders')) || [];

let orderHTML= ``;

let orderDate;

async function renderOrder() {
  await fetchProducts();
  orders.forEach((order) => {
    orderDate = new Date(order.orderTime);
    orderHTML += `
            <div class="order-container">
            
            <div class="order-header">
              <div class="order-header-left-section">
                <div class="order-date">
                  <div class="order-header-label">Order Placed:</div>
                  <div>${orderDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>
                </div>
                <div class="order-total">
                  <div class="order-header-label">Total:</div>
                  <div>$${formatCurrency(order.totalCostCents)}</div>
                </div>
              </div>

              <div class="order-header-right-section">
                <div class="order-header-label">Order ID:</div>
                <div>${order.id}</div>
              </div>
            </div>

            <div class="order-details-grid">
              ${orderProductsHtml(order)}
            </div>
          </div>
    `

  });

  function orderProductsHtml(order) {
    let productsHTML = ``;

    order.products.forEach((product) => {
      const deliveryDate = new Date(product.estimatedDeliveryTime);
      const matchingProduct = getMatchingProduct(product.productId);

      productsHTML += `
            <div class="product-image-container">
              <img src="${matchingProduct.image}">
            </div>

            <div class="product-details">
              <div class="product-name">
                ${matchingProduct.name}
              </div>
              <div class="product-delivery-date">
                Arriving on: ${deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </div>
              <div class="product-quantity">
                Quantity: ${product.quantity}
              </div>
              <button class="buy-again-button button-primary">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html?name=${matchingProduct.name}&date=${deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}&quantity=${product.quantity}&image=${matchingProduct.image}">
                <button class="track-package-button button-secondary">
                  Track package
                </button>
              </a>
            </div>
      `
    });

    return productsHTML;
  }
  
document.querySelector('.js-order-grid').innerHTML = orderHTML;
}

document.querySelector('.js-cart-quantity').innerHTML = updateDisplayedCartQuantity();

renderOrder();

export function addOrder(order) {
  orders.unshift(order);
  saveTOStorage();
}

function saveTOStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}