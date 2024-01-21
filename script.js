async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const dbUrl = 'http://localhost:3000/items'; 
    const dbData = await fetchData(dbUrl);

    if (!dbData) {
        console.error('No data fetched from the server');
        return;
    }

    let cart = [];
    let currentOpenDropdown = null;

    function showOrderMessage() {
        alert("Your order is on your way!");
    }

    function clearCart() {
        cart = [];
        updateCartCount();
    }

    function checkout() {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }
        showOrderMessage();
        clearCart();
    }

    function updateCartDropdown() {
        const cartDropdown = document.getElementById('cart-dropdown');
        cartDropdown.innerHTML = '';

        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerText = item.name;
            cartDropdown.appendChild(itemDiv);
        });

        if (cart.length > 0) {
            const checkoutButton = document.createElement('button');
            checkoutButton.innerText = 'Checkout';
            checkoutButton.onclick = checkout;
            checkoutButton.style = "margin-top: 10px;"; 
            cartDropdown.appendChild(checkoutButton);
        }
    }

    function updateCartCount() {
        document.getElementById('cart').firstChild.nodeValue = `Cart (${cart.length})`;
        updateCartDropdown();
    }

    function addToCart(item) {
        cart.push(item);
        updateCartCount();
    }

    function createAddToCartButton(item) {
        const button = document.createElement('button');
        button.innerText = 'Add to Basket';
        button.addEventListener('click', () => addToCart(item));
        return button;
    }

    function toggleDropdown(id) {
        const element = document.getElementById(id);
        if (currentOpenDropdown && currentOpenDropdown !== element) {
            currentOpenDropdown.style.display = 'none';
        }
        if (element.style.display === 'none' || !element.style.display) {
            element.style.display = 'block';
            currentOpenDropdown = element;
        } else {
            element.style.display = 'none';
            currentOpenDropdown = null;
        }
    }

    function loadSpecials() {
        if (!dbData.specials) {
            console.error('Specials data is not available');
            return;
        }
        const specials = dbData.specials;
        const specialsSection = document.getElementById('specials');

        specials.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'specials-card';
            itemDiv.innerHTML = `
                <img src="${item.image_url}" alt="${item.name}">
                <div class="details-section">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            const addToCartButton = createAddToCartButton(item);
            itemDiv.appendChild(addToCartButton);
            specialsSection.appendChild(itemDiv);
        });
    }

    function loadMenu() {
        if (!dbData.products) {
            console.error('Products data is not available');
            return;
        }
        const menu = dbData.products;
        const categoryButtonsContainer = document.createElement('div');
        categoryButtonsContainer.className = 'category-buttons';

        const categoryDropdownsContainer = document.createElement('div');
        categoryDropdownsContainer.className = 'category-dropdowns';

        const menuSection = document.getElementById('products');
        menuSection.appendChild(categoryButtonsContainer);
        menuSection.appendChild(categoryDropdownsContainer);

        for (const category in menu) {
            const categoryButton = document.createElement('button');
            categoryButton.innerHTML = `${category} <i class="fa-solid fa-circle-chevron-down"></i>`
            categoryButton.onclick = () => toggleDropdown(category);
            categoryButtonsContainer.appendChild(categoryButton);

            const categoryDiv = document.createElement('div');
            categoryDiv.id = category;
            categoryDiv.className = 'dropdown-content';
            categoryDiv.style.display = 'none';

            menu[category].menu_items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = "products-container"
                itemDiv.innerHTML = `
                <div class="products-card">
                <img src="${item.image_url}" alt="${item.name}">
                    <h4>${item.name}</h4>
                    <p>Price: 2.30$</p>
                    
                </div>
                
                `;
                // <button onclick="createAddToCartButton(item)">Add to Basket</button>
                const addToCartButton = createAddToCartButton(item);
                itemDiv.appendChild(addToCartButton);
                categoryDiv.appendChild(itemDiv);
            });

            categoryDropdownsContainer.appendChild(categoryDiv);
        }
    }

    loadSpecials();
    loadMenu();

    document.getElementById('cart').addEventListener('click', () => {
        const cartDropdown = document.getElementById('cart-dropdown');
        cartDropdown.style.display = cartDropdown.style.display === 'none' ? 'block' : 'none';
    });
});

