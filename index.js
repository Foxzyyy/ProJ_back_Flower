require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());  // อนุญาตให้ Frontend (port 5000) เรียก API ได้
app.use(express.json()); // ให้ Express อ่าน JSON ได้

// ข้อมูลหนังสือเริ่มต้น
let books = [
  { id: 1, title: "Headshot", author: "Conan" },
  { id: 2, title: "Kaito Kid", author: "Kaito" },
  { id: 3, title: "Doraemon", author: "Nobita" },
];

// ดึงหนังสือทั้งหมด
app.get("/books", (req, res) => {
  res.json(books);
});

// เพิ่มหนังสือใหม่
app.post("/books", (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) return res.status(400).send({ error: "กรุณากรอกข้อมูลให้ครบ" });

  const newBook = { id: books.length + 1, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

// แก้ไขหนังสือ
app.put("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send({ error: "ไม่พบหนังสือ" });

  const { title, author } = req.body;
  if (!title || !author) return res.status(400).send({ error: "กรุณากรอกข้อมูลให้ครบ" });

  book.title = title;
  book.author = author;
  res.json(book);
});

// ลบหนังสือ
app.delete("/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send({ error: "ไม่พบหนังสือ" });

  const deletedBook = books.splice(index, 1);
  res.json(deletedBook[0]);
});

// รันเซิร์ฟเวอร์ที่ port 3000
const port = 3000;
app.listen(port, () => console.log(`Litening at http://localhost:${port}`));