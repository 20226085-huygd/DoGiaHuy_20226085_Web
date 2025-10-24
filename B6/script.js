document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element Selection ---
  const searchInput = document.getElementById("search-input");
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
      // Check if not just '[]'
      products = JSON.parse(savedProducts);
    } else {
      try {
        const response = await fetch("products.json");
        if (!response.ok) throw new Error("Network response was not ok");
        const defaultProducts = await response.json();
        products = defaultProducts;
        saveProductsToLocalStorage();
      } catch (error) {
        console.error("Could not fetch initial products:", error);
        productList.innerHTML =
          "<p>Lỗi khi tải sản phẩm. Vui lòng thử lại.</p>";
      }
    }
  };

  // --- Rendering ---

  /**
   * Renders all products from the `products` array to the DOM.
   */
  const renderProducts = () => {
    productList.innerHTML = "";
    const query = searchInput.value.toLowerCase().trim();
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );

    if (filteredProducts.length === 0) {
      productList.innerHTML = "<p>Không tìm thấy sản phẩm nào.</p>";
      return;
    }

    filteredProducts.forEach((product) => {
      const productElement = createProductElement(
        product.name,
        product.price,
        product.desc,
        product.imgUrl
      );
      productList.appendChild(productElement);
    });
  };

  /**
   * Creates and returns a new product article element.
   */
  const createProductElement = (name, price, desc, imgUrl) => {
    const newProduct = document.createElement("article");
    newProduct.className = "product-item";
    newProduct.innerHTML = `
      <img class="product-image" src="${imgUrl}" alt="Bìa minh họa ${name}" />
      <div class="product-content">
        <h3 class="product-name">${name}</h3>
        <p class="product-desc">${desc}</p>
        <p class="product-price">${Number(price).toLocaleString("vi-VN")}₫</p>
      </div>`;
    return newProduct;
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

    const newProduct = { name, price, desc, imgUrl };
    products.unshift(newProduct);
    saveProductsToLocalStorage();
    renderProducts();
    addProductForm.reset();
    toggleAddForm();
  };

  // --- Initialization ---

  const init = async () => {
    searchInput.addEventListener("input", renderProducts);
    toggleFormBtn.addEventListener("click", toggleAddForm); // Fixed function name
    cancelBtn.addEventListener("click", () => {
      addProductForm.reset();
      toggleAddForm();
    });
    addProductForm.addEventListener("submit", handleAddProduct);

    // Asynchronously load initial data and then render it
    await loadProducts();
    renderProducts();
  };

  init();
});
