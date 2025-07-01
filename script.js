document.addEventListener("DOMContentLoaded", () => {
  const nonVegContainer = document.getElementById("nonVegStarters");
  const vegContainer = document.getElementById("vegStarters");
  const soupContainer = document.getElementById("soupMenu");
  const fishContainer = document.getElementById("fishMenu");
  const mainCourseContainer = document.getElementById("mainCourse");
  const noodlesContainer = document.getElementById("noodles");
  const saladContainer = document.getElementById("salad");
  const dessertContainer = document.getElementById("desserts");

  if (nonVegContainer) {
    renderItems(nonVegStarters, nonVegContainer);
  } else if (vegContainer) {
    renderItems(vegStarters, vegContainer);
  } else if (soupContainer) {
    renderItems(soupMenu, soupContainer);
  } else if (fishContainer) {
    renderItems(fishMenu, fishContainer);
  } else if (mainCourseContainer) {
    renderFullMenu(fullMenu, mainCourseContainer);
  } else if (noodlesContainer) {
    renderItems(noodlesMenu, noodlesContainer);
  } else if (saladContainer) {
    renderItems(saladMenu, saladContainer);
  }
  else if (dessertContainer) {
  renderItems(dessertMenu, dessertContainer);
  }
  updateCartCount();
  displayCart()
});

function renderItems(items, container) {
  items.forEach(item => {
    const column = document.createElement("div");
    column.classList.add("col-12", "col-md-6", "col-lg-4", "col-xl-3");

    const card = document.createElement("div");
    card.classList.add("cards", "bg-light", "shadow", "rounded", "mb-3");

    const img = document.createElement("img");
    img.src = item.image;
    img.classList.add("img-fluid");
    card.appendChild(img);

    const desc = document.createElement("div");
    desc.classList.add("description", "px-3");

    const title = document.createElement("h5");
    title.textContent = item.title;

    const price = document.createElement("p");
    price.textContent = item.price;

    const button = document.createElement("button");
    button.classList.add("custom-button");
    button.textContent = "Add to Cart";
    button.addEventListener("click", () => addToCart(item));

    desc.appendChild(title);
    desc.appendChild(price);
    desc.appendChild(button);
    card.appendChild(desc);
    column.appendChild(card);
    container.appendChild(column);
  });
}


function renderFullMenu(menuObject, container) {
  Object.keys(menuObject).forEach(category => {
    const headingEl = document.createElement("h2");
    headingEl.classList.add("text-center", "pt-3");
    headingEl.textContent = category
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, str => str.toUpperCase());
    container.appendChild(headingEl);

    menuObject[category].forEach(item => {
      const column = document.createElement("div");
      column.classList.add("col-12", "col-md-6", "col-lg-4", "col-xl-3");

      const card = document.createElement("div");
      card.classList.add("cards", "bg-light", "shadow", "rounded", "mb-3");

      const img = document.createElement("img");
      img.src = item.image;
      img.classList.add("img-fluid");
      card.appendChild(img);

      const desc = document.createElement("div");
      desc.classList.add("description", "px-3");

      const title = document.createElement("h5");
      title.textContent = item.title;

      const price = document.createElement("p");
      price.classList.add("text-start");
      price.textContent = item.price;

      const button = document.createElement("button");
      button.classList.add("custom-button");
      button.textContent = "Add to Cart";
      button.addEventListener("click", () => addToCart(item));

      desc.appendChild(title);
      desc.appendChild(price);
      desc.appendChild(button);
      card.appendChild(desc);
      column.appendChild(card);
      container.appendChild(column);
    });
  });
}

function displayCart() {
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  const container = document.getElementById("cartItems");
  container.innerHTML = "";

  if (cart.length === 0) {
    const messageEl = document.createElement("div");
    messageEl.classList.add("d-flex", "justify-content-center", "align-items-center", "text-center", "w-100", "py-5");

    const textEl = document.createElement("h4");
    textEl.textContent = "Oops👨🏾‍🍳 can't find anything...";
    textEl.style.fontSize="28px"
    // textEl.classList.add("text-muted");

    messageEl.appendChild(textEl);
    container.appendChild(messageEl);
    return;
  }

  cart.forEach((item, index) => {
    const column = document.createElement("div");
    column.classList.add("col-12", "col-md-6", "col-lg-4", "col-xl-3");

    const card = document.createElement("div");
    card.classList.add("cards", "bg-light", "shadow", "rounded", "mb-3");

    const img = document.createElement("img");
    img.src = item.image;
    img.classList.add("img-fluid");
    card.appendChild(img);

    const desc = document.createElement("div");
    desc.classList.add("description", "px-3");

    const title = document.createElement("h5");
    title.textContent = item.title;

    const price = document.createElement("p");
    price.textContent = item.price;

    const quantityWrap = document.createElement("div");
    quantityWrap.classList.add("d-flex", "justify-content-between", "align-items-center", "gap-2", "mt-2");

    const minusBtn = document.createElement("button");
    minusBtn.textContent = "–";
    minusBtn.classList.add("btn", "btn-outline-secondary", "btn-sm");
    minusBtn.addEventListener("click", () => updateQuantity(index, item.quantity - 1));

    const qtyLabel = document.createElement("span");
    qtyLabel.textContent = "Qty: " + item.quantity;
    qtyLabel.classList.add("fw-bold");

    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.classList.add("btn", "btn-outline-secondary", "btn-sm");
    plusBtn.addEventListener("click", () => updateQuantity(index, item.quantity + 1));

    quantityWrap.appendChild(minusBtn);
    quantityWrap.appendChild(qtyLabel);
    quantityWrap.appendChild(plusBtn);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("btn","btn-danger","btn-sm", "mt-2");
    removeBtn.textContent = "Remove Item";
    removeBtn.addEventListener("click", () => removeFromCart(index));

    desc.appendChild(title);
    desc.appendChild(price);
    desc.appendChild(quantityWrap);
    desc.appendChild(removeBtn);

    card.appendChild(desc);
    column.appendChild(card);
    container.appendChild(column);
  });

  const summaryRow = document.createElement("div");
  summaryRow.classList.add("col-12", "text-center", "mt-3");

  const totalPrice = cart.reduce((sum, item) => {
    const numericPrice = parseFloat(item.price.replace(/[^\d.]/g, ""));
    return sum + (numericPrice * item.quantity);
  }, 0);

  const totalEl = document.createElement("h5");
  totalEl.classList.add("fw-bold");
  totalEl.textContent = "Total: Rs " + totalPrice.toFixed(2);
  totalEl.style.color = "green"
  totalEl.style.fontSize = "24px"

  summaryRow.appendChild(totalEl);
  container.appendChild(summaryRow);

  const checkoutBtn = document.createElement("button");
  checkoutBtn.textContent = "Proceed to Delivery & Payment";
  checkoutBtn.classList.add("btn", "btn-success", "mt-3", "px-4");
  checkoutBtn.style.fontSize = "18px";

  checkoutBtn.addEventListener("click", () => {
    window.location.href = "index.html#deliveryPaymentSection"; 
  });

  summaryRow.appendChild(document.createElement("br"));
  summaryRow.appendChild(checkoutBtn);

}

function updateModalTotal() {
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^\d.]/g, ""));
    return sum + (price * item.quantity);
  }, 0);

  const totalPriceElement = document.getElementById("totalprice");
  if (totalPriceElement) {
    totalPriceElement.textContent = " Rs " + total.toFixed(2);
  }
}


let cartCountEl = document.getElementById("cartCount")

function addToCart(item) {
  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
   let existingItem = cart.find(cartItem => cartItem.title === item.title);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    item.quantity = 1;
    cart.push(item);
  }
  sessionStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalQuantity;
  }
}

function updateQuantity(index, newQty) {
  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  if (newQty <= 0) {
    cart.splice(index, 1); 
  } else {
    cart[index].quantity = newQty;
  }

  sessionStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCart(); 
}

function removeFromCart(index) {
  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  sessionStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  location.reload(); 
}


cartCountEl.onclick =  () => {
  window.location.href = "cart.html"
}

function mainMenu() {
  window.location.href = "index.html#exploreMenuSection";
}


function nonVeg() {
  window.location.href = "non-veg starters.html";
}

function Veg() {
  window.location.href = "veg-starters.html";
}

function soups() {
  window.location.href = "soups.html";
}

function fishSeaFoods() {
  window.location.href = "fish_sea_foods.html";
}

function mainCourse() {
  window.location.href = "maincourse.html";
}

function noodles() {
  window.location.href = "Noodles.html";
}

function salad() {
  window.location.href = "salad.html";
}

function dessert() {
  window.location.href = "dessert.html";
}

const orderModal = document.getElementById("orderModal");
if (orderModal) {
  orderModal.addEventListener("show.bs.modal", updateModalTotal);
}

function confirmOrder() {

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0,0,0,0.6)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "9999";

  const box = document.createElement("div");
  box.style.backgroundColor = "#fff";
  box.style.padding = "2rem";
  box.style.borderRadius = "8px";
  box.style.textAlign = "center";
  box.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";


  const tick = document.createElement("div");
  tick.innerHTML = `<i class="bi bi-check-circle-fill" style="color: green; font-size: 48px;"></i>`;
  tick.style.fontSize = "48px";
  // tick.style.color = "green";
  tick.style.marginBottom = "1rem";


  const message = document.createElement("h4");
  message.textContent = "Order Placed. Thank you!";
  message.style.marginBottom = "1rem";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.classList.add("btn", "btn-success", "mt-2");
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(overlay);
  });

  box.appendChild(tick);
  box.appendChild(message);
  box.appendChild(closeBtn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}


const nonVegStarters = [
  { title: "Chicken Spring Rolls", price: "Rs 80", image: "https://img.taste.com.au/AhhCj8s8/w720-h480-cfill-q80/taste/2018/02/chicken-spring-rolls-134846-1.jpg" },
  { title: "Chicken Pakora", price: "Rs 220", image: "https://hinzcooking.com/wp-content/uploads/2021/11/chicken-pakora-01-1024x1536.jpg" },
  { title: "Chilli Prawns", price: "Rs 160", image: "https://www.recipetineats.com/tachyon/2016/07/Asian-Chilli-Garlic-Prawns-2_1.jpg" },
  { title: "Seekh Kebabs", price: "Rs 230", image: "https://www.cookwithnabeela.com/wp-content/uploads/2024/02/ChickenSeekhKebab.webp" },
  { title: "Chicken Majestic", price: "Rs 260", image: "https://spiceeats.com/wp-content/uploads/2020/07/Chicken-Majestic.jpg" },
  { title: "Egg 65", price: "Rs 110", image: "https://vismaifood.com/storage/app/uploads/public/9f2/983/cf6/thumb__700_0_0_0_auto.jpg" },
  { title: "Keema Samosa", price: "Rs 220", image: "https://www.cubesnjuliennes.com/wp-content/uploads/2020/08/Best-Mutton-Keema-Samosa-2.jpg" },
  { title: "Mutton Galouti Kebab", price: "Rs 380", image: "https://res.cloudinary.com/dglvqybdo/image/upload/v1751398738/Mutton_guloti_kabab_xrwfsg.webp" },
  { title: "Butter Chicken Pani Puri", price: "Rs 240", image: "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/sneha-archanaskitchen.com/Butter_Chicken_Pani_Puri__Recipe.jpg" },
  { title: "Tandoori Chicken Wings", price: "Rs 150", image: "https://www.whiskaffair.com/wp-content/uploads/2023/05/Tandoori-Chicken-Wings-2-1.jpg" },
  { title: "Fish Fingers", price: "Rs 220", image: "https://www.recipetineats.com/tachyon/2020/01/Fish-Fingers_9.jpg" },
  { title: "Prawn Tempura", price: "Rs 300", image: "https://khinskitchen.com/wp-content/uploads/2023/08/prawn-tempura-03.jpg" }
];


const vegStarters = [
  { title: "Pea Soup", price: "Rs 80", image: "https://images.pexels.com/photos/8738014/pexels-photo-8738014.jpeg" },
  { title: "Paneer Tikka", price: "Rs 180", image: "assets/paneer_tikka.jpg" },
  { title: "Hara Bhara Kebab", price: "Rs 120", image: "https://images.pexels.com/photos/32562200/pexels-photo-32562200.jpeg" },
  { title: "Veg Spring Roll", price: "Rs 130", image: "assets/springroll.jpg" },
  { title: "Chilli Paneer", price: "Rs 180", image: "assets/chillipaneer.webp" },
  { title: "Crispy Corn", price: "Rs 80", image: "assets/crispycorn.webp" },
  { title: "Veg Manchurian", price: "Rs 140", image: "assets/vegmanchurian.webp" },
  { title: "Cheese Balls", price: "Rs 120", image: "assets/cheeseballs.webp" },
  { title: "Mushroom 65", price: "Rs 150", image: "assets/mushroom65.jpg" },
  { title: "Stuffed Mushroom", price: "Rs 170", image: "assets/Stuffed_Mushroom.webp" },
  { title: "Stuffed Paneer Balls", price: "Rs 170", image: "assets/Stuffed_Paneer_Balls.webp" }
];

const soupMenu = [
  { title: "Sweet Corn", price: "Rs 120", image: "assets/sweetcorn_soup.webp" },
  { title: "Tomato Soup", price: "Rs 90", image: "assets/Tomato_Soup.webp" },
  { title: "Hot and Sour Soup", price: "Rs 110", image: "assets/Hot_and_Sour_Soup.webp" },
  { title: "Mushroom Soup", price: "Rs 130", image: "assets/Mushroom_Soup.webp" },
  { title: "Manchow Soup", price: "Rs 100", image: "assets/Manchow_Soup.webp" },
  { title: "Spinach Soup", price: "Rs 110", image: "assets/Spinach_Soup.webp" },
  { title: "Chicken Clear Soup", price: "Rs 140", image: "assets/Chicken_Clear_Soup.webp" },
  { title: "Seafood Soup", price: "Rs 170", image: "assets/Seafood_Soup.webp" },
  { title: "Chicken Corn Soup", price: "Rs 150", image: "assets/Chicken_Corn_Soup.webp" },
  { title: "Lung Fung Soup", price: "Rs 170", image: "assets/Lung_Fung_Soup.webp" }
];

const fishMenu = [
  { title: "Prawns (Small)", price: "Rs 380", image: "assets/Prawns(Small).webp" },
  { title: "Rohu (Freshwater)", price: "Rs 190", image: "assets/Rohu(Freshwater).webp" },
  { title: "Catla (Freshwater)", price: "Rs 210", image: "assets/Catla(Freshwater).avif" },
  { title: "Surmai (King Fish)", price: "Rs 700", image: "assets/Surmai(King_Fish).webp" },
  { title: "Indian Salmon (Rawas)", price: "Rs 650", image: "assets/Indian_Salmon(Rawas).avif" },
  { title: "Lobster", price: "Rs 950", image: "assets/Lobster.webp" },
  { title: "Crab (Large)", price: "Rs 620", image: "assets/Crab(Large).webp" },
  { title: "Squid (Calamari)", price: "Rs 410", image: "assets/Squid(Calamari).webp" },
  { title: "Octopus (Whole)", price: "Rs 550", image: "assets/Octopus(Whole).webp" },
  { title: "Oysters (Dozen)", price: "Rs 480", image: "assets/Oysters(Dozen).webp" },
  { title: "Seer Fish (Vanjaram)", price: "Rs 950", image: "assets/Seer_Fish(Vanjaram).avif" },
  { title: "Sardines (Mathi)", price: "Rs 180", image: "assets/Sardines(Mathi).webp" },
  { title: "Pomfret (White)", price: "Rs 550", image: "assets/Pomfret(White).webp" },
  { title: "Clams (Shellfish)", price: "Rs 180", image: "assets/Clams(Shellfish).avif" }
];

const fullMenu = {
  vegMainCourse: [
    { title: "Paneer Butter Masala", price: "Rs 180", image: "assets/paneer_butter_masala.webp" },
    { title: "Kadai Paneer", price: "Rs 150", image: "assets/Kadai_Paneer.webp" },
    { title: "Palak Paneer", price: "Rs 160", image: "assets/Palak_Paneer.webp" },
    { title: "Shahi Paneer", price: "Rs 180", image: "assets/Shahi_Paneer.webp" },
    { title: "Veg Kolhapuri", price: "Rs 130", image: "assets/Veg_Kolhapuri.webp" },
    { title: "Mixed Veg Curry", price: "Rs 120", image: "assets/Mixed_Veg_Curry.webp" },
    { title: "Aloo Gobi", price: "Rs 120", image: "assets/Aloo_Gobi.webp" },
    { title: "Chana Masala", price: "Rs 100", image: "assets/Chana_Masala.webp" },
    { title: "Rajma Masala", price: "Rs 130", image: "assets/Rajma_Masala.webp" },
    { title: "Bhindi Masala", price: "Rs 120", image: "assets/Bhindi_Masala.webp" }
  ],
  nonVegMainCourse: [
    { title: "Butter Chicken", price: "Rs 220", image: "assets/Butter_Chicken.webp" },
    { title: "Chicken Curry", price: "Rs 190", image: "assets/Chicken_Curry.webp" },
    { title: "Chicken Chettinad", price: "Rs 240", image: "assets/Chicken_Chettinad.webp" },
    { title: "Chicken Korma", price: "Rs 210", image: "assets/Chicken_Korma.webp" },
    { title: "Mutton Rogan Josh", price: "Rs 340", image: "assets/Mutton_Rogan_Josh.webp" },
    { title: "Mutton Curry", price: "Rs 270", image: "assets/Mutton_Curry.webp" },
    { title: "Egg Curry", price: "Rs 110", image: "assets/Egg_Curry.webp" },
    { title: "Fish Curry (Coastal Style)", price: "Rs 240", image: "assets/Fish_Curry(Coastal_Style).avif" },
    { title: "Prawn Masala", price: "Rs 320", image: "assets/Prawn_Masala.webp" },
    { title: "Andhra Chicken Curry", price: "Rs 320", image: "assets/Andhra_Chicken_Curry.avif" }
  ],
  riceAndBiryani: [
    { title: "Veg Biryani", price: "Rs 130", image: "assets/Veg_Biryani.webp" },
    { title: "Chicken Biryani", price: "Rs 210", image: "assets/Chicken_Biryani.webp" },
    { title: "Mutton Biryani", price: "Rs 280", image: "assets/Mutton_Biryani.webp" },
    { title: "Egg Biryani", price: "Rs 110", image: "assets/Egg_Biryani.webp" },
    { title: "Jeera Rice", price: "Rs 90", image: "assets/Jeera_Rice.webp" },
    { title: "Steamed Rice (Plain)", price: "Rs 70", image: "assets/Steamed_Rice(Plain).webp" },
    { title: "Ghee Rice", price: "Rs 100", image: "assets/Ghee_Rice.webp" },
    { title: "Fried Rice (Veg)", price: "Rs 120", image: "assets/Fried_Rice(Veg).webp" },
    { title: "Curd Rice", price: "Rs 80", image: "assets/Curd_Rice.webp" }
  ]
};

const noodlesMenu = [
  { title: "Veg Hakka Noodles", price: "Rs 115", image: "assets/Veg_Hakka_Noodles.webp" },
  { title: "Veg Schezwan Noodles", price: "Rs 120", image: "assets/Veg_Schezwan_Noodles.webp" },
  { title: "Chilli Garlic Noodles", price: "Rs 120", image: "assets/Chilli_Garlic_Noodles.webp" },
  { title: "Butter Noodles", price: "Rs 100", image: "assets/Butter_Noodles.webp" },
  { title: "Paneer Noodles", price: "Rs 140", image: "assets/Paneer_Noodles.webp" },
  { title: "Mushroom Noodles", price: "Rs 130", image: "assets/Mushroom_Noodles.webp" },
  { title: "Singapuri Veg Noodles", price: "Rs 160", image: "assets/Singapuri_Veg_Noodles.webp" },
  { title: "Egg Noodles", price: "Rs 120", image: "assets/Egg_Noodles.avif" },
  { title: "Chicken Hakka Noodles", price: "Rs 160", image: "assets/Chicken_Hakka_Noodles.webp" },
  { title: "Chicken Schezwan Noodles", price: "Rs 170", image: "assets/Chicken_Schezwan_Noodles.webp" },
  { title: "Prawn Noodles", price: "Rs 200", image: "assets/Prawn_Noodles.webp" },
  { title: "Mutton Keema Noodles", price: "Rs 240", image: "assets/Mutton_Keema_Noodles.webp" },
  { title: "Chilli Chicken Noodles", price: "Rs 160", image: "assets/Chilli_Chicken_Noodles.webp" },
  { title: "Triple Schezwan Noodles", price: "Rs 200", image: "assets/Triple_Schezwan_Noodles.webp" },
  { title: "American Chop Suey (Veg)", price: "Rs 170", image: "assets/American_Chop_Suey(Veg).avif" },
  { title: "American Chop Suey (Non-Veg)", price: "Rs 200", image: "assets/American_Chop_Suey(Non-Veg).avif" },
  { title: "Thai Pad Noodles (Veg)", price: "Rs 170", image: "assets/Thai_Pad_Noodles(Veg).webp" },
  { title: "Thai Pad Noodles (Chicken)", price: "Rs 200", image: "assets/Thai_Pad_Noodles(Chicken).webp" },
  { title: "Mixed Noodles (Egg + Chicken)", price: "Rs 190", image: "assets/Mixed_Noodles(Egg_Chicken).webp" },
  { title: "Korean Style Spicy Noodles", price: "Rs 210", image: "assets/Korean_Style_Spicy_Noodles.webp" }
];

const saladMenu = [
  { title: "Green Salad", price: "Rs 80", image: "assets/Green_Salad.webp" },
  { title: "Sprouts Salad", price: "Rs 100", image: "assets/Sprouts_Salad.webp" },
  { title: "Fruit Salad with Cream", price: "Rs 130", image: "assets/Fruit_Salad_with_Cream.webp" },
  { title: "Russian Salad", price: "Rs 150", image: "assets/Russian_Salad.webp" },
  { title: "Corn & Mayo Salad", price: "Rs 140", image: "assets/Corn_Mayo_Salad.webp" },
  { title: "Caesar Salad (Veg)", price: "Rs 160", image: "assets/crispycorn.webp" },
  { title: "Grilled Chicken Salad", price: "Rs 200", image: "assets/Grilled_Chicken_Salad.webp" },
  { title: "Chicken Caesar Salad", price: "Rs 220", image: "assets/Chicken_Caesar_Salad.webp" },
  { title: "Chicken Mayo Salad", price: "Rs 190", image: "assets/Chicken_Mayo_Salad.webp" },
  { title: "Egg Salad", price: "Rs 140", image: "assets/Egg_Salad.webp" },
  { title: "Avocado Salad", price: "Rs 250", image: "assets/Avocado_Salad.webp" }
];

const dessertMenu = [
  { title: "Gulab Jamun (2 pcs)", price: "Rs 60", image: "assets/Gulab_Jamun(2pcs).webp" },
  { title: "Rasgulla (2 pcs)", price: "Rs 60", image: "assets/Rasgulla(2pcs).webp" },
  { title: "Rasmalai (2 pcs)", price: "Rs 100", image: "assets/Rasmalai(2pcs).webp" },
  { title: "Gajar Ka Halwa", price: "Rs 110", image: "assets/Gajar_Ka_Halwa.webp" },
  { title: "Kaju Katli (100g)", price: "Rs 160", image: "assets/Kaju_Katli(100g).webp" },
  { title: "Ice Cream (1 scoop)", price: "Rs 80", image: "assets/IceCream(1scoop).webp" },
  { title: "Chocolate Brownie", price: "Rs 140", image: "assets/Chocolate_Brownie.webp" },
  { title: "Brownie with Ice Cream", price: "Rs 180", image: "assets/Brownie_with_Ice_Cream.webp" },
  { title: "Cheesecake (Slice)", price: "Rs 170", image: "assets/Cheesecake(Slice).webp" },
  { title: "Tiramisu (Slice)", price: "Rs 210", image: "assets/Tiramisu(Slice).webp" },
  { title: "Falooda (Royal/Special)", price: "Rs 100", image: "assets/Falooda.webp" },
  { title: "Kulfi (Malai/Pista)", price: "Rs 90", image: "assets/Kulfi.webp" },
  { title: "Choco Lava Cake", price: "Rs 150", image: "assets/Choco_Lava_Cake.webp" }
];

