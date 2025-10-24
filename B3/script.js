// Wait until the DOM is fully loaded to run the script
document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element Selection ---
  const searchInput = document.getElementById("search-input");
  const productList = document.getElementById("product-list");
  const allProducts = () => productList.getElementsByClassName("product-item");

  const toggleFormBtn = document.getElementById("toggle-add-form-btn");
  const addProductSection = document.getElementById("add-product-section");
  const addProductForm = document.getElementById("add-product-form");
  const cancelBtn = document.getElementById("cancel-btn");
  const errorMessage = document.getElementById("error-message");

  // --- Functions ---

  /**
   * Filters products based on the search query.
   * It's case-insensitive.
   */
  const filterProducts = () => {
    const query = searchInput.value.toLowerCase().trim();
    for (let product of allProducts()) {
      const productName = product
        .querySelector(".product-name")
        .textContent.toLowerCase();
      if (productName.includes(query)) {
        product.style.display = "";
      } else {
        product.style.display = "none";
      }
    }
  };

  /**
   * Toggles the visibility of the "Add Product" form.
   */
  const toggleAddForm = () => {
    const isHidden = addProductSection.classList.toggle("hidden");
    toggleFormBtn.setAttribute("aria-expanded", !isHidden);
    if (!isHidden) {
      // Clear previous errors when showing the form
      errorMessage.textContent = "";
    }
  };

  /**
   * Creates and returns a new product article element.
   * @param {string} name - The product name.
   * @param {string} price - The product price.
   * @param {string} desc - The product description.
   * @param {string} imgUrl - The URL of the product image.
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

  /**
   * Handles the submission of the "Add Product" form.
   * @param {Event} event - The form submission event.
   */
  const handleAddProduct = (event) => {
    event.preventDefault(); // Prevent default page reload

    // Get values from the form
    const name = document.getElementById("p-name").value.trim();
    const price = document.getElementById("p-price").value.trim();
    const desc = document.getElementById("p-desc").value.trim();
    let imgUrl = document.getElementById("p-img").value.trim();

    // --- Validation ---
    if (!name || !price || !desc) {
      errorMessage.textContent = "Vui lòng điền đầy đủ các trường bắt buộc.";
      return;
    }
    if (isNaN(price) || Number(price) <= 0) {
      errorMessage.textContent = "Giá sản phẩm phải là một số lớn hơn 0.";
      return;
    }

    // Use a placeholder if the image URL is empty
    if (!imgUrl) {
      imgUrl = `https://placehold.co/400x250/eee/212529?text=${encodeURIComponent(
        name
      )}`;
    }

    // Create and add the new product
    const newProductElement = createProductElement(name, price, desc, imgUrl);
    productList.prepend(newProductElement); // Adds the new item to the top of the list

    // Reset and hide the form
    addProductForm.reset();
    toggleAddForm();
  };

  // --- Event Listeners ---

  // Live search functionality
  searchInput.addEventListener("input", filterProducts);

  // Toggle form visibility
  toggleFormBtn.addEventListener("click", toggleAddForm);
  cancelBtn.addEventListener("click", () => {
    addProductForm.reset();
    toggleAddForm();
  });

  // Handle new product submission
  addProductForm.addEventListener("submit", handleAddProduct);
});
