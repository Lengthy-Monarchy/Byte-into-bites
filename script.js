document.addEventListener('DOMContentLoaded', () => {
    const dbUrl = 'http://localhost:3000/db.json'; 

    // Fetch data from the JSON file
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

    // Function to create a menu item with a shop now button
    function createMenuItem(item, isProduct = false) {
        const imageUrl = item.imageUrl || item.image_url; // Standardize image URL access
        const menuItem = document.createElement("div");
        menuItem.classList.add("menu-item");

        menuItem.innerHTML = `
            <img src="${imageUrl}" alt="${item.name}">
            <p>${item.description || (isProduct ? '' : 'No description available')}</p>
            <button>Shop Now</button>
        `;

        return menuItem;
    }

    // Function to display specials and products
    async function displaySpecialsAndProducts() {
        const dbData = await fetchData(dbUrl);

        const specialsSection = document.getElementById("specials");
        dbData.specials.forEach(special => {
            specialsSection.appendChild(createMenuItem(special));
        });

        const productsSection = document.getElementById("products");
        Object.entries(dbData.products).forEach(([categoryName, categoryData]) => {
            const categorySection = document.createElement("div");
            categorySection.classList.add("category-section");

            const categoryHeader = document.createElement("h2");
            categoryHeader.textContent = categoryName;
            categoryHeader.classList.add("category-header");

            // Create a container for menu items, initially hidden
            const itemsContainer = document.createElement("div");
            itemsContainer.classList.add("items-container", "hidden");

            categoryData.menu_items.forEach(item => {
                itemsContainer.appendChild(createMenuItem(item, true));
            });

            categorySection.appendChild(categoryHeader);
            categorySection.appendChild(itemsContainer);
            productsSection.appendChild(categorySection);

            // Add click event listener to toggle visibility of items
            categoryHeader.addEventListener("click", () => {
                itemsContainer.classList.toggle("hidden");
            });
                // Function to initialize carousel controls
    function initCarouselControls() {
        const carousels = document.querySelectorAll('.carousel');
        carousels.forEach(carousel => {
            const leftControl = carousel.querySelector('.carousel-control.left');
            const rightControl = carousel.querySelector('.carousel-control.right');

            leftControl.addEventListener('click', () => {
                carousel.scrollLeft -= 300; // Adjust as necessary for your item width + margin
            });

            rightControl.addEventListener('click', () => {
                carousel.scrollLeft += 300; // Adjust as necessary for your item width + margin
            });
        });
    }

    // Call the displaySpecialsAndProducts and initCarouselControls functions
    displaySpecialsAndProducts();
    initCarouselControls();
});

    }

    displaySpecialsAndProducts();