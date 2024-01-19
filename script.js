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

    if (!dbData || !dbData.items) {
        console.error('No data or incorrect data format fetched from the server');
        return;
    }

    let cartCount = 0;

    function updateCartCount() {
        document.getElementById('cart').innerText = `Cart (${cartCount})`;
    }

    function addToCart() {
        cartCount++;
        updateCartCount();
    }

    function toggleDropdown(id) {
        const element = document.getElementById(id);
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }

    function loadSpecials() {
        if (!dbData.items.specials) {
            console.error('Specials data is not available');
            return;
        }
        const specials = dbData.items.specials;
        const specialsSection = document.getElementById('specials');

        specials.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <img src="${item.image_url}" alt="${item.name}">
                <button onclick="addToCart()">Add to Basket</button>
            `;
            specialsSection.appendChild(itemDiv);
        });
    }

    function loadMenu() {
        if (!dbData.items.products) {
            console.error('Products data is not available');
            return;
        }
        const menu = dbData.items.products;
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
                    <button onclick="addToCart()">Add to Basket</button>
                `;
                categoryDiv.appendChild(itemDiv);
            });

            menuSection.appendChild(categoryButton);
            menuSection.appendChild(categoryDiv);
        }
    }

    loadSpecials();
    loadMenu();
});
