import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
// 從 React 庫中引入 useState 和 useEffect hooks
// useState: 用於在函數組件中添加狀態管理
// useEffect: 用於處理副作用，如資料獲取、訂閱或手動更改 DOM
// 當useState改變時，可以用useEffect來監聽
import { useState, useEffect } from "react";

const App = () => {
  // 使用 useState hooks來管理輸入值的狀態
  // 空值表示還沒有輸入
  const [value, setValue] = useState("");
  // 使用 useState hooks來管理回覆的狀態
  // null 表示還沒有回覆
  const [reply, setReply] = useState(null);
  const [recordTitle, setRecordTitle] = useState(null);
  const [records, setRecords] = useState([]);

  // 定義一個非同步函數 getData
  const getData = async () => {
    // 設定 HTTP 請求的選項
    const options = {
      method: "POST", // 使用 POST 方法
      headers: {
        "Content-Type": "application/json", // 設定內容類型為 JSON
      },
      body: JSON.stringify({
        message: value, // 將訊息內容轉為 JSON 字串
      }),
    };
    try {
      // 發送請求到本地伺服器的 completions 端點
      const response = await fetch(
        "http://localhost:3001/completions",
        options
      );
      // 將回應轉換為 JSON 格式
      const data = await response.json();
      // 在控制台輸出回應數據
      console.log(data);
      setReply(data.choices[0].message);
    } catch (error) {
      // 如果發生錯誤，在控制台輸出錯誤信息
      console.error(error);
    }
  };

  //清空所有值並恢復預設值
  const addNewChat = () => {
    setValue("");
    setReply(null);
    setRecordTitle(null);
  };

  useEffect(() => {
    // 在控制台輸出 recordTitle、value 和 reply 的值，用於調試
    console.log(recordTitle, value, reply);

    // 如果還沒有設置記錄標題且有回覆，則將當前輸入值設為記錄標題
    if (!recordTitle && reply) {
      setRecordTitle(value);
    }

    // 如果已有記錄標題和回覆，則更新記錄列表
    if (recordTitle && reply) {
      setRecords((prevRecord) => [
        ...prevRecord, // 保留之前的所有記錄（展開運算符，將之前的記錄展開到新陣列中）
        {
          title: recordTitle, // 設置記錄標題
          role: "user", // 設置角色為用戶
          content: value, // 設置內容為用戶輸入
        },
        {
          title: recordTitle, // 設置相同的記錄標題
          role: reply.role, // 設置角色為回覆的角色（可能是 "assistant"）
          content: reply.content, // 設置內容為回覆的內容
        },
      ]);
    }
  }, [reply, recordTitle]); // 當 reply 或 recordTitle 變化時，執行這個效果

  // 過濾出與當前記錄標題相符的記錄
  const currentRecord = records.filter(
    (record) => record.title === recordTitle
  );

  // Set() 是 JavaScript 中的一個內建物件，用於創建唯一值的集合
  // Set() 會自動去除重複的值，確保集合中的每個元素都是唯一的
  // records.map((record) => record.title) 從所有記錄中提取標題
  // new Set(...) 創建一個包含所有唯一標題的 Set 物件

  // Array.from() 是一個靜態方法，用於從類陣列或可迭代物件創建一個新的陣列實例
  // 在這裡，它將 Set 物件轉換回陣列
  // 這樣做的結果是得到一個包含所有唯一標題的陣列
  const uniqueTitles = Array.from(
    new Set(records.map((record) => record.title))
  );
  // uniqueTitles 現在是一個包含所有不重複記錄標題的陣列
  // handleClick 函數用於處理點擊歷史記錄中的標題時的操作
  const handleClick = (uniqueTitle) => {
    // 設置當前記錄的標題為被點擊的標題
    setRecordTitle(uniqueTitle);
    // 清空輸入框的值
    setValue("");
    // 清空回覆，準備接收新的對話
    setReply(null);
  };
  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={addNewChat}>
          <span className="plus">+</span> New chat
        </button>
        <ul className="history">
          {/* 使用 map 函數遍歷 uniqueTitles 陣列，為每個標題創建一個列表項 */}
          {uniqueTitles.map((uniqueTitle, index) => (
            // 為每個列表項創建一個 <li> 元素，使用 index 作為 key 以優化渲染效能
            <li
              className="message"
              key={index}
              onClick={() => handleClick(uniqueTitle)}
            >
              {/* 顯示一個聊天氣泡圖標 */}
              <ChatBubbleOutlineRoundedIcon />
              {/* 顯示記錄的標題 */}
              <p className="record">{uniqueTitle}</p>
            </li>
          ))}
        </ul>
        <nav>
          <p>Made by Uncle Raven</p>
        </nav>
      </section>
      <section className="main">
        {recordTitle ? (
          <p className="title">{recordTitle}</p>
        ) : (
          <h1>Uncle Raven ChatGPT</h1>
        )}
        <ul id="output">
          {/* 使用可選鏈運算符 '?.' 來安全地訪問 currentRecord */}
          {/* 這是為了防止 currentRecord 為 undefined 或 null 時出錯 */}
          {/* 如果 currentRecord 存在，則執行 map 方法；否則，不執行任何操作 */}
          {currentRecord?.map((message, index) => (
            // 為每個列表項提供唯一的 key，這裡使用索引作為 key
            <div
              key={index}
              className={`container ${
                message.role === "assistant" ? "assistant-msg" : ""
              }`}
            >
              <li>
                {/* 顯示消息的角色，使用模板字符串動態設置 className */}
                <p className={`role ${message.role}`}></p>
                {/* 顯示消息的內容 */}
                <p>{message.content}</p>
              </li>
            </div>
          ))}
          <div className="bottom-space"></div>
        </ul>

        <div className="bottom-section">
          <div className="input-container">
            <input
              name="text"
              type="text"
              placeholder="Send a message"
              autoComplete="off"
              // 使用者輸入的值
              value={value}
              // 使用者輸入時，更新 value
              onChange={(e) => setValue(e.target.value)}
            />
            <div id="submit" onClick={getData}>
              <SendRoundedIcon style={{ color: "#DDDDE4" }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
