// 設定伺服器監聽的端口
const PORT = 3001;
// 引入必要的模組
const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config({ path: ".env" });

// 啟用 CORS 中間件
app.use(cors());
// 解析 JSON 格式的請求體
app.use(express.json());

// 設定 OpenAI API 金鑰
const API_KEY = process.env.API_KEY;

// 處理 POST 請求到 /completions 路徑
app.post("/completions", async (req, res) => {
  // 設定請求選項
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: req.body.message }],
      max_tokens: 100,
    }),
  };
  try {
    // 發送請求到 OpenAI API
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    // 解析回應數據
    const data = await response.json();
    // 將數據發送回客戶端
    res.send(data);
  } catch (error) {
    // 錯誤處理
    console.error("發生錯誤:", error);
    res.status(500).json({ error: "內部伺服器錯誤" });
  }
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`伺服器正在監聽端口 ${PORT}`);
});
