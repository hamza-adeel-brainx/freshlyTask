const cards = document.querySelectorAll(".plans");
cards.forEach(card => {
  card.addEventListener("click", function () {
    savePlan(card);
  })
})
let planCount = 0;

function savePlan(card) {
  localStorage.setItem("plan", card.dataset.id);
  planCount = Number(localStorage.getItem("plan"))
  updatePlan();

}



function getNextTenDates() {
  var today = new Date();
  var dayOfWeek = today.getDay();

  var daysUntilNextMonday;

  if (dayOfWeek === 1) {
    daysUntilNextMonday = 0;
  } else {
    daysUntilNextMonday = 8 - dayOfWeek;
  }

  var nextMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysUntilNextMonday);

  var dates = [];

  for (var i = 0; i < 10; i++) {
    var nextDate = new Date(nextMonday.getFullYear(), nextMonday.getMonth(), nextMonday.getDate() + i);
    dates.push(nextDate);
  }

  return dates;
}


const dateList = document.querySelector(".date-list");
const firstDeliveryDate = document.querySelector(".first-delivery-date");
const mealDate = document.querySelector(".delivery-date-meal-page");
let dates = getNextTenDates();
let activeDate = "";
activeDate = dates[0];
const span = document.createElement("span");
span.innerHTML = `<b>First Delivery Date: ${dates[0].toLocaleString('en-us', { weekday: 'long' })} , ${dates[0].toLocaleString('en-us', { month: 'long' })} ${dates[0].getDate()} </b> `;
mealDate.innerHTML = `My Delivery For <b> ${dates[0].toLocaleString('en-us', { weekday: 'long' })} , ${dates[0].toLocaleString('en-us', { month: 'long' })} ${dates[0].getDate()} </b>`;
firstDeliveryDate.appendChild(span);
for (let i = 0; i < dates.length; i++) {
  const listitem = document.createElement("li");
  listitem.classList.add("list-item");
  listitem.setAttribute("dataset-date", dates[i]);
  listitem.innerHTML = ` <strong> ${dates[i].toLocaleString('en-us', { weekday: 'long' })} ,</strong> ${dates[i].toLocaleString('en-us', { month: 'long' })} ${dates[i].getDate()}`
  dateList.appendChild(listitem);
  listitem.addEventListener("click", addClassActive);
  if (i === 0) {
    listitem.classList.add("active");
    const MostPopular = document.createElement("p");
    listitem.appendChild(MostPopular);
    MostPopular.classList.add("most-popular");
    MostPopular.innerHTML = `<img src="/images/starIcon.png " alt="startIcon" width=15px>  </img> Most popular`;

  }
}


function addClassActive(e) {
  const listItems = dateList.getElementsByClassName("list-item");
  for (let item of listItems) {
    item.classList.remove("active");
  }
  e.target.classList.add("active");
  activeDate = e.target.getAttribute("dataset-date");
  let date = new Date(activeDate)

  span.innerHTML = `<b>First Delivery Date: ${date.toLocaleString('en-us', { weekday: 'long' })} , ${date.toLocaleString('en-us', { month: 'long' })} ${date.getDate()}</b>  `;

  mealDate.innerHTML = `My Delivery For <b> ${date.toLocaleString('en-us', { weekday: 'long' })} , ${date.toLocaleString('en-us', { month: 'long' })} ${date.getDate()}</b>`;



  const deliveryDropdown = document.querySelector(".delivery-date-dropdown")

  for (var i = 0; i < deliveryDropdown.options.length; i++) {
    var option = deliveryDropdown.options[i];
    if (option.dataset.date === e.target.getAttribute("dataset-date")) {
      option.selected = true;
      break;
    }
  }

}



//array maintainig the products in cart//

let cartArray = [];
let totalPrice = 0;


function addToCart(e) {
  let primium = false;
  const card = e.target.closest(".mealsection-card");
  const productTitle = card.querySelector(".product-tile");
  const imgSrc = card.querySelector(".product-img").src;
  const cart = document.querySelector(".cart");
  const template = document.querySelector('.cart template');
  const price = card.getAttribute("dataset-price");
  const templateContent = template.content;
  const clonedContent = templateContent.cloneNode(true);
  clonedContent.querySelector(".cart-img").setAttribute("src", imgSrc);
  clonedContent.querySelector(".cart-item").setAttribute("dataset-price", price);
  clonedContent.querySelector(".cart-item-title").textContent = productTitle.textContent;
  if (card.classList.contains("primium-card")) {
    clonedContent.querySelector(".cart-item").classList.add("premium-color");
    primium = true;
  } else {
    primium = false;
  }
  const addItemBtn = clonedContent.querySelector(".add-item-btn")
  const minusItemBtn = clonedContent.querySelector(".minus-item-btn")
  addItemBtn.addEventListener("click", addItem);
  minusItemBtn.addEventListener("click", removeItem);
  cart.appendChild(clonedContent);

  if (cartArray.length > 0) {
    let itemExists = false;

    cartArray.forEach(entry => {
      if (entry.title === productTitle.textContent) {
        entry.Quantity += 1;
        itemExists = true;
      }
    });

    if (!itemExists) {
      let cartItemObj = {
        title: productTitle.textContent,
        Image: imgSrc,
        Price: price,
        Quantity: 1,
        special: false
      };
      if (primium) {
        cartItemObj.special = true;
      }
      cartArray.push(cartItemObj);
    }
  } else {
    let cartItemObj = {
      title: productTitle.textContent,
      Image: imgSrc,
      Price: price,
      Quantity: 1,
      special: false
    };
    if (primium) {
      cartItemObj.special = true;
    }
    cartArray.push(cartItemObj);
  }
  calculatePriceUpdatePlan("plus", price);
}

function addItem(e) {
  const carItem = e.target.parentElement;
  const price = carItem.getAttribute("dataset-price");
  const cart = document.querySelector(".cart");
  const imgSrc = carItem.querySelector(".cart-img").src;
  const productTitle = carItem.querySelector(".cart-item-title");
  const template = document.querySelector('.cart template');
  const templateContent = template.content;
  const clonedContent = templateContent.cloneNode(true);
  clonedContent.querySelector(".cart-img").setAttribute("src", imgSrc);
  clonedContent.querySelector(".cart-item-title").textContent = productTitle.textContent;
  clonedContent.querySelector(".cart-item").setAttribute("dataset-price", price);
  const addItemBtn = clonedContent.querySelector(".add-item-btn")
  const minusItemBtn = clonedContent.querySelector(".minus-item-btn")
  addItemBtn.addEventListener("click", addItem);
  minusItemBtn.addEventListener("click", removeItem);
  if (carItem.classList.contains("premium-color")) {
    clonedContent.querySelector(".cart-item").classList.add("premium-color");
  }
  cart.appendChild(clonedContent);
  calculatePriceUpdatePlan("plus", price);
  renderCartArray(1, carItem);
}

function removeItem(e) {
  const currentElement = e.target.parentElement;
  const price = currentElement.getAttribute("dataset-price");
  currentElement.parentElement.removeChild(currentElement);
  const carItem = e.target.parentElement;
  renderCartArray(0, carItem);
  calculatePriceUpdatePlan("subtract", price);
}

function renderCartArray(num, Item) {

  const productTitle = Item.querySelector(".cart-item-title");
  if (num == 0) {
    cartArray.forEach(entry => {
      if (entry.title == productTitle.textContent && entry.Quantity <= 1) {
        cartArray = cartArray.filter(entry => entry.title !== productTitle.textContent);
      }

      if (entry.title == productTitle.textContent && entry.Quantity > 1) {
        entry.Quantity -= 1;
      }
    })
  } else if (num == 1) {
    cartArray.forEach(entry => {
      if (entry.title === productTitle.textContent) {
        entry.Quantity += 1;
      }
    });
  }
}



function updatePlan() {
  let mealsInCartt = mealInCart()
  count = planCount - mealsInCartt;
  const stepCustomise = document.querySelector(".step-btn-cart-customise");
  const addItemsText = document.querySelector(".add-items-procees");
  const cartBtn = document.querySelector(".btn-cart-next-steps");
  if (count == 0) {
    addItemsText.textContent = "Proceed to checkout";
    stepCustomise.setAttribute("data-step-action", "next");
    cartBtn.removeAttribute("disabled");
  } else if (count > 0) {
    addItemsText.innerHTML = `Add ${count} items to cart to proceed`;
    stepCustomise.setAttribute("data-step-action", "");
    cartBtn.setAttribute("disabled", "disabled");
  } else if (count < 0) {

    addItemsText.innerHTML = `remove ${Math.abs(count)} items from cart to proceed`;
    stepCustomise.setAttribute("data-step-action", "");
    cartBtn.setAttribute("disabled", "disabled");
  }
}

function mealInCart() {
  const cartItemsCount = document.querySelector(".cart");
  return cartItemsCount.childElementCount - 1;
}


function calculatePriceUpdatePlan(type, price) {
  if (type == "plus") {
    totalPrice = totalPrice + Number(price);

  } else if (type == "subtract") {
    totalPrice = totalPrice - Number(price);
    const template = document.querySelector('.cart template');

  }

  const noOfMeals = document.querySelector(".no-of-meals");
  const priceElement = document.querySelector(".price");
  const subTotalElement = document.querySelector(".sub-total-price");
  noOfMeals.innerHTML = `${localStorage.getItem("plan")} Meals`
  priceElement.innerHTML = `$${totalPrice}`;
  subTotalElement.innerHTML = `<b>$${totalPrice}</b>`;
  //checkout page price set
  const mealPrice = document.querySelector(".price-meals");
  const totalCheckoutPrice = document.querySelector(".price-total");
  mealPrice.innerHTML = `<b>$${totalPrice}</b>`
  totalCheckoutPrice.innerHTML = `<b>$${(totalPrice+6.99+6.99).toFixed(2)}</b>`
  updatePlan();
}
const stepCustomise = document.querySelector(".step-btn-cart-customise");
stepCustomise.addEventListener("click", myMealsCheckout);



const promoLink = document.querySelector(".promo-link");
promoLink.addEventListener("click", promoAdd);


function promoAdd() {
  promoLink.classList.add("promo-link-d");
  const promoContainer = document.querySelector(".promo-container")
  const template = document.querySelector('.checkout-summary template');
  const templateContent = template.content;
  const clonedContent = templateContent.cloneNode(true);
  promoContainer.appendChild(clonedContent);

}
const deliveryDateSelect = document.querySelector(".delivery-date-dropdown");

dates.forEach(date => {
  let template = document.querySelector(".delivery-date-dropdown template");
  const clonedOption = template.content.cloneNode(true);
  const clonedOptionText = clonedOption.querySelector("option");
  clonedOptionText.innerHTML = `${date.toLocaleString('en-us', { weekday: 'long' })} , ${date.toLocaleString('en-us', { month: 'long' })} ${date.getDate()}`;
  clonedOptionText.setAttribute("data-date", date);
  deliveryDateSelect.appendChild(clonedOption);

})

deliveryDateSelect.addEventListener('change', function () {
  var selectedDate = deliveryDateSelect.value;

  const myDeliberyFor = document.querySelector(".delivery-date-meal-page");

  myDeliberyFor.innerHTML = `My Delivery For <b> ${selectedDate}</b>`;
  const firstDeliveryDate = document.querySelector(".first-delivery-date");
  firstDeliveryDate.innerHTML = `<b>First Delivery Date:${selectedDate}</b>`


  let selectedOption = deliveryDateSelect.options[deliveryDateSelect.selectedIndex];
  let datasetDate = selectedOption.dataset.date;


  const listitems = dateList.querySelectorAll(".list-item")

  for (let item of listitems) {
    item.classList.remove("active");

    let itemDate = item.getAttribute("dataset-date");
    if (itemDate == datasetDate) {
      item.classList.add("active");
    }

  }
});





function myMealsCheckout() {
  document.querySelector(".meal-check-products").innerHTML = "";
  cartArray.forEach(entry => {

    const mealCheckProducts = document.querySelector(".meal-check-products")
    const template = document.querySelector('.meal-checkout template');
    const templateContent = template.content;
    const clonedContent = templateContent.cloneNode(true);

    const quantity = clonedContent.querySelector(".quantity");
    const checkoutImg = clonedContent.querySelector(".checkout-img")
    const checkoutItemTitle = clonedContent.querySelector(".checkout-item-title")
    const checkoutItem = clonedContent.querySelector(".checkout-item")
    quantity.textContent = entry.Quantity;
    checkoutImg.setAttribute("src", entry.Image)
    checkoutItemTitle.innerHTML = `<b>${entry.title}</b>`
    if (entry.special) {
      checkoutItem.classList.add("premium-color")
    }
    mealCheckProducts.appendChild(clonedContent);
  })
}


fetch("scripts/meals.json")
  .then(response => response.json())
  .then(data => {

    data.meals.forEach(meal => {
      const COL3 = document.querySelector(".temp");
      const template = document.querySelector(".temp template");
      const templateContent = template.content;
      const clonedContent = templateContent.cloneNode(true);
      const img = clonedContent.querySelector(".product-img");
      const title = clonedContent.querySelector(".product-tile");
      const flavour = clonedContent.querySelector(".flavour");
      const gluten = clonedContent.querySelector(".gluten");
      const cals = clonedContent.querySelector(".cals");
      const carbs = clonedContent.querySelector(".carbs");
      const protein = clonedContent.querySelector(".protein");
      img.src = meal.Image
      title.textContent = meal.title
      flavour.textContent = meal.flavour;
      clonedContent.querySelector(".card").setAttribute("dataset-price", meal.Price);
      gluten.textContent = meal.gluten;
      cals.textContent = meal.cals;
      carbs.textContent = meal.carbs;
      protein.textContent = meal.protein;
      if (meal.special == "true") {
        const card = clonedContent.querySelector(".card");
        const carBody = clonedContent.querySelector(".card-body-border");
        const badgeParent = clonedContent.querySelector(".img-badge-parent");
        card.classList.add("primium-card");
        carBody.classList.add("premium-color");
        badgeParent.innerHTML = `<p class="price-badge">$1.49</p>`

      }
      const addItemBtn = clonedContent.querySelector(".add-btn");

      addItemBtn.addEventListener("click", addToCart);

      COL3.appendChild(clonedContent);

    })

  })
  .catch(error => console.error(error));