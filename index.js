const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

let orders = [
    { id: "001", user: "joyjie", address: "Prachin", phone: "08xxxxxxxx", flower: "กุหลาบแดง", cost: 50, quantity: 2, total: 100, status: "complete", time: "2025-02-11 18:00" },
    { id: "002", user: "Nice", address: "Bangkok", phone: "08xxxxxxxx", flower: "กุหลาบขาว", cost: 150, quantity: 3, total: 150, status: "complete", time: "2025-02-11 17:50" },
    { id: "003", user: "Pun", address: "chonburi", phone: "09xxxxxxxx", flower: "กุหลาบแดง", cost: 500, quantity: 5, total: 250, status: "Pending", time: "2025-02-11 11:00" }
];

// 📌 ดึงข้อมูลรายการสั่งซื้อ
app.get("/api/orders", (req, res) => {
    res.json(orders);
});

// 📌 เพิ่มคำสั่งซื้อใหม่
app.post("/api/orders", (req, res) => {
    const newOrder = req.body;
    // คำนวณ total จาก cost และ quantity
    newOrder.total = newOrder.cost * newOrder.quantity;
    // เพิ่มคำสั่งซื้อใหม่เข้าไปใน orders
    orders.push(newOrder);
    console.log("📌 คำสั่งซื้อที่เพิ่ม:", newOrder); // ✅ ตรวจสอบข้อมูลที่รับเข้ามา
    res.json({ message: "Order added successfully!", order: newOrder });
});

// 📌 แก้ไขคำสั่งซื้อ
app.put("/api/orders/:id", (req, res) => {
    const { id } = req.params;
    let updatedOrder = req.body;
    updatedOrder.total = updatedOrder.cost * updatedOrder.quantity;  // คำนวณ total ใหม่
    console.log(`📌 กำลังอัปเดตคำสั่งซื้อ ID: ${id}`, updatedOrder); // ✅ ดูข้อมูลที่ถูกแก้ไข
    orders = orders.map(order => (order.id === id ? updatedOrder : order));
    res.json({ message: "Order updated successfully!", order: updatedOrder });
});

// 📌 ลบคำสั่งซื้อ
app.delete("/api/orders/:id", (req, res) => {
    const { id } = req.params;
    console.log(`🗑️ กำลังลบคำสั่งซื้อ ID: ${id}`); // ✅ ดูว่า ID ไหนถูกลบ
    orders = orders.filter(order => order.id !== id);
    res.json({ message: "Order deleted successfully!" });
});

// 📌 ดึงข้อมูลคำสั่งซื้อโดย ID
app.get("/api/orders/:id", (req, res) => {
    const { id } = req.params;
    const order = orders.find(order => order.id === id);
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
});
