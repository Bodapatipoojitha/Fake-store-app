let allProducts = [];

async function getProducts() {
    const response = await fetch("https://fakestoreapi.com/products");
    allProducts = await response.json();
    displayProducts(allProducts);
}

function displayProducts(products) {
    const container = document.getElementById("products");

    container.innerHTML = "";

    products.forEach(product => {
        container.innerHTML += `
            <div class="card">
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p class="price">$${product.price}</p>
                <p>${product.category}</p>
            </div>
        `;
    });
}

document.getElementById("search").addEventListener("input", function () {
    const value = this.value.toLowerCase();

    const filtered = allProducts.filter(product =>
        product.title.toLowerCase().includes(value)
    );

    displayProducts(filtered);
});

getProducts();