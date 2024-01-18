document.addEventListener('DOMContentLoaded', () => {
    const dbUrl = 'http://localhost:3000/items'; 

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

    function createMenuItem(item, isProduct = false) {
        const imageUrl = item.image_url; 
        const menuItem = document.createElement("div");
        menuItem.classList.add("menu-item");

        menuItem.innerHTML = `
            <img src="${imageUrl}" alt="${item.name}">
            <p>${item.description || (isProduct ? '' : 'No description available')}</p>
            <button>Shop Now</button>
        `;

        return menuItem;
    }

    function createCategorySection(categoryName, categoryData) {
        const categorySection = document.createElement("div");
        categorySection.classList.add("category-section");

        const categoryHeader = document.createElement("h2");
        categoryHeader.textContent = categoryName;
        categoryHeader.classList.add("category-header");

        const itemsContainer = document.createElement("div");
        itemsContainer.classList.add("items-container", "hidden");

        const closeButton = document.createElement("button");
        closeButton.textContent = "X";
        closeButton.classList.add("close-button");
        closeButton.onclick = () => itemsContainer.classList.add("hidden");
        itemsContainer.appendChild(closeButton);

        categoryData.menu_items.forEach(item => {
            itemsContainer.appendChild(createMenuItem(item, true));
        });

        categorySection.appendChild(categoryHeader);
        categorySection.appendChild(itemsContainer);
        categoryHeader.addEventListener("click", () => {
            itemsContainer.classList.toggle("hidden");
        });

        return categorySection;
    }

    async function displaySpecialsAndProducts() {
        const dbData = await fetchData(dbUrl);
        if (!dbData) {
            console.error('No data fetched from the server');
            return;
        }

        const specialsSection = document.getElementById("specials");
        dbData.items.specials.forEach(special => {
            specialsSection.appendChild(createMenuItem(special));
        });

        const productsSection = document.getElementById("products");
        Object.entries(dbData.items.products).forEach(([categoryName, categoryData]) => {
            productsSection.appendChild(createCategorySection(categoryName, categoryData));
        });
    }

    function initializeCarouselControls() {
        const carousels = document.querySelectorAll('.carousel');
        carousels.forEach(carousel => {
            const leftControl = carousel.querySelector('.carousel-control.left');
            const rightControl = carousel.querySelector('.carousel-control.right');
    
            leftControl.addEventListener('click', () => {
                carousel.scrollLeft -= 300; 
            });
    
            rightControl.addEventListener('click', () => {
                carousel.scrollLeft += 300; 
            });
        });
    }

    displaySpecialsAndProducts();
    initializeCarouselControls();
})


