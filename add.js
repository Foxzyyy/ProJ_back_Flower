const API_URL = "http://localhost:3000/books"; // URL ของ Backend

document.getElementById("add-book-form").addEventListener("submit", async function(e) {
  e.preventDefault(); // ป้องกันไม่ให้ฟอร์มส่งข้อมูลในแบบดั้งเดิม

  // รับค่าจากฟอร์ม
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;

  // ตรวจสอบว่ากรอกข้อมูลครบถ้วนแล้ว
  if (!title || !author) {
    return alert("กรุณากรอกข้อมูลให้ครบ");
  }

  try {
    // ส่งคำขอ POST เพื่อเพิ่มหนังสือใหม่
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author })
    });

    if (!res.ok) {
      throw new Error("เพิ่มหนังสือไม่สำเร็จ");
    }

    alert("เพิ่มหนังสือสำเร็จ!");
    // หลังจากเพิ่มหนังสือแล้ว เปลี่ยนกลับไปที่หน้า index.html
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error:", error);
    alert("เกิดข้อผิดพลาดในการเพิ่มหนังสือ");
  }
});