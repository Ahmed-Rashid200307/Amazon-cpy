const url = new URL(window.location.href);
const urlInfo = url.searchParams;

const trackingHTML = `
  <div class="order-tracking">
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on ${urlInfo.get('date')}
    </div>

    <div class="product-info">
      ${urlInfo.get('name')}
    </div>

    <div class="product-info">
      Quantity: ${urlInfo.get('quantity')}
    </div>

    <img class="product-image" src="${urlInfo.get('image')}">

    <div class="progress-labels-container">
      <div class="progress-label">
        Preparing
      </div>
      <div class="progress-label current-status">
        Shipped
      </div>
      <div class="progress-label">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar"></div>
    </div>
  </div>
`
document.querySelector('.js-main').innerHTML = trackingHTML;