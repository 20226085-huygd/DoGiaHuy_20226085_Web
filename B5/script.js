// Wait until the DOM is fully loaded to run the script
document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element Selection ---
  const searchInput = document.getElementById("search-input");
  const productList = document.getElementById("product-list");

  const toggleFormBtn = document.getElementById("toggle-add-form-btn");
  const addProductSection = document.getElementById("add-product-section");
  const addProductForm = document.getElementById("add-product-form");
  const cancelBtn = document.getElementById("cancel-btn");
  const errorMessage = document.getElementById("error-message");

  // --- State Management (Assignment 5) ---
  let products = []; // Our single source of truth for product data

  const defaultProducts = [
    {
      name: "Sách C: Tư duy phản biện",
      price: "110000",
      desc: "Hướng dẫn phát triển tư duy phản biện và ra quyết định sáng suốt.",
      imgUrl: "../B1/images/book1.png",
    },
    {
      name: "Sách B: Kỹ năng học tập hiệu quả",
      price: "95000",
      desc: "Mẹo và phương pháp giúp tối ưu hóa thời gian và cải thiện kết quả học tập.",
      imgUrl: "../B1/images/book2.png",
    },
    {
      name: "Sách A: Lập trình cho người mới bắt đầu",
      price: "120000",
      desc: "Cuốn sách nhập môn giúp bạn nắm vững các khái niệm cơ bản về lập trình.",
      imgUrl: "../B1/images/book3.jpg",
    },
  ];

  /**
   * Saves the current product array to localStorage.
   */
  const saveProductsToLocalStorage = () => {
    localStorage.setItem("products", JSON.stringify(products));
  };

  /**
   * Loads products from localStorage or uses default products.
   */
  const loadProducts = () => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      products = JSON.parse(savedProducts);
    } else {
      products = defaultProducts;
      saveProductsToLocalStorage();
    }
  };

  // --- Rendering ---

  /**
   * Renders all products from the `products` array to the DOM.
   */
  const renderProducts = () => {
    productList.innerHTML = ""; // Clear the list before rendering
    const productsToRender = products.filter((product) => {
      const query = searchInput.value.toLowerCase().trim();
      return product.name.toLowerCase().includes(query);
    });

    if (productsToRender.length === 0) {
      productList.innerHTML = "<p>Không tìm thấy sản phẩm nào.</p>";
      return;
    }

    productsToRender.forEach((product) => {
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
   * @returns {HTMLElement} The new product article element.
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
   * Toggles the visibility of the "Add Product" form.
   */
  const toggleAddForm = () => {
    const isHidden = addProductSection.classList.toggle("hidden");
    toggleFormBtn.setAttribute("aria-expanded", !isHidden);
    if (!isHidden) {
      errorMessage.textContent = "";
      document.getElementById("p-name").focus();
    }
  };

  /**
   * Handles the submission of the "Add Product" form.
   * @param {Event} event - The form submission event.
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

    // Create new product object and add it to the start of our array
    const newProduct = { name, price, desc, imgUrl };
    products.unshift(newProduct);

    // Save the updated array to localStorage and re-render the UI
    saveProductsToLocalStorage();
    renderProducts();

    addProductForm.reset();
    toggleAddForm();
  };

  // --- Initialization ---

  const init = () => {
    // Setup Event Listeners
    searchInput.addEventListener("input", renderProducts);
    toggleFormBtn.addEventListener("click", toggleAddForm);
    cancelBtn.addEventListener("click", () => {
      addProductForm.reset();
      toggleAddForm();
    });
    addProductForm.addEventListener("submit", handleAddProduct);

    // Load initial data and render it
    loadProducts();
    renderProducts();
  };

  init(); // Start the application
});
