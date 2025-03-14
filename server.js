const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const db = new sqlite3.Database("shop.db");

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // ให้สามารถเข้าถึงไฟล์ frontend ได้

// ✅ สร้างตารางสินค้า (Product)
db.run(`
  CREATE TABLE IF NOT EXISTS product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT NOT NULL,
    name TEXT NOT NULL,
    stroage INTEGER NOT NULL,
    price INTEGER NOT NULL
  )
`);

// ✅ สร้างตารางลูกค้า (Customer)
db.run(`
  CREATE TABLE IF NOT EXISTS customer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone INTEGER NOT NULL
  )
`);

// ✅ สร้างตารางคำสั่งซื้อ (BuyOrder)
db.run(`
  CREATE TABLE IF NOT EXISTS buyorder (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    namef TEXT NOT NULL,
    numbuy INTEGER NOT NULL,
    cost INTEGER NOT NULL,
    total INTEGER NOT NULL,
    status TEXT NOT NULL,
    buy_at TEXT DEFAULT (DATETIME('now', 'localtime'))
  )
`);

// ✅ สร้างตารางใบเสร็จ (Bill)
db.run(`
  CREATE TABLE IF NOT EXISTS bill (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone INTEGER NOT NULL,
    name TEXT NOT NULL,
    cost INTEGER NOT NULL,
    numbuy INTEGER NOT NULL,
    total INTEGER NOT NULL,
    status TEXT NOT NULL,
    buy_at TEXT DEFAULT (DATETIME('now', 'localtime'))
  )
`);

  // ✅ สร้างตาราง users
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);
db.get("SELECT COUNT(*) as count FROM users", [], (err, row) => {
  if (row.count === 0) {
      db.run("INSERT INTO users (username, password) VALUES ('admin', '1234')");
  }
});




// ✅ ดึงข้อมูลสินค้าทั้งหมด
app.get("/products", (req, res) => {
  db.all("SELECT * FROM product", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// ✅ เพิ่มสินค้าใหม่
app.post("/products", (req, res) => {
  const { image, name, stroage, price } = req.body;
  db.run("INSERT INTO product (image, name, stroage, price) VALUES (?, ?, ?, ?)",
    [image, name, stroage, price],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// ✅ แก้ไขข้อมูลสินค้า
app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { image, name, stroage, price } = req.body;

  db.run(
    "UPDATE product SET image = ?, name = ?, stroage = ?, price = ? WHERE id = ?",
    [image, name, stroage, price, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ updated: this.changes });
    }
  );
});

// ✅ ลบสินค้า
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM product WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

// ✅ ดึงข้อมูลลูกค้าทั้งหมด
app.get("/customers", (req, res) => {
  db.all("SELECT * FROM customer", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// ✅ เพิ่มลูกค้าใหม่
app.post("/customers", (req, res) => {
  let { customer_name, address, phone } = req.body;

  if (!customer_name || !address || !phone || isNaN(phone)) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วนและเบอร์โทรต้องเป็นตัวเลข" });
  }

  phone = parseInt(phone); // ✅ แปลง `phone` เป็นตัวเลข

  db.run("INSERT INTO customer (customer_name, address, phone) VALUES (?, ?, ?)",
      [customer_name, address, phone],
      function (err) {
          if (err) {
              return res.status(500).json({ error: err.message });
          }
          res.json({ message: "✅ เพิ่มข้อมูลลูกค้าเรียบร้อย", customerId: this.lastID });
      }
  );
});

app.put("/customers/:id", (req, res) => {
  const { id } = req.params;
  let { customer_name, address, phone } = req.body;

  if (!customer_name || !address || !phone || isNaN(phone)) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วนและเบอร์โทรต้องเป็นตัวเลข" });
  }

  phone = parseInt(phone); // ✅ แปลง `phone` เป็นตัวเลข

  db.run(
      "UPDATE customer SET customer_name = ?, address = ?, phone = ? WHERE id = ?",
      [customer_name, address, phone, id],
      function (err) {
          if (err) {
              return res.status(500).json({ error: err.message });
          }
          res.json({ message: "✅ อัปเดตข้อมูลลูกค้าเรียบร้อย", updated: this.changes });
      }
  );
});



// ✅ ลบลูกค้า
app.delete("/customers/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM customer WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

// ✅ ดึงข้อมูลคำสั่งซื้อทั้งหมด
app.get("/orders", (req, res) => {
  db.all("SELECT * FROM buyorder", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// ✅ เพิ่มคำสั่งซื้อใหม่
app.post("/orders", (req, res) => {
  const { namef, numbuy, cost } = req.body;

  const numbuyInt = parseInt(numbuy);
  const costInt = parseInt(cost);
  const total = numbuyInt * costInt;
  const status = "complete"; // ✅ กำหนดค่าให้ status

  if (isNaN(numbuyInt) || isNaN(costInt) || numbuyInt <= 0 || costInt <= 0) {
      return res.status(400).json({ error: "ข้อมูลไม่ถูกต้อง" });
  }

  db.run("INSERT INTO buyorder (namef, numbuy, cost, total, status) VALUES (?, ?, ?, ?, ?)",
      [namef, numbuyInt, costInt, total, status],
      function (err) {
          if (err) {
              return res.status(500).json({ error: err.message });
          }
          res.json({ message: "✅ คำสั่งซื้อถูกบันทึกแล้ว", id: this.lastID });
      }
  );
});

// ✅ อัปเดตคำสั่งซื้อ
app.put("/orders/:id", (req, res) => {
  const { id } = req.params;
  const { namef, numbuy, cost, total, status } = req.body;

  const numbuyInt = parseInt(numbuy);
  const costInt = parseInt(cost);
  const totalInt = parseInt(total);

  if (isNaN(numbuyInt) || isNaN(costInt) || isNaN(totalInt) || numbuyInt <= 0) {
      return res.status(400).json({ error: "ข้อมูลไม่ถูกต้อง" });
  }

  db.run(
      "UPDATE buyorder SET namef = ?, numbuy = ?, cost = ?, total = ?, status = ? WHERE id = ?",
      [namef, numbuyInt, costInt, totalInt, status, id],
      function (err) {
          if (err) {
              return res.status(500).json({ error: err.message });
          }
          res.json({ message: "✅ อัปเดตคำสั่งซื้อสำเร็จ", updated: this.changes });
      }
  );
});

// ✅ ลบคำสั่งซื้อ
app.delete("/orders/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM buyorder WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

// ✅ ดึงข้อมูลใบเสร็จทั้งหมด
app.get("/bills", (req, res) => {
  db.all("SELECT * FROM bill", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// ✅ เพิ่มใบเสร็จใหม่
app.post("/bills", (req, res) => {
  const { customer_name, address, phone, name, cost, numbuy, total, status } = req.body;
  db.run(
    "INSERT INTO bill (customer_name, address, phone, name, cost, numbuy, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [customer_name, address, phone, name, cost, numbuy, total, status],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// ✅ ลบใบเสร็จ
app.delete("/bills/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM bill WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});



// 📌 API ลบข้อมูลทั้งหมดใน `customers` และ `buyorder`
app.post("/delete-all", (req, res) => {
  db.run("DELETE FROM customer", (err) => {
      if (err) return res.status(500).json({ error: err.message });
  });

  db.run("DELETE FROM sqlite_sequence WHERE name='customer'", (err) => {
      if (err) return res.status(500).json({ error: err.message });
  });

  db.run("DELETE FROM buyorder", (err) => {
      if (err) return res.status(500).json({ error: err.message });
  });

  db.run("DELETE FROM sqlite_sequence WHERE name='buyorder'", (err) => {
      if (err) return res.status(500).json({ error: err.message });
  });

  res.json({ message: "✅ ลบข้อมูลทั้งหมดเรียบร้อยแล้ว" });
});



  // login----------------------------
// ✅ ตรวจสอบ Login (เก็บรหัสเป็น plaintext)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(401).json({ message: "Invalid username or password" });
      res.json({ message: "Login successful", user });
  });
});


// ✅ เริ่มเซิร์ฟเวอร์
app.listen(3000, () => {
  console.log("Server running on node77368-env-4775217.proen.app.ruk-com.cloud:11651");
});
