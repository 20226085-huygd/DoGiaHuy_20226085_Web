document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element Selection ---
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");
  const productList = document.getElementById("product-list");
  const toggleFormBtn = document.getElementById("toggle-add-form-btn");
  const addProductSection = document.getElementById("add-product-section");
  const addProductForm = document.getElementById("add-product-form");
  const cancelBtn = document.getElementById("cancel-btn");
  const errorMessage = document.getElementById("error-message");

  // --- State Management ---
  let products = []; // Our single source of truth

  /**
   * Saves the current product array to localStorage.
   */
  const saveProductsToLocalStorage = () => {
    localStorage.setItem("products", JSON.stringify(products));
  };

  /**
   * Loads products from localStorage or fetches from a JSON file.
   */
  const loadProducts = async () => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts && savedProducts.length > 2) {
      products = JSON.parse(savedProducts);
    } else {
      try {
        const response = await fetch("products.json");
        if (!response.ok) throw new Error("Network response was not ok");
        const defaultProducts = await response.json();
        products = defaultProducts.map((product, index) => ({
          ...product,
          id: Date.now() + index, // Add unique ID to each product
        }));
        saveProductsToLocalStorage();
      } catch (error) {
        console.error("Could not fetch initial products:", error);
        productList.innerHTML =
          "<p>Lỗi khi tải sản phẩm. Vui lòng thử lại.</p>";
      }
    }
  };

  /**
   * Sorts products based on the selected criteria.
   */
  const sortProducts = (productsToSort) => {
    const sortValue = sortSelect.value;
    const sortedProducts = [...productsToSort];

    switch (sortValue) {
      case "name-asc":
        return sortedProducts.sort((a, b) =>
          a.name.localeCompare(b.name, "vi")
        );
      case "name-desc":
        return sortedProducts.sort((a, b) =>
          b.name.localeCompare(a.name, "vi")
        );
      case "price-asc":
        return sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
      case "price-desc":
        return sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
      default:
        return sortedProducts;
    }
  };

  /**
   * Deletes a product by ID.
   */
  const deleteProduct = (productId) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      products = products.filter((product) => product.id !== productId);
      saveProductsToLocalStorage();
      renderProducts();
    }
  };

  // --- Rendering ---

  /**
   * Renders all products from the `products` array to the DOM.
   */
  const renderProducts = () => {
    productList.innerHTML = "";
    const query = searchInput.value.toLowerCase().trim();
    let filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );

    // Apply sorting
    filteredProducts = sortProducts(filteredProducts);

    if (filteredProducts.length === 0) {
      productList.innerHTML = "<p>Không tìm thấy sản phẩm nào.</p>";
      return;
    }

    filteredProducts.forEach((product) => {
      const productElement = createProductElement(product);
      productList.appendChild(productElement);
    });
  };

  /**
   * Creates and returns a new product article element.
   */
  const createProductElement = (product) => {
    const newProductElement = document.createElement("article");
    newProductElement.className = "product-item";
    newProductElement.innerHTML = `
      <img class="product-image" src="${product.imgUrl}" alt="Bìa minh họa ${
      product.name
    }" />
      <div class="product-content">
        <div class="product-header">
          <h3 class="product-name">${product.name}</h3>
          <button class="delete-btn" onclick="deleteProduct(${
            product.id
          })" aria-label="Xóa sản phẩm ${product.name}">
            ×
          </button>
        </div>
        <p class="product-desc">${product.desc}</p>
        <p class="product-price">${Number(product.price).toLocaleString(
          "vi-VN"
        )}₫</p>
      </div>`;
    return newProductElement;
  };

  // --- Event Handlers ---

  /**
   * Toggles the visibility of the "Add Product" form with animation.
   */
  const toggleAddForm = () => {
    const isVisible = addProductSection.classList.toggle("visible");
    toggleFormBtn.setAttribute("aria-expanded", isVisible);
    if (isVisible) {
      errorMessage.textContent = "";
      document.getElementById("p-name").focus();
    }
  };

  /**
   * Handles the submission of the "Add Product" form.
   */
  const handleAddProduct = (event) => {
    event.preventDefault();
    const name = document.getElementById("p-name").value.trim();
    const price = document.getElementById("p-price").value.trim();
    const desc = document.getElementById("p-desc").value.trim();
    let imgUrl = document.getElementById("p-img").value.trim();

    if (!name || !price || !desc) {
      errorMessage.textContent = "Vui lòng điền đầy đủ các trường bắt buộc.";
      return;
    }
    if (isNaN(price) || Number(price) <= 0) {
      errorMessage.textContent = "Giá sản phẩm phải là một số lớn hơn 0.";
      return;
    }
    if (!imgUrl) {
      imgUrl = `https://placehold.co/400x250/eee/212529?text=${encodeURIComponent(
        name
      )}`;
    }

    const newProduct = {
      id: Date.now(), // Unique ID for new products
      name,
      price,
      desc,
      imgUrl,
    };
    products.unshift(newProduct);
    saveProductsToLocalStorage();
    renderProducts();
    addProductForm.reset();
    toggleAddForm();
  };

  // Make deleteProduct available globally for onclick handlers
  window.deleteProduct = deleteProduct;

  // --- Initialization ---

  const init = async () => {
    searchInput.addEventListener("input", renderProducts);
    sortSelect.addEventListener("change", renderProducts);
    toggleFormBtn.addEventListener("click", toggleAddForm);
    cancelBtn.addEventListener("click", () => {
      addProductForm.reset();
      toggleAddForm();
    });
    addProductForm.addEventListener("submit", handleAddProduct);

    await loadProducts();
    renderProducts();
  };

  init();
});
