import { cart } from '../../data/cart-class.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export function updateDisplayedCartQuantity() {
  let cartQuantity = 0;

  cart.cartItems.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

export function formatedAddedDate(deliveryOptionSelected) {
  let deliveryDays = deliveryOptionSelected.deliveryDays;
  let deliveryDate = dayjs();

  while(deliveryDays > 0) {
    deliveryDate = deliveryDate.add(1, 'days');
    
    if(isWeekend(deliveryDate)) {
      continue;
    }
    else {
      deliveryDays--;
    }
  }
  return deliveryDate.format('dddd, MMMM D');
}

function isWeekend(date) {
  date = date.format('dddd');

  if(date === 'Saturday' || date === 'Sunday') {
    return true;
  }
  else{
    return false;
  }
}