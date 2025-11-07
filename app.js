// ====== Domain (OOJS) ======
class Product {
  #id; #name; #price;
  constructor(id, name, price) {
    if (!id || !name || typeof price !== "number" || price < 0) throw new Error("Invalid product");
    this.#id = id; this.#name = name; this.#price = price;
  }
  get id() { return this.#id; }
  get name() { return this.#name; }
  get price() { return this.#price; }
}

class ShoppingCartItem {
  #product; #quantity;
  constructor(product, quantity = 1) {
    if (!(product instanceof Product)) throw new Error("product must be Product");
    if (!Number.isInteger(quantity) || quantity <= 0) throw new Error("quantity must be > 0");
    this.#product = product; this.#quantity = quantity;
  }
  get product() { return this.#product; }
  get quantity() { return this.#quantity; }
  set quantity(q) {
    if (!Number.isInteger(q) || q <= 0) throw new Error("quantity must be > 0");
    this.#quantity = q;
  }
  totalPrice() { return this.#product.price * this.#quantity; }
}

class ShoppingCart {
  #items = [];
  add(product, quantity = 1) {
    const existing = this.#items.find(i => i.product.id === product.id);
    if (existing) existing.quantity = existing.quantity + quantity;
    else this.#items.push(new ShoppingCartItem(product, quantity));
  }
  remove(productId) {
    this.#items = this.#items.filter(i => i.product.id !== productId);
  }
  decrease(productId, qty = 1) {
    const item = this.#items.find(i => i.product.id === productId);
    if (!item) return;
    const next = item.quantity - qty;
    if (next <= 0) this.remove(productId);
    else item.quantity = next;
  }
  getTotalItems() { return this.#items.reduce((s,i)=>s+i.quantity,0); }
  getTotalAmount() { return this.#items.reduce((s,i)=>s+i.totalPrice(),0); }
  list() {
    return this.#items.map(i => ({
      id: i.product.id,
      name: i.product.name,
      unitPrice: i.product.price,
      quantity: i.quantity,
      total: i.totalPrice()
    }));
  }
  static currency(locale="fr-FR", currency="EUR") {
    const f = new Intl.NumberFormat(locale,{style:"currency",currency});
    return (n)=>f.format(n);
  }
}

// ====== Demo Data ======
const PRODUCTS = [
  new Product("P001","Laptop",1200),
  new Product("P002","Mouse",25.5),
  new Product("P003","Keyboard",70),
  new Product("P004","Headset",89.9),
  new Product("P005","Monitor 27\"",279.99),
];

const cart = new ShoppingCart();
const fmt = ShoppingCart.currency("fr-FR","EUR");

// ====== UI Rendering ======
const $products = document.getElementById("products");
const $cartBody = document.getElementById("cart-body");
const $cartItems = document.getElementById("cart-items");
const $cartAmount = document.getElementById("cart-amount");

function renderProducts() {
  $products.innerHTML = PRODUCTS.map(p => `
    <article class="card">
      <h3>${p.name}</h3>
      <div class="muted">#${p.id}</div>
      <p class="price">${fmt(p.price)}</p>
      <button data-add="${p.id}">Add to cart</button>
    </article>
  `).join("");
}

function renderCart() {
  const rows = cart.list();
  $cartBody.innerHTML = rows.length
    ? rows.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.name}</td>
        <td>${r.quantity}</td>
        <td>${fmt(r.unitPrice)}</td>
        <td>${fmt(r.total)}</td>
        <td class="actions">
          <button class="ghost" data-dec="${r.id}">-</button>
          <button data-inc="${r.id}">+</button>
          <button class="ghost" data-rem="${r.id}">Remove</button>
        </td>
      </tr>
    `).join("")
    : `<tr><td colspan="6" class="muted">Your cart is empty.</td></tr>`;
  $cartItems.textContent = cart.getTotalItems();
  $cartAmount.textContent = fmt(cart.getTotalAmount());
}

// ====== Events ======
$products.addEventListener("click", (e) => {
  const id = e.target.dataset.add;
  if (!id) return;
  const prod = PRODUCTS.find(p => p.id === id);
  cart.add(prod, 1);
  renderCart();
});

$cartBody.addEventListener("click", (e) => {
  const { inc, dec, rem } = e.target.dataset;
  if (inc) { cart.add(PRODUCTS.find(p=>p.id===inc), 1); renderCart(); }
  if (dec) { cart.decrease(dec, 1); renderCart(); }
  if (rem) { cart.remove(rem); renderCart(); }
});

// ====== Init ======
renderProducts();
renderCart();
