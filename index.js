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
    orders.push(newOrder);
    res.json({ message: "Order added successfully!", order: newOrder });
});

// 📌 ลบคำสั่งซื้อ
app.delete("/api/orders/:id", (req, res) => {
    const { id } = req.params;
    orders = orders.filter(order => order.id !== id);
    res.json({ message: "Order deleted successfully!" });
});

// 📌 แก้ไขคำสั่งซื้อ
app.put("/api/orders/:id", (req, res) => {
    const { id } = req.params;
    const updatedOrder = req.body;
    orders = orders.map(order => (order.id === id ? updatedOrder : order));
    res.json({ message: "Order updated successfully!", order: updatedOrder });
});

app.post("/api/orders", (req, res) => {
  const newOrder = req.body;
  console.log("📌 คำสั่งซื้อที่เพิ่ม:", newOrder); // ✅ ตรวจสอบข้อมูลที่รับเข้ามา
  orders.push(newOrder);
  res.json({ message: "Order added successfully!", order: newOrder });
});

app.put("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const updatedOrder = req.body;
  console.log(`📌 กำลังอัปเดตคำสั่งซื้อ ID: ${id}`, updatedOrder); // ✅ ดูข้อมูลที่ถูกแก้ไข
  orders = orders.map(order => (order.id === id ? updatedOrder : order));
  res.json({ message: "Order updated successfully!", order: updatedOrder });
});

app.delete("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ กำลังลบคำสั่งซื้อ ID: ${id}`); // ✅ ดูว่า ID ไหนถูกลบ
  orders = orders.filter(order => order.id !== id);
  res.json({ message: "Order deleted successfully!" });
});


