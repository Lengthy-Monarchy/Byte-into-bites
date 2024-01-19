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

    console.log(dbData)
    if (!dbData) {
        console.error('No data fetched from the server');
        return;
    }

    let cart = [];

    function updateCartCount() {
        document.getElementById('cart').innerText = `Cart (${cart.length})`;
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
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
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
        const menuSection = document.getElementById('products');

        for (const category in menu) {
            const categoryButton = document.createElement('button');
            categoryButton.innerText = category;
            categoryButton.onclick = () => toggleDropdown(category);

            const categoryDiv = document.createElement('div');
            categoryDiv.id = category;
            categoryDiv.className = 'dropdown-content';
            categoryDiv.style.display = 'none';

            menu[category].menu_items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.innerHTML = `
                    <h4>${item.name}</h4>
                    <img src="${item.image_url}" alt="${item.name}">
                `;
                const addToCartButton = createAddToCartButton(item);
                itemDiv.appendChild(addToCartButton);
                categoryDiv.appendChild(itemDiv);
            });

            menuSection.appendChild(categoryButton);
            menuSection.appendChild(categoryDiv);
        }
    }

    loadSpecials();
    loadMenu();
});
