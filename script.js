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
  { title: "Mutton Galouti Kebab", price: "Rs 380", image: "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/ruby_pathak-yahoo.com/Mutton_Galouti_Kabab.jpg" },
  { title: "Butter Chicken Pani Puri", price: "Rs 240", image: "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/sneha-archanaskitchen.com/Butter_Chicken_Pani_Puri__Recipe.jpg" },
  { title: "Tandoori Chicken Wings", price: "Rs 150", image: "https://www.whiskaffair.com/wp-content/uploads/2023/05/Tandoori-Chicken-Wings-2-1.jpg" },
  { title: "Fish Fingers", price: "Rs 220", image: "https://www.recipetineats.com/tachyon/2020/01/Fish-Fingers_9.jpg" },
  { title: "Prawn Tempura", price: "Rs 300", image: "https://khinskitchen.com/wp-content/uploads/2023/08/prawn-tempura-03.jpg" }
];


const vegStarters = [
  { title: "Pea Soup", price: "Rs 80", image: "https://images.pexels.com/photos/8738014/pexels-photo-8738014.jpeg" },
  { title: "Paneer Tikka", price: "Rs 180", image: "images/paneer tikka.jpg" },
  { title: "Hara Bhara Kebab", price: "Rs 120", image: "https://images.pexels.com/photos/32562200/pexels-photo-32562200.jpeg" },
  { title: "Veg Spring Roll", price: "Rs 130", image: "images/springroll.jpg" },
  { title: "Chilli Paneer", price: "Rs 180", image: "images/chillipaneer.webp" },
  { title: "Crispy Corn", price: "Rs 80", image: "images/crispycorn.webp" },
  { title: "Veg Manchurian", price: "Rs 140", image: "images/vegmanchurian.webp" },
  { title: "Cheese Balls", price: "Rs 120", image: "images/cheeseballs.webp" },
  { title: "Mushroom 65", price: "Rs 150", image: "images/mushroom65.jpg" },
  { title: "Stuffed Mushroom", price: "Rs 170", image: "images/Stuffed Mushroom.webp" },
  { title: "Stuffed Paneer Balls", price: "Rs 170", image: "images/Stuffed Paneer Balls.webp" }
];

const soupMenu = [
  { title: "Sweet Corn", price: "Rs 120", image: "images/sweetcorn soup.webp" },
  { title: "Tomato Soup", price: "Rs 90", image: "images/Tomato Soup.webp" },
  { title: "Hot and Sour Soup", price: "Rs 110", image: "images/Hot and Sour Soup.webp" },
  { title: "Mushroom Soup", price: "Rs 130", image: "images/Mushroom Soup.webp" },
  { title: "Manchow Soup", price: "Rs 100", image: "images/Manchow Soup.webp" },
  { title: "Spinach Soup", price: "Rs 110", image: "images/Spinach Soup.webp" },
  { title: "Chicken Clear Soup", price: "Rs 140", image: "images/Chicken Clear Soup.webp" },
  { title: "Seafood Soup", price: "Rs 170", image: "images/Seafood Soup.webp" },
  { title: "Chicken Corn Soup", price: "Rs 150", image: "images/Chicken Corn Soup.webp" },
  { title: "Lung Fung Soup", price: "Rs 170", image: "images/Lung Fung Soup.webp" }
];

const fishMenu = [
  { title: "Prawns (Small)", price: "Rs 380", image: "images/Prawns (Small).webp" },
  { title: "Rohu (Freshwater)", price: "Rs 190", image: "images/Rohu (Freshwater).webp" },
  { title: "Catla (Freshwater)", price: "Rs 210", image: "images/Catla (Freshwater).avif" },
  { title: "Surmai (King Fish)", price: "Rs 700", image: "images/Surmai (King Fish).webp" },
  { title: "Indian Salmon (Rawas)", price: "Rs 650", image: "images/Indian Salmon (Rawas).avif" },
  { title: "Lobster", price: "Rs 950", image: "images/Lobster.webp" },
  { title: "Crab (Large)", price: "Rs 620", image: "images/Crab (Large).webp" },
  { title: "Squid (Calamari)", price: "Rs 410", image: "images/Squid (Calamari).webp" },
  { title: "Octopus (Whole)", price: "Rs 550", image: "images/Octopus (Whole).webp" },
  { title: "Oysters (Dozen)", price: "Rs 480", image: "images/Oysters (Dozen).webp" },
  { title: "Seer Fish (Vanjaram)", price: "Rs 950", image: "images/Seer Fish (Vanjaram).avif" },
  { title: "Sardines (Mathi)", price: "Rs 180", image: "images/Sardines (Mathi).webp" },
  { title: "Pomfret (White)", price: "Rs 550", image: "images/Pomfret (White).webp" },
  { title: "Clams (Shellfish)", price: "Rs 180", image: "images/Clams (Shellfish).avif" }
];

const fullMenu = {
  vegMainCourse: [
    { title: "Paneer Butter Masala", price: "Rs 180", image: "images/paneer butter masala.webp" },
    { title: "Kadai Paneer", price: "Rs 150", image: "images/Kadai Paneer.webp" },
    { title: "Palak Paneer", price: "Rs 160", image: "images/Palak Paneer.webp" },
    { title: "Shahi Paneer", price: "Rs 180", image: "images/Shahi Paneer.webp" },
    { title: "Veg Kolhapuri", price: "Rs 130", image: "images/Veg Kolhapuri.webp" },
    { title: "Mixed Veg Curry", price: "Rs 120", image: "images/Mixed Veg Curry.webp" },
    { title: "Aloo Gobi", price: "Rs 120", image: "images/Aloo Gobi.webp" },
    { title: "Chana Masala", price: "Rs 100", image: "images/Chana Masala.webp" },
    { title: "Rajma Masala", price: "Rs 130", image: "images/Rajma Masala.webp" },
    { title: "Bhindi Masala", price: "Rs 120", image: "images/Bhindi Masala.webp" }
  ],
  nonVegMainCourse: [
    { title: "Butter Chicken", price: "Rs 220", image: "images/Butter Chicken.webp" },
    { title: "Chicken Curry", price: "Rs 190", image: "images/Chicken Curry.webp" },
    { title: "Chicken Chettinad", price: "Rs 240", image: "images/Chicken Chettinad.webp" },
    { title: "Chicken Korma", price: "Rs 210", image: "images/Chicken Korma.webp" },
    { title: "Mutton Rogan Josh", price: "Rs 340", image: "images/Mutton Rogan Josh.webp" },
    { title: "Mutton Curry", price: "Rs 270", image: "images/Mutton Curry.webp" },
    { title: "Egg Curry", price: "Rs 110", image: "images/Egg Curry.webp" },
    { title: "Fish Curry (Coastal Style)", price: "Rs 240", image: "images/Fish Curry (Coastal Style).avif" },
    { title: "Prawn Masala", price: "Rs 320", image: "images/Prawn Masala.webp" },
    { title: "Andhra Chicken Curry", price: "Rs 320", image: "images/Andhra Chicken Curry.avif" }
  ],
  riceAndBiryani: [
    { title: "Veg Biryani", price: "Rs 130", image: "images/Veg Biryani.webp" },
    { title: "Chicken Biryani", price: "Rs 210", image: "images/Chicken Biryani.webp" },
    { title: "Mutton Biryani", price: "Rs 280", image: "images/Mutton Biryani.webp" },
    { title: "Egg Biryani", price: "Rs 110", image: "images/Egg Biryani.webp" },
    { title: "Jeera Rice", price: "Rs 90", image: "images/Jeera Rice.webp" },
    { title: "Steamed Rice (Plain)", price: "Rs 70", image: "images/Steamed Rice (Plain).webp" },
    { title: "Ghee Rice", price: "Rs 100", image: "images/Ghee Rice.webp" },
    { title: "Fried Rice (Veg)", price: "Rs 120", image: "images/Fried Rice (Veg).webp" },
    { title: "Curd Rice", price: "Rs 80", image: "images/Curd Rice.webp" }
  ]
};

const noodlesMenu = [
  { title: "Veg Hakka Noodles", price: "Rs 115", image: "images/Veg Hakka Noodles.webp" },
  { title: "Veg Schezwan Noodles", price: "Rs 120", image: "images/Veg Schezwan Noodles.webp" },
  { title: "Chilli Garlic Noodles", price: "Rs 120", image: "images/Chilli Garlic Noodles.webp" },
  { title: "Butter Noodles", price: "Rs 100", image: "images/Butter Noodles.webp" },
  { title: "Paneer Noodles", price: "Rs 140", image: "images/Paneer Noodles.webp" },
  { title: "Mushroom Noodles", price: "Rs 130", image: "images/Mushroom Noodles.webp" },
  { title: "Singapuri Veg Noodles", price: "Rs 160", image: "images/Singapuri Veg Noodles.webp" },
  { title: "Egg Noodles", price: "Rs 120", image: "images/Egg Noodles.avif" },
  { title: "Chicken Hakka Noodles", price: "Rs 160", image: "images/Chicken Hakka Noodles.webp" },
  { title: "Chicken Schezwan Noodles", price: "Rs 170", image: "images/Chicken Schezwan Noodles.webp" },
  { title: "Prawn Noodles", price: "Rs 200", image: "images/Prawn Noodles.webp" },
  { title: "Mutton Keema Noodles", price: "Rs 240", image: "images/Mutton Keema Noodles.webp" },
  { title: "Chilli Chicken Noodles", price: "Rs 160", image: "images/Chilli Chicken Noodles.webp" },
  { title: "Triple Schezwan Noodles", price: "Rs 200", image: "images/Triple Schezwan Noodles.webp" },
  { title: "American Chop Suey (Veg)", price: "Rs 170", image: "images/American Chop Suey (Veg).avif" },
  { title: "American Chop Suey (Non-Veg)", price: "Rs 200", image: "images/American Chop Suey (Non-Veg).avif" },
  { title: "Thai Pad Noodles (Veg)", price: "Rs 170", image: "images/Thai Pad Noodles (Veg).webp" },
  { title: "Thai Pad Noodles (Chicken)", price: "Rs 200", image: "images/Thai Pad Noodles (Chicken).webp" },
  { title: "Mixed Noodles (Egg + Chicken)", price: "Rs 190", image: "images/Mixed Noodles (Egg + Chicken).webp" },
  { title: "Korean Style Spicy Noodles", price: "Rs 210", image: "images/Korean Style Spicy Noodles.webp" }
];

const saladMenu = [
  { title: "Green Salad", price: "Rs 80", image: "images/Green Salad.webp" },
  { title: "Sprouts Salad", price: "Rs 100", image: "images/Sprouts Salad.webp" },
  { title: "Fruit Salad with Cream", price: "Rs 130", image: "images/Fruit Salad with Cream.webp" },
  { title: "Russian Salad", price: "Rs 150", image: "images/Russian Salad.webp" },
  { title: "Corn & Mayo Salad", price: "Rs 140", image: "images/Corn & Mayo Salad.webp" },
  { title: "Caesar Salad (Veg)", price: "Rs 160", image: "images/crispycorn.webp" },
  { title: "Grilled Chicken Salad", price: "Rs 200", image: "images/Grilled Chicken Salad.webp" },
  { title: "Chicken Caesar Salad", price: "Rs 220", image: "images/Chicken Caesar Salad.webp" },
  { title: "Chicken Mayo Salad", price: "Rs 190", image: "images/Chicken Mayo Salad.webp" },
  { title: "Egg Salad", price: "Rs 140", image: "images/Egg Salad.webp" },
  { title: "Avocado Salad", price: "Rs 250", image: "images/Avocado Salad.webp" }
];

const dessertMenu = [
  { title: "Gulab Jamun (2 pcs)", price: "Rs 60", image: "images/Gulab Jamun (2 pcs).webp" },
  { title: "Rasgulla (2 pcs)", price: "Rs 60", image: "images/Rasgulla (2 pcs).webp" },
  { title: "Rasmalai (2 pcs)", price: "Rs 100", image: "images/Rasmalai (2 pcs).webp" },
  { title: "Gajar Ka Halwa", price: "Rs 110", image: "images/Gajar Ka Halwa.webp" },
  { title: "Kaju Katli (100g)", price: "Rs 160", image: "images/Kaju Katli (100g).webp" },
  { title: "Ice Cream (1 scoop)", price: "Rs 80", image: "images/Ice Cream (1 scoop).webp" },
  { title: "Chocolate Brownie", price: "Rs 140", image: "images/Chocolate Brownie.webp" },
  { title: "Brownie with Ice Cream", price: "Rs 180", image: "images/Brownie with Ice Cream.webp" },
  { title: "Cheesecake (Slice)", price: "Rs 170", image: "images/Cheesecake (Slice).webp" },
  { title: "Tiramisu (Slice)", price: "Rs 210", image: "images/Tiramisu (Slice).webp" },
  { title: "Falooda (Royal/Special)", price: "Rs 100", image: "images/Falooda.webp" },
  { title: "Kulfi (Malai/Pista)", price: "Rs 90", image: "images/Kulfi.webp" },
  { title: "Choco Lava Cake", price: "Rs 150", image: "images/Choco Lava Cake.webp" }
];

