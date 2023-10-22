const titleInp = document.querySelector("#title");
const searchInput = document.getElementById("searchInput");
const descriptionInp = document.querySelector("#description");
const priceInp = document.querySelector("#price");
const form = document.querySelector(".form");
const updateBtn = document.querySelector("#update");
const products = document.querySelector(".products");
const categorySelect = document.querySelector("#categorySelect");
const categories = document.querySelectorAll("#category");
const filterSelect = document.querySelector("#filter");

let allProducts = [];

const cartModal = document.querySelector("#cartModal");
const cartContent = document.querySelector("#cartContent");
const openCartButton = document.querySelector("#openCart");
const closeCartButton = document.querySelector("#closeCart");
async function getData(category, sortType) {
  const response = await fetch(
    `http://localhost:3000/products${category ? "?" + `category=${category}` : ""}`,
  );
  const data = await response.json();
  allProducts = data;
  displayData(data, sortType);
}

function sortProducts(products, sortType) {
  return products.sort((a, b) => {
    if (sortType === "cheaper") {
      return Number(a.price) - Number(+b.price);
    } else {
      return Number(a.price) + Number(+b.price);
    }
  });
}

async function displayFilteredData(filteredData) {
  products.innerHTML = "";
  filteredData.forEach((item, i) => {
    products.innerHTML += `
                <div class="product">
                    <img src='${item.image}' />
                    <h2>${item.title}</h2>
                    <p>${item.description}</p>
                    <b>${item.price}</b>
                    <button id="${item.id}" class="btn">Edit</button>
                </div>
            `;
  });
}

function displayData(data, sortType) {
  products.innerHTML = "";
  sortProducts(data, sortType)
    .forEach((item, i) => {
      products.innerHTML += `
            <div class="product">
              <img src='${item.image}' />
              <h2>${item.title}</h2>
              <p>${item.description}</p>
              <b>${item.price}</b>
              <button id="${item.id}" class="btn">Edit</button>
              <button id="addToCart${item.id}" class="btn">Add to Cart</button>
            </div>
          `;
    });
    data.forEach((item) => {
      const addToCartButton = document.querySelector(`#addToCart${item.id}`);
      addToCartButton.addEventListener("click", () => {
        addToCart(item);
      });
    });
  
  const btns = document.querySelectorAll(".btn");
  btns.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(button.id);
      const existingItem = data?.find((item) => +item.id === +button.id);
      editProduct(existingItem);
    });
  });
  console.log(btns);
}

getData();

searchInput.addEventListener("input", function (event) {
  const searchString = event.target.value.trim().toLowerCase();
  const filteredProducts = allProducts.filter((product) =>
    product.title.toLowerCase().includes(searchString),
  );
  displayFilteredData(filteredProducts);
});

categorySelect.addEventListener("change", (e) => {
  e.preventDefault();
  getData(e.target.value);
});

filterSelect.addEventListener("change", (e) => {
  e.preventDefault();
  getData("", e.target.value);
});

function editProduct(item) {
  console.log(item);
  titleInp.value = item?.title;
  descriptionInp.value = item?.description;
  priceInp.value = item?.price;

  updateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    updateProduct(item.id);
  });
}

function updateProduct(id) {
  const obj = {
    id: id,
    title: titleInp.value,
    price: +priceInp.value,
    description: descriptionInp.value,
  };
  fetch(`http://localhost:3000/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then((res) => res.json())
    .then((json) => console.log(json));
  getData();
}


openCartButton.addEventListener("click", () => {
  cartModal.style.display = "block";
  displayCart();
});


closeCartButton.addEventListener("click", () => {
  cartModal.style.display = "none";
});


function addToCart(item) {
  cart.push(item);
  displayCart();
}


function displayCart() {
  cartContent.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <p>Price: $${item.price}</p>
    `;
    cartContent.appendChild(cartItem);

   
  });

}