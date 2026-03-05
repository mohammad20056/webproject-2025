const CART_STORAGE_KEY = "norasflora_cart";

function loadCart() {
  try {
    const rawCart = localStorage.getItem(CART_STORAGE_KEY);
    return rawCart ? JSON.parse(rawCart) : [];
  } catch (error) {
    console.error("Kon winkelwagen niet laden:", error);
    return [];
  }
}

function saveCart(cartItems) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
}

function formatPrice(price) {
  return "EUR " + Number(price).toFixed(2);
}

function parsePrice(priceText) {
  const matchedNumber = String(priceText || "").match(/(\d+[.,]?\d*)/);
  if (!matchedNumber) {
    return 0;
  }
  return parseFloat(matchedNumber[1].replace(",", "."));
}

function updateCartLinkCount() {
  const cart = loadCart();
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartLinks = document.querySelectorAll('a[href="winkelwagen.html"]');

  cartLinks.forEach((cartLink) => {
    let label = cartLink.querySelector(".cart-link-label");
    let badge = cartLink.querySelector(".cart-count-badge");

    if (!label || !badge) {
      const baseText = cartLink.textContent.trim() || "Winkelwagen";
      cartLink.textContent = "";
      cartLink.classList.add("cart-link");

      label = document.createElement("span");
      label.className = "cart-link-label";
      label.textContent = baseText;

      badge = document.createElement("span");
      badge.className = "cart-count-badge";
      badge.setAttribute("aria-live", "polite");

      cartLink.appendChild(label);
      cartLink.appendChild(badge);
    }

    if (totalQuantity > 0) {
      badge.textContent = String(totalQuantity);
      badge.style.display = "inline-block";
    } else {
      badge.textContent = "";
      badge.style.display = "none";
    }
  });
}

function addToCart(product) {
  const cart = loadCart();
  const existingItem = cart.find((item) => item.name === product.name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartLinkCount();
}

function setupAssortmentPage() {
  const productCards = document.querySelectorAll(".assortiment-grid .product");
  if (!productCards.length) {
    return;
  }

  productCards.forEach((card) => {
    const titleEl = card.querySelector("h3");
    const priceEl = card.querySelector("p");
    const imageEl = card.querySelector("img");

    if (!titleEl || !priceEl) {
      return;
    }

    const product = {
      name: titleEl.textContent.trim(),
      price: parsePrice(priceEl.textContent),
      image: imageEl ? imageEl.getAttribute("src") : ""
    };

    if (card.querySelector(".add-to-cart-button")) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "add-to-cart-button";
    button.textContent = "Toevoegen aan winkelwagen";

    button.addEventListener("click", () => {
      addToCart(product);
      button.textContent = "Toegevoegd";
      setTimeout(() => {
        button.textContent = "Toevoegen aan winkelwagen";
      }, 900);
    });

    card.appendChild(button);
  });
}

function removeCartItem(index) {
  const cart = loadCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCartPage();
  updateCartLinkCount();
}

function clearCart() {
  saveCart([]);
  renderCartPage();
  updateCartLinkCount();
}

function setupCartActions() {
  const clearCartButton = document.getElementById("clear-cart");
  if (!clearCartButton) {
    return;
  }

  clearCartButton.addEventListener("click", clearCart);
}

function renderCartPage() {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");
  const clearCartButton = document.getElementById("clear-cart");
  if (!cartItemsContainer || !totalPriceElement) {
    return;
  }

  const cart = loadCart();
  cartItemsContainer.innerHTML = "";

  if (!cart.length) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Je winkelwagen is nog leeg.</p>';
    totalPriceElement.textContent = "Totaal: EUR 0.00";
    if (clearCartButton) {
      clearCartButton.disabled = true;
    }
    return;
  }

  if (clearCartButton) {
    clearCartButton.disabled = false;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML =
      '<img src="' + item.image + '" alt="' + item.name + '">' +
      '<div class="cart-item-content">' +
      '<p class="cart-item-name">' + item.name + "</p>" +
      '<p class="cart-item-meta">Aantal: ' + item.quantity + "</p>" +
      '<p class="cart-item-meta">Subtotaal: ' + formatPrice(lineTotal) + "</p>" +
      "</div>";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-item-button";
    removeButton.textContent = "Verwijderen";
    removeButton.addEventListener("click", () => removeCartItem(index));

    row.appendChild(removeButton);

    cartItemsContainer.appendChild(row);
  });

  totalPriceElement.textContent = "Totaal: " + formatPrice(total);
}

setupAssortmentPage();
setupCartActions();
renderCartPage();
updateCartLinkCount();
