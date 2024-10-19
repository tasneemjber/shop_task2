const getCategories = async () => {
    const { data } = await axios.get('https://dummyjson.com/products/categories');
    return data;
};

const displayCategories = async () => {
    const loader = document.querySelector(".loader-container");
    loader.classList.add("active");
    try {
        const categories = await getCategories();
        const result = categories.map((category) => {
            return `<div class='category'>
                <h2>${category}</h2>
                <a href='categoryDetails.html?category=${category}'>Details</a>
            </div>`;
        }).join(' ');
        document.querySelector(".categories .row").innerHTML = result;
    } catch (error) {
        document.querySelector(".categories .row").innerHTML = "<p>Error loading categories</p>";
    } finally {
        loader.classList.remove("active");
    }
};

const getProducts = async (page) => {
    const skip = (page - 1) * 30; // Adjusted to 30 products per page
    const { data } = await axios.get(`https://dummyjson.com/products?limit=30&skip=${skip}`);
    return data;
};

const displayProducts = async (page = 1) => {
    const loader = document.querySelector(".loader-container");
    loader.classList.add("active");
    try {
        const data = await getProducts(page);
        const numberOfPages = Math.ceil(data.total / 30);

        const result = data.products.map((product) => {
            return `
                <div class='product'>
                    <img src="${product.thumbnail}" alt="${product.description}" />
                    <h3>${product.title}</h3>
                    <span>${product.price}</span>
                </div>
            `;
        }).join(' ');
        document.querySelector(".products .row").innerHTML = result;

        let paginationLinks = ``;

        // Previous page button
        if (page == 1) {
            paginationLinks += `<li class="page-item"><button class="page-link" disabled>&laquo;</button></li>`;
        } else {
            paginationLinks += `<li class="page-item"><button onclick="displayProducts(${page - 1})" class="page-link">&laquo;</button></li>`;
        }

        // Page number buttons
        for (let i = 1; i <= numberOfPages; i++) {
            paginationLinks += `<li class="page-item ${i == page ? 'active' : ''}"><button onclick="displayProducts(${i})" class="page-link">${i}</button></li>`;
        }

        // Next page button
        if (page == numberOfPages) {
            paginationLinks += `<li class="page-item"><button class="page-link" disabled>&raquo;</button></li>`;
        } else {
            paginationLinks += `<li class="page-item"><button onclick="displayProducts(${page + 1})" class="page-link">&raquo;</button></li>`;
        }

        document.querySelector(".pagination").innerHTML = paginationLinks;

    } catch (error) {
        document.querySelector(".products .row").innerHTML = "<p>Error loading products</p>";
    } finally {
        loader.classList.remove("active");
    }
};


displayCategories();
displayProducts();

window.onscroll = function () {
    const nav = document.querySelector(".header");
    const categories = document.querySelector(".products");
    if (window.scrollY > categories.offsetTop) {
        nav.classList.add("scrollNavbar");
    } else {
        nav.classList.remove("scrollNavbar");
    }
};
