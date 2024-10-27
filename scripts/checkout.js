import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";
import { fetchProducts, products } from "../data/products.js";

async function loadPage() {
  try {
    await fetchProducts();
  } catch (error) {
    console.log('Unexpected error. Please try again later.');
  }
  
  renderOrderSummary();
  renderPaymentSummary();
  renderCheckoutHeader();
}

loadPage();

// fetchProducts().then(() => {
//   renderOrderSummary();
//   renderPaymentSummary();
//   renderCheckoutHeader();
// });
