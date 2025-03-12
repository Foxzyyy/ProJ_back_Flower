
// ✅ โหลดสินค้าทั้งหมด
async function fetchProducts() {
    const res = await fetch("http://localhost:3000/products");
    const products = await res.json();
    document.getElementById("productList").innerHTML = products.map((product, index) => `
        <div class="product-card">
            <img src="${product.image}" width="200" height="200" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <p>Quantity: ${product.stroage}</p>
            <input type="number" class="numbuy" placeholder="Enter number">
            <button onclick="openPopup('${product.name}', ${product.price}, ${index})">➕ buy</button>
        </div>
    `).join("");
}


// ✅ เพิ่มสินจำนวนสินค้าที่ซื้อ
async function openPopup(name, price, index) {
    const numbuyElements = document.getElementsByClassName("numbuy");
    const numbuy = numbuyElements[index] ? numbuyElements[index].value : null;

    if (!numbuy || numbuy <= 0) {
        alert("กรุณากรอกจำนวนที่ต้องการซื้อ");
        return;
    }

    const total = numbuy * price;

    await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namef: name, numbuy, cost: price, total, status: "incomplete" })
    });
    

    alert("✅ คำสั่งซื้อสำเร็จ!");
}



// ✅ โหลดสินค้าตอนเปิดหน้าเว็บ
fetchProducts();




// login-------------------------------------------------------------------------------------

document.getElementById("openLogin").addEventListener("click", function () {
    document.getElementById("loginPopup").style.display = "flex";
});

document.querySelector(".close").addEventListener("click", function () {
    document.getElementById("loginPopup").style.display = "none";
});

// ปิด Popup เมื่อคลิกนอกหน้าต่าง
window.onclick = function (event) {
    const popup = document.getElementById("loginPopup");
    if (event.target === popup) {
        popup.style.display = "none";
    }
};

// ส่งฟอร์ม Login
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();

if (response.ok) {
    alert("✅ Login successful!");
    document.getElementById("loginPopup").style.display = "none";
    window.location.replace("onwer.html");
} else {
    document.getElementById("loginMessage").innerText = "❌ " + result.message;
}
    
});

