import { cart } from "../data/cart-class.js";
import { products, fetchProducts } from "../data/products.js";
import { updateDisplayedCartQuantity } from "./utils/cart-utils.js";

async function loadPage() {
  await fetchProducts();
}
loadPage().then(() => {
  renderProductsGrid();
});

function renderProductsGrid() {
  let productsHTML = '';

  products.forEach( product => {
    productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
        src="${product.image}">
      </div>
      
      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>
      
      <div class="product-rating-container">
        <img class="product-rating-stars"
        src="${product.getStarsUrl()}">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>
        
      <div class="product-price">
        ${product.getPrice()}
      </div>
      
      <div class="product-quantity-container">
        <select class="js-product-quantity-${product.id}">
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        </select>
      </div>

      ${product.extraInfoHtml()}
      
      <div class="product-spacer"></div>
      
      <div class="js-added-to-cart-${product.id} added-to-cart">
        <img src="images/icons/checkmark.png">
        Added
      </div>
      
      <button class="js-add-to-cart add-to-cart-button button-primary"
      data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>`;
  });
  document.querySelector('.js-products-grid').
  innerHTML = productsHTML;

  function displayAddedToCart (productId) {
    const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
    
    addedMessage.classList.add('added-to-cart-visible');
    
    const previousTimeoutId = addedMessageTimeouts[productId];
    
    if(previousTimeoutId) {
      clearInterval(previousTimeoutId);
    }
    
    const timeoutId = setTimeout(() => {
      addedMessage.classList.remove('added-to-cart-visible');
    }, 2000)
    
    addedMessageTimeouts[productId] = timeoutId;
  }

  const addedMessageTimeouts = {};

  document.querySelector('.js-cart-quantity').
  innerHTML = updateDisplayedCartQuantity();


  document.querySelectorAll('.js-add-to-cart').
  forEach((button) => {
    button.addEventListener('click', () => {
      const {productId} = button.dataset;
      
      cart.addToCart(productId);
      
      document.querySelector('.js-cart-quantity').
      innerHTML = updateDisplayedCartQuantity();
      
      displayAddedToCart(productId);
      
    });
  });
}
