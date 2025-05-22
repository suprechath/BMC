document.addEventListener("DOMContentLoaded", () => {
  const knowledgeList = document.getElementById("knowledge-list");
  const searchInput = document.getElementById("search-input");
  const pagination = document.getElementById("pagination");

  const articles = [
    { title: "ความแตกต่างระหว่างภาวะซึมเศร้าและความเครียด", content: "ภาวะซึมเศร้ามีลักษณะของความสิ้นหวัง หดหู่..." },
    { title: "วิธีจัดการกับความวิตกกังวลในชีวิตประจำวัน", content: "การหายใจลึก ๆ การทำสมาธิ..." },
    { title: "บทบาทของการนอนหลับต่อสุขภาพจิต", content: "การนอนหลับที่เพียงพอส่งผลต่อ..." },
    { title: "การฝึกสติเพื่อเพิ่มความยืดหยุ่นทางอารมณ์", content: "การฝึกสติช่วยให้เราสังเกตอารมณ์..." },
    { title: "เคล็ดลับการสร้างความสัมพันธ์ที่ดีในครอบครัว", content: "การใช้เวลาอยู่ร่วมกัน..." },
    { title: "อิทธิพลของโซเชียลมีเดียต่อสุขภาพจิต", content: "การใช้โซเชียลมีเดียอย่างต่อเนื่อง..." },
    { title: "ภาวะหมดไฟในการทำงาน: สัญญาณเตือนและวิธีรับมือ", content: "ความเหนื่อยล้าเรื้อรัง..." },
    { title: "การออกกำลังกายกับสุขภาพจิต: เชื่อมโยงอย่างไร?", content: "การออกกำลังกายเป็นประจำ..." },
    { title: "โภชนาการและสุขภาพจิต: สิ่งที่เรากินส่งผลอย่างไร?", content: "อาหารมีผลต่ออารมณ์โดยตรง..." },
    { title: "การรับมือกับการสูญเสีย: ขั้นตอนของการเยียวยาใจ", content: "การยอมรับ การแสดงอารมณ์..." },
    { title: "การตั้งเป้าหมายชีวิตอย่างมีสติ", content: "เป้าหมายที่เชื่อมโยงกับคุณค่า..." },
    { title: "ผลของดนตรีต่ออารมณ์และจิตใจ", content: "การฟังเพลงสามารถลดความเครียด..." },
    { title: "ธรรมชาติกับสุขภาพจิต: เราควรอยู่ใกล้มันมากขึ้นไหม?", content: "การอยู่ใกล้ธรรมชาติ..." },
    { title: "การเขียนบันทึกเพื่อระบายอารมณ์", content: "การเขียนช่วยให้เรารู้เท่าทันความคิด..." },
    { title: "การพัฒนาความเมตตาต่อตนเอง", content: "การให้อภัยตนเอง..." },
    { title: "เทคนิคจัดการความเครียดในที่ทำงาน", content: "การพักผ่อน สื่อสาร และจัดขอบเขต..." },
    { title: "การสร้างเป้าหมายที่เติมเต็มชีวิต", content: "เป้าหมายที่ชัดเจนช่วยเสริมพลังใจ..." },
    { title: "เสริมพลังใจในวันที่อ่อนแอ", content: "การให้กำลังใจตัวเอง..." },
    { title: "ความเข้าใจผิดเกี่ยวกับโรคทางจิตเวช", content: "โรคจิตเวชไม่ใช่เรื่องน่าอาย..." },
    { title: "แนวทางสร้างความสุขจากสิ่งเล็ก ๆ รอบตัว", content: "สังเกตสิ่งดี ๆ ในชีวิตประจำวัน..." }
  ];

  const itemsPerPage = 5;
  let currentPage = 1;

  function renderArticles(filter = "") {
    knowledgeList.innerHTML = "";
    const filtered = articles.filter(a =>
      a.title.includes(filter) || a.content.includes(filter)
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    filtered.slice(start, end).forEach(article => {
      const item = document.createElement("div");
      item.classList.add("knowledge-item");
      item.innerHTML = `<h3>${article.title}<span class="icon">▶</span></h3><p>${article.content}</p>`;
      item.addEventListener("click", () => {
        item.classList.toggle("active");
      });
      knowledgeList.appendChild(item);
    });

    renderPagination(totalPages, filter);
  }

  function renderPagination(totalPages, filter) {
    pagination.innerHTML = "";

    if (totalPages <= 1) return;

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "← ก่อนหน้า";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderArticles(filter);
      }
    });
    pagination.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = i === currentPage ? "active-page" : "";
      btn.addEventListener("click", () => {
        currentPage = i;
        renderArticles(filter);
      });
      pagination.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "ถัดไป →";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderArticles(filter);
      }
    });
    pagination.appendChild(nextBtn);
  }

  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderArticles(searchInput.value.trim());
  });

  renderArticles();
});