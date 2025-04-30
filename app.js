
const users = [];
let currentUser = null;
let cart = [];


const products = [
  { id: 1, name: "Product 1", description: "Description of product 1", price: 500 },
  { id: 2, name: "Product 2", description: "Description of product 2", price: 1000 },
  { id: 3, name: "Product 3", description: "Description of product 3", price: 5000 },
  { id: 4, name: "Product 4", description: "Description of product 4", price: 2500 },
];

// DOM elements
const pages = {
  register: document.getElementById("register-page"),
  login: document.getElementById("login-page"),
  catalog: document.getElementById("catalog-page"),
  cart: document.getElementById("cart-page"),
};

const navLinks = {
  register: document.getElementById("nav-register"),
  login: document.getElementById("nav-login"),
  catalog: document.getElementById("nav-catalog"),
  cart: document.getElementById("nav-cart"),
};

const cartCountElem = document.getElementById("cart-count");
const productListElem = document.getElementById("product-list");
const cartItemsElem = document.getElementById("cart-items");
const cartTotalElem = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const registerMessage = document.getElementById("register-message");
const loginMessage = document.getElementById("login-message");

// Navigation
function showPage(page) {
  Object.values(pages).forEach(p => p.classList.add("hidden"));
  pages[page].classList.remove("hidden");
  updateActiveNav(page);
}

function updateActiveNav(activePage) {
  Object.entries(navLinks).forEach(([key, elem]) => {
    if (key === activePage) {
      elem.classList.add("active");
    } else {
      elem.classList.remove("active");
    }
  });
}

// Registration
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = registerForm.username.value.trim();
  const password = registerForm.password.value.trim();

  if (users.find(u => u.username === username)) {
    registerMessage.textContent = "Username already exists.";
    return;
  }

  users.push({ username, password });
  registerMessage.style.color = "green";
  registerMessage.textContent = "Registration successful! You can now login.";
  registerForm.reset();
});

// Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = loginForm.username.value.trim();
  const password = loginForm.password.value.trim();

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    loginMessage.style.color = "red";
    loginMessage.textContent = "Invalid username or password.";
    return;
  }

  currentUser = user;
  loginMessage.style.color = "green";
  loginMessage.textContent = "Login successful!";
  loginForm.reset();
  showPage("catalog");
  renderCatalog();
  updateCartCount();
});

// Catalog
function renderCatalog() {
  productListElem.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    const title = document.createElement("h3");
    title.textContent = product.name;

    const desc = document.createElement("p");
    desc.textContent = product.description;

    const price = document.createElement("p");
    price.textContent = `$${product.price.toFixed(2)}`;

    const addButton = document.createElement("button");
    addButton.textContent = "Add to Cart";
    addButton.addEventListener("click", () => addToCart(product.id));

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(price);
    card.appendChild(addButton);

    productListElem.appendChild(card);
  });
}

// Cart
function addToCart(productId) {
  if (!currentUser) {
    alert("Please login to add items to the cart.");
    showPage("login");
    return;
  }
  const cartItem = cart.find(item => item.productId === productId);
  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  updateCartCount();
  alert("Item added to cart.");
}

function updateCartCount() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElem.textContent = totalCount;
}

function renderCart() {
  cartItemsElem.innerHTML = "";
  if (cart.length === 0) {
    cartItemsElem.textContent = "Your cart is empty.";
    cartTotalElem.textContent = "";
    checkoutBtn.style.display = "none";
    return;
  }
  checkoutBtn.style.display = "block";

  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    const cartItemDiv = document.createElement("div");
    cartItemDiv.className = "cart-item";

    const infoDiv = document.createElement("div");
    infoDiv.className = "cart-item-info";
    infoDiv.textContent = `${product.name} - $${product.price.toFixed(2)} x ${item.quantity}`;

    const controlsDiv = document.createElement("div");
    controlsDiv.className = "cart-item-controls";

    const btnDecrease = document.createElement("button");
    btnDecrease.textContent = "-";
    btnDecrease.addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        cart = cart.filter(ci => ci !== item);
      }
      renderCart();
      updateCartCount();
    });

    const btnIncrease = document.createElement("button");
    btnIncrease.textContent = "+";
    btnIncrease.addEventListener("click", () => {
      item.quantity++;
      renderCart();
      updateCartCount();
    });

    controlsDiv.appendChild(btnDecrease);
    controlsDiv.appendChild(btnIncrease);

    cartItemDiv.appendChild(infoDiv);
    cartItemDiv.appendChild(controlsDiv);

    cartItemsElem.appendChild(cartItemDiv);
  });

  const totalPrice = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + product.price * item.quantity;
  }, 0);

  cartTotalElem.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

// Checkout
checkoutBtn.addEventListener("click", () => {
  if (!currentUser) {
    alert("Please login to checkout.");
    showPage("login");
    return;
  }
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }
  alert("Thank you for your purchase!");
  cart = [];
  renderCart();
  updateCartCount();
  showPage("catalog");
});

// Navigation event listeners
navLinks.register.addEventListener("click", (e) => {
  e.preventDefault();
  showPage("register");
});

navLinks.login.addEventListener("click", (e) => {
  e.preventDefault();
  showPage("login");
});

navLinks.catalog.addEventListener("click", (e) => {
  e.preventDefault();
  if (!currentUser) {
    alert("Please login to view the catalog.");
    showPage("login");
    return;
  }
  showPage("catalog");
  renderCatalog();
});

navLinks.cart.addEventListener("click", (e) => {
  e.preventDefault();
  if (!currentUser) {
    alert("Please login to view the cart.");
    showPage("login");
    return;
  }
  showPage("cart");
  renderCart();
});

// Initialize app
showPage("register");
