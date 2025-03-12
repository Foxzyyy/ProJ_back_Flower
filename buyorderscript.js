
async function fetchbuy() {
    const res = await fetch("http://localhost:3000/orders");
    const buyorders = await res.json();
    
    const productBuyContainer = document.getElementById("productbuy");


    productBuyContainer.innerHTML = buyorders.map(order => `
        <div class="product-card">
             <h2>ชื่อ: ${order.namef}</h2>
            <h2>จำนวน: ${order.numbuy}</h2>
            <h2>ราคา: ${order.cost}</h2>
            <p>ราคารวม: ${order.total} บาท</p>
            <p>สถานะ: ${order.status}</p>
            <p>วันที่สั่งซื้อ: ${order.buy_at}</p>
            <button class="edit-btn" onclick="editorder(${order.id},'${order.namef}', ${order.numbuy},${order.cost},${order.total})">✏️ Edit</button>
            <button class="delete-btn" onclick="deleteorder(${order.id})">🗑️ Delete</button>
        </div>    
    `).join("");
}
// ✅ ลบสินค้า
async function deleteorder(id) {
    if (!confirm("คุณต้องการลบคำสั่งซื้อนี้ใช่หรือไม่?")) {
        return;
    }

    const response = await fetch(`http://localhost:3000/orders/${id}`, { method: "DELETE" });

    if (response.ok) {
        alert("Order deleted successfully!");
        fetchbuy();
    } else {
        alert("Failed to delete order");
    }
}

// ✅ แก้ไขสินค้า
async function editorder(id, name, numbuy, cost, total) {
    const newNumbuy = prompt("Enter new quantity:", numbuy);

    if (!newNumbuy || isNaN(newNumbuy) || newNumbuy <= 0) {
        alert("กรุณากรอกจำนวนที่ถูกต้อง");
        return;
    }

    const totalNew = newNumbuy * cost;

    try {
        const response = await fetch(`http://localhost:3000/orders/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ namef: name, numbuy: newNumbuy, cost, total: totalNew, status: "incomplete" })
        });

        if (!response.ok) {
            throw new Error("ไม่สามารถอัปเดตข้อมูลได้");
        }

        alert("Order updated successfully!");
        fetchbuy();
    } catch (error) {
        alert("❌ มีข้อผิดพลาด: " + error.message);
    }
}


// ✅ โหลดสินค้าตอนเปิดหน้าเว็บ
fetchbuy();
// ✅ เพิ่มข้อมูลลูกค้า
document.getElementById("openPopup").addEventListener("click", function() {
    document.getElementById("popup").style.display = "block";
});

document.getElementById("closePopupCustomer").addEventListener("click", function() {
    document.getElementById("popup").style.display = "none";
});

document.getElementById("customerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const phone = document.getElementById("phone").value;

    const response = await fetch("http://localhost:3000/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_name: name, address, phone }) 
    });

    if (response.ok) {
        alert("✅ เพิ่มข้อมูลลูกค้าเรียบร้อย");
        document.getElementById("popup").style.display = "none";
        fetchCustomers();
    } else {
        alert("❌ มีข้อผิดพลาดในการเพิ่มข้อมูล");
    }
});

async function fetchCustomers() {
    const res = await fetch("http://localhost:3000/customers");
    const customers = await res.json();
    const customerList = document.getElementById("customerList");

    customerList.innerHTML = customers.map(customer => `
        <div class="product-card">
            <h2>ชื่อ: ${customer.customer_name}</h2>
            <h2>ที่อยู่: ${customer.address}</h2>
            <h2>เบอร์โทร: ${customer.phone}</h2>
            <button class="edit-btn" onclick="editcustomer(${customer.id}, '${customer.customer_name}', '${customer.address}', ${customer.phone})">✏️ Edit</button>
            <button class="delete-btn" onclick="deletcustomer(${customer.id})">🗑️ Delete</button>
        </div>
    `).join("");
}

// ✅ ลบที่อยู่
async function deletcustomer(id) {
    if (!confirm("คุณต้องการลบคำสั่งซื้อนี้ใช่หรือไม่?")) {
        return;
    }

    const response = await fetch(`http://localhost:3000/customers/${id}`, { method: "DELETE" });

    if (response.ok) {
        alert("Order deleted successfully!");
        fetchCustomers();
    } else {
        alert("Failed to delete order");
    }
}
// ✅ แก้ไขลูกค้า
async function editcustomer(id, name, address, phone) {
    const customer_name = prompt("Enter new name:", name);
    const newAddress = prompt("Enter new address:", address);
    const newPhone = prompt("Enter new phone:", phone);

    if (!customer_name || !newAddress || !newPhone || isNaN(newPhone)) {
        alert("❌ กรุณากรอกข้อมูลให้ถูกต้อง");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/customers/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customer_name, address: newAddress, phone: parseInt(newPhone) })
        });

        if (!response.ok) {
            throw new Error("ไม่สามารถอัปเดตข้อมูลได้");
        }

        alert("✅ อัปเดตข้อมูลลูกค้าเรียบร้อย");
        fetchCustomers();
    } catch (error) {
        alert("❌ มีข้อผิดพลาด: " + error.message);
    }
}

// แสดง Popup และไปหน้าถัดไป
document.addEventListener("DOMContentLoaded", function() {
    const confirmBtn = document.getElementById("confirmBtn");
    const closePopupCustomer = document.getElementById("closePopupCustomer");
    const closePopupConfirm = document.getElementById("closePopupConfirm");
    const nextPageBtn = document.getElementById("nextPageBtn");
    const popupCustomer = document.getElementById("popup");
    const popupConfirm = document.getElementById("popupf");

    if (!confirmBtn || !closePopupCustomer || !closePopupConfirm || !nextPageBtn || !popupCustomer || !popupConfirm) {
        console.error("❌ Popup elements not found");
        return;
    }

    // กดปุ่ม "ยืนยัน" แล้วแสดง Popup
    confirmBtn.addEventListener("click", function() {
        popupConfirm.style.display = "block";
    });

    // ปิด Popup เพิ่มลูกค้า
    closePopupCustomer.addEventListener("click", function() {
        popupCustomer.style.display = "none";
    });

    // ปิด Popup ยืนยัน
    closePopupConfirm.addEventListener("click", function() {
        popupConfirm.style.display = "none";
    });

    // ไปหน้าถัดไป
    nextPageBtn.addEventListener("click", function() {
        


        window.location.href = "bill.html";
    });
});





// โหลดข้อมูลลูกค้าเมื่อเปิดหน้าเว็บ
fetchCustomers();
