## OOJS Shopping Cart

An object-oriented JavaScript mini-project that recreates a shopping cart using **classes** (`Product`, `ShoppingCartItem`, `ShoppingCart`), with a simple DOM UI.

### Features

* Create **products** with `id`, `name`, `price`
* Add/remove/decrease items in a **shopping cart**
* Compute **item totals** and **cart total**
* Minimal, responsive UI; no frameworks

### Project Structure

```
.
├─ index.html
├─ styles.css
└─ app.js
```

### How to Run

1. Download the three files into the same folder.
2. Open `index.html` in your browser (double-click).
3. Click **Add to cart**, adjust quantities with **+ / -**, or **Remove**.

### Domain Model (OOJS)

* **Product**: immutable `id`, `name`, `price`
* **ShoppingCartItem**: holds a `Product` + `quantity`, computes `totalPrice()`
* **ShoppingCart**:

  * `add(product, quantity=1)`
  * `decrease(productId, qty=1)`
  * `remove(productId)`
  * `getTotalItems()`, `getTotalAmount()`
  * `list()` returns rows for rendering

### Notes

* Prices formatted using `Intl.NumberFormat` (default `fr-FR`, `EUR`).
* All logic is encapsulated in classes; the UI layer only renders and wires events.
