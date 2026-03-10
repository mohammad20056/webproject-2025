const CART_STORAGE_KEY = "norasflora_cart";
const planten = [
  {
    naam: "cactus",
    prijs: 5.99,
    afbeelding: "images/cactus.jpg"
  },
  {
    naam: "zonnebloem",
    prijs: 7.5,
    afbeelding: "images/zonnebloemen.jpg"
  },
  {
    naam: "rode tulpen",
    prijs: 3.99,
    afbeelding: "images/rodetulpen.jpg"
  }
];

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

function renderPlanten(renderToGrid) {
  const container = document.getElementById("assortiment");
  const assortmentGrid = document.querySelector(".assortiment-grid");
  const useGrid = Boolean(renderToGrid) && Boolean(assortmentGrid);

  if (!container && !useGrid) {
    return;
  }

  if (container) {
    container.innerHTML = "";
  }

  if (useGrid) {
    assortmentGrid.querySelectorAll(".dynamic-plant").forEach((card) => card.remove());
  }

  planten.forEach((plant) => {
    if (container) {
      const plantCard = document.createElement("div");
      plantCard.classList.add("plant-card");
      plantCard.innerHTML =
        '<img src="' + plant.afbeelding + '" alt="' + plant.naam + '">' +
        "<h2>" + plant.naam + "</h2>" +
        "<p>EUR " + Number(plant.prijs).toFixed(2) + "</p>";
      container.appendChild(plantCard);
    }

    if (useGrid) {
      const gridCard = document.createElement("article");
      gridCard.className = "product dynamic-plant";
      gridCard.innerHTML =
        '<img src="' + plant.afbeelding + '" alt="' + plant.naam + '">' +
        "<h3>" + plant.naam + "</h3>" +
        "<p>EUR " + Number(plant.prijs).toFixed(2) + "</p>";
      assortmentGrid.appendChild(gridCard);
    }
  });

  if (useGrid) {
    setupAssortmentPage();
  }
}

function addPlant(naam, prijs, afbeelding) {
  if (!naam || Number.isNaN(Number(prijs))) {
    return false;
  }

  planten.push({
    naam: String(naam),
    prijs: Number(prijs),
    afbeelding: afbeelding || ""
  });
  renderPlanten(true);
  return true;
}

function removeCartUnits(index, unitsToRemove) {
  const cart = loadCart();
  const item = cart[index];
  if (!item) {
    return;
  }

  item.quantity -= unitsToRemove;

  if (item.quantity <= 0) {
    cart.splice(index, 1);
  }

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

    const controls = document.createElement("div");
    controls.className = "remove-controls";

    const removeAmountInput = document.createElement("input");
    removeAmountInput.type = "number";
    removeAmountInput.className = "remove-quantity-input";
    removeAmountInput.min = "1";
    removeAmountInput.max = String(item.quantity);
    removeAmountInput.value = "1";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-item-button";
    removeButton.textContent = "Verwijder aantal";
    removeButton.addEventListener("click", () => {
      const amount = parseInt(removeAmountInput.value, 10);
      if (Number.isNaN(amount) || amount < 1) {
        return;
      }
      const safeAmount = Math.min(amount, item.quantity);
      removeCartUnits(index, safeAmount);
    });

    controls.appendChild(removeAmountInput);
    controls.appendChild(removeButton);
    row.appendChild(controls);

    cartItemsContainer.appendChild(row);
  });

  totalPriceElement.textContent = "Totaal: " + formatPrice(total);
}

setupAssortmentPage();
setupCartActions();
renderCartPage();
updateCartLinkCount();
renderPlanten(false);
window.addPlant = addPlant;

const assortiment = [
  {
    naam: "cactus",
    prijs: 5.99,
    afbeelding: "images/cactus.jpg"
  },
  {
    naam: "zonnebloem",
    prijs: 7.5,
    afbeelding: "images/zonnebloemen.jpg"
  },
  {
    naam: "rode tulpen",
    prijs: 3.99,
    afbeelding: "images/rodetulpen.jpg"
  },
  {
    naam: "orchidee",
    prijs: 12.99,
    afbeelding: "images/orchidee.jpg"
  }
];
window.addPlant = addPlant;
addPlant("orchidee", 12.99, "images/orchidee.jpg");