populateSpecials(dbData.items.specials);
    populateProducts(dbData.items.products);

    new Glide('.specials', {
        type: 'carousel',
        perView: 1,
        gap: 10
    }).mount();
    
    new Glide('.products', {
        type: 'carousel',
        perView: 3,
        gap: 10
    }).mount();
});

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

function populateSpecials(specials) {
    const specialsSection = document.getElementById("specials");
    specials.forEach(special => {
        const li = document.createElement("li");
        li.classList.add("glide__slide");
        li.appendChild(createMenuItem(special));
        specialsSection.appendChild(li);
    });
}

function populateProducts(products) {
    const productsSection = document.getElementById("products");
    Object.entries(products).forEach(([categoryName, categoryData]) => {
        const li = document.createElement("li");
        li.classList.add("glide__slide");
        li.appendChild(createCategorySection(categoryName, categoryData));
        productsSection.appendChild(li);
    });
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
