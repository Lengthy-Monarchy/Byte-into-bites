// Fetch data from URL.
async function fetchData(url) {
    try {
        const response = await fetch(url);

        // Checks if the response is not successful, throws error. (debugging)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // JSON response if successful.
        return await response.json();
    } catch (error) {
        // More debugging
        console.error('Error fetching data:', error);
    }
}

// Add an event listener to fetch data.
document.addEventListener('DOMContentLoaded', async () => {
    const dbUrl = 'http://localhost:3000/items'; 
    // Fetches data from the database and awaits its response.
    const dbData = await fetchData(dbUrl);

    // Debugging
    if (!dbData) {
        console.error('No data fetched from the server');
        return;
    }

    // Empty array to represent the shopping cart.
    let cart = [];
    // Variable for current dropdown menu
    let currentOpenDropdown = null;

    // Show a message when an order is placed.
    function showOrderMessage() {
        alert("Your order is on your way!");
    }

    // Clear the shopping cart.
    function clearCart() {
        cart = [];
        // Update the cart count display.
        updateCartCount();
    }

    // Checkout process+Order message
    function checkout() {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        showOrderMessage();
        clearCart();
    }

    // Shopping cart dropdown display.
    function updateCartDropdown() {
        const cartDropdown = document.getElementById('cart-dropdown');
        cartDropdown.innerHTML = '';

        // Loop through each item in the cart and display it.
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerText = item.name;
            cartDropdown.appendChild(itemDiv);
        });

        // Add checkout button if the cart is not empty.
        if (cart.length > 0) {
            const checkoutButton = document.createElement('button');
            checkoutButton.innerText = 'Checkout';
            checkoutButton.onclick = checkout;
            checkoutButton.style = "margin-top: 10px;"; 
            cartDropdown.appendChild(checkoutButton);
        }
    }

    // Update cart count display.
    function updateCartCount() {
        document.getElementById('cart').firstChild.nodeValue = `Cart (${cart.length})`;
        updateCartDropdown();
    }

    // Add an item to the cart.
    function addToCart(item) {
        cart.push(item);
        updateCartCount();
    }

    // Create an 'Add to Basket' button.
    function createAddToCartButton(item) {
        const button = document.createElement('button');
        button.innerText = 'Add to Basket';
        button.addEventListener('click', () => addToCart(item));
        return button;
    }

    // Toggle the dropdown menus.
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

    // Load and display special items.
    function loadSpecials() {
        if (!dbData.specials) {
            console.error('Specials data is not available');
            return;
        }
        const specials = dbData.specials;
        const specialsSection = document.getElementById('specials');

        // Loop through each special item and display it with 'Add to Basket' button.
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

    // Load and display products from the database.
    function loadMenu() {
        if (!dbData.products) {
            console.error('Products data is not available');
            return;
        }
        const menu = dbData.products;
        const categoryButtonsContainer = document.createElement('div');
        categoryButtonsContainer.className = 'category-buttons';

        const categoryDropdownsContainer = document.createElement('div');
        categoryDropdownsContainer.className = ('category-dropdowns');

        const menuSection = document.getElementById('products');
        menuSection.appendChild(categoryButtonsContainer);
        menuSection.appendChild(categoryDropdownsContainer);

        // Loop through each category in the menu and create buttons and dropdowns for each.
        for (const category in menu) {
            const categoryButton = document.createElement('button');
            categoryButton.innerHTML = `${category} <i class="fa-solid fa-circle-chevron-down"></i>`
            categoryButton.onclick = () => toggleDropdown(category);
            categoryButtonsContainer.appendChild(categoryButton);

            const categoryDiv = document.createElement('div');
            categoryDiv.id = category;
            categoryDiv.className = 'dropdown-content';
            categoryDiv.style.display = 'none';

            // Loop through each item in the category and display with 'Add to Basket' button.
            menu[category].menu_items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = "products-container"
                itemDiv.innerHTML = `
                <img src="${item.image_url}" alt="${item.name}">
                    <h4>${item.name}</h4>
                    <p>Price: 2.30$</p>                
                `;
                const addToCartButton = createAddToCartButton(item);
                itemDiv.appendChild(addToCartButton);
                categoryDiv.appendChild(itemDiv);
            });

            categoryDropdownsContainer.appendChild(categoryDiv);
        }
    }

    // Load specials and menu items.(call functions)
    loadSpecials();
    loadMenu();

    // Add event listener to the cart to toggle the cart display.
    document.getElementById('cart').addEventListener('click', () => {
        const cartDropdown = document.getElementById('cart-dropdown');
        cartDropdown.style.display = cartDropdown.style.display === 'none' ? 'block' : 'none';
    });
});
