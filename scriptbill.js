async function fetchCustomerOrders() {
    try {
        const res = await fetch("http://localhost:3000/orders");
        const buyorders = await res.json();
        const productBuyContainer = document.getElementById("productbuy");

        if (!productBuyContainer) {
            console.error("❌ ไม่พบ element ที่มี id='productbuy'");
            return;
        }

        productBuyContainer.innerHTML = buyorders.map(order => `
            <tr>
                <td>${order.namef}</td>
                <td>${order.cost}</td>
                <td>${order.numbuy}</td>
                <td>${order.total}</td>
                <td>${order.status}</td>
                <td>${order.buy_at}</td>
            </tr>
        `).join("");

    } catch (error) {
        console.error("❌ Error loading customer orders:", error.message);
    }
}

async function fetchCustomer() {
    try {
        const res = await fetch("http://localhost:3000/customers");
        const customers = await res.json();
        const productCustomerContainer = document.getElementById("productcustomer");

        productCustomerContainer.innerHTML = customers.map(customer => `
            <tr>
                <td>${customer.customer_name}</td>
                <td>${customer.address}</td>
                <td>${customer.phone}</td>
            </tr>
        `).join("");

    } catch (error) {
        console.error("❌ Error loading customers:", error.message);
    }
}



// โหลดข้อมูลเมื่อเปิดหน้าเว็บ
document.addEventListener("DOMContentLoaded", function() {
    fetchCustomerOrders();
    fetchCustomer(); // ✅ เรียกใช้งานเพื่อโหลดข้อมูลลูกค้า
});

