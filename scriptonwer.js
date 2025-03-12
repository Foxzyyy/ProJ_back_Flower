
// ✅ โหลดสินค้าทั้งหมด
async function fetchProducts() {
    const res = await fetch("http://localhost:3000/products");
    const products = await res.json();

    const productList = document.getElementById("productList");
    if (!productList) {
        console.error("❌ ไม่พบ element ที่มี id='productList'");
        return;
    }

    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" width="200" height="200" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <p>Quantity: ${product.stroage}</p>
            <button class="edit-btn" onclick="editProduct(${product.id}, '${product.image}', '${product.name}', ${product.stroage}, ${product.price})">✏️ Edit</button>
            <button class="delete-btn" onclick="deleteProduct(${product.id})">🗑️ Delete</button>
        </div>
    `).join("");
}



// ✅ เพิ่มสินค้าใหม่
document.getElementById("productForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const image = document.getElementById("image").value;
    const name = document.getElementById("name").value;
    const stroage = document.getElementById("stroage").value;
    const price = document.getElementById("price").value;
    
    await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, name, stroage, price })
    });
    fetchProducts();
});
// ✅ ลบสินค้า
async function deleteProduct(id) {
    await fetch(`http://localhost:3000/products/${id}`, { method: "DELETE" });
    fetchProducts();
}
// ✅ แก้ไขสินค้า
async function editProduct(id, oldImage, oldName, oldStroage, oldPrice) {
    const image = prompt("Enter new image URL:", oldImage);
    const name = prompt("Enter new product name:", oldName);
    const stroage = prompt("Enter new quantity:", oldStroage);
    const price = prompt("Enter new price:", oldPrice);

    if (!image || !name || !stroage || !price || isNaN(stroage) || isNaN(price)) {
        alert("Invalid input! Please enter valid values.");
        return;
    }

    await fetch(`http://localhost:3000/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, name, stroage, price })
    });

    fetchProducts();
}



fetchProducts()




