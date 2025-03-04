require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json()); // ให้ Express อ่าน JSON ได้

// ข้อมูลหนังสือเริ่มต้น 3 เล่ม
let books = [
  { 
    id: 1,
    title: "Headshot",
    author: "conan" },

  { id: 2,
    title: "kaitokid",
    author: "Kaito" },

  { id: 3,
    title: "Doraemon",
    author: "nobita" },
];

//  ดึงหนังสือทั้งหมด
app.get("/books", (req, res) => {
  res.json(books);
});

//  ดึงหนังสือตาม ID
app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send({ error: "Book not found" });
  res.json(book);
});

//  เพิ่มหนังสือใหม่
app.post("/books", (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).send({ error: "Title and Author are required" });
  }

  const book = {
    id: books.length + 1,
    title,
    author,
  };
  books.push(book);
  res.status(201).json(book);
});

//  แก้ไขข้อมูลหนังสือ
app.put("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send({ error: "Book not found" });

  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).send({ error: "Title and Author are required" });
  }

  book.title = title;
  book.author = author;
  res.json(book);
});

//  ลบหนังสือ
app.delete("/books/:id", (req, res) => {
  const bookIndex = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (bookIndex === -1) return res.status(404).send({ error: "Book not found" });

  const deletedBook = books.splice(bookIndex, 1);
  res.json(deletedBook[0]);
});

// เริ่มรันเซิร์ฟเวอร์
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}...`));