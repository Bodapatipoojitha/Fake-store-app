let allProducts = [];
let cart = [];

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

async function getProducts() {
    try {
        const response = await axios.get(
            "http://localhost:5000/products",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        allProducts = response.data;
        displayProducts(allProducts);

    } catch (error) {
        alert("Please login again");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";
    }
}

function displayProducts(products) {
    const container = document.getElementById("products");

    container.innerHTML = "";

    products.forEach(product => {
        container.innerHTML += `
            <div class="card">
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p class="price">₹${Math.round(product.price * 83)}</p>
                <p>${product.category}</p>

                <button class="add-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

function filterProducts() {
    const searchValue = document
        .getElementById("search")
        .value
        .toLowerCase();

    const categoryValue =
        document.getElementById("category").value;

    let filtered = allProducts.filter(product =>
        product.title.toLowerCase().includes(searchValue)
    );

    if (categoryValue !== "all") {
        filtered = filtered.filter(product =>
            product.category === categoryValue
        );
    }

    displayProducts(filtered);
}

function addToCart(productId) {
    const product = allProducts.find(item => item.id === productId);

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * 83 * item.quantity;
        count += item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">

                <div class="cart-item-info">
                    <strong>${item.title}</strong>
                    <p>₹${Math.round(item.price * 83)}</p>

                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                    ${item.quantity}
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>

                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    Remove
                </button>
            </div>
        `;
    });

    cartCount.innerText = count;
    cartTotal.innerText = Math.round(total);
}

function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

document
    .getElementById("search")
    .addEventListener("input", filterProducts);

document
    .getElementById("category")
    .addEventListener("change", filterProducts);

document
    .getElementById("cartButton")
    .addEventListener("click", () => {
        document.getElementById("cartPanel").classList.remove("hidden");
    });

document
    .getElementById("closeCart")
    .addEventListener("click", () => {
        document.getElementById("cartPanel").classList.add("hidden");
    });

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";
    });
}

getProducts();