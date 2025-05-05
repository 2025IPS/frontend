import React, { useState } from "react";
import "./ChatBotPage.css";

function ChatBotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userProfile = "알레르기: 없음 / 예산: 1~2만원 / 혼밥: 혼자";
  const weather = "비오는 날";

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const eventSource = new EventSource(
      `http://localhost:8000/api/llm-recommend-stream?user_profile=${encodeURIComponent(userProfile)}&weather=${encodeURIComponent(weather)}&situation=${encodeURIComponent(input)}`
    );

    let botResponse = "";

    eventSource.onmessage = (event) => {
      try {
        if (event.data === "[END]") {
          const finalResponse = botResponse.trim();

          if (finalResponse) {
            setMessages((prev) => [...prev, { type: "bot", text: finalResponse }]);
          } else {
            setMessages((prev) => [...prev, { type: "bot", text: "추천 가능한 메뉴가 없습니다." }]);
          }

          setIsLoading(false);
          eventSource.close();
        } else {
          botResponse += event.data;
        }
      } catch (error) {
        console.error("응답 처리 오류", error);
        setIsLoading(false);
        eventSource.close();
        setMessages((prev) => [...prev, { type: "bot", text: "추천 중 오류가 발생했어요." }]);
      }
    };

    eventSource.onerror = (error) => {
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log("Stream closed normally.");
        return;
      }

      console.error("Streaming error", error);
      eventSource.close();
      setIsLoading(false);

      setMessages((prev) => [...prev, { type: "bot", text: "추천 중 오류가 발생했어요. 다시 시도해 주세요." }]);
    };
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <h2>🍽️ 오늘 뭐 먹지? (AI 메뉴 추천 쫩쫩이)</h2>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.type}>
            <p><strong>{msg.type === "user" ? "나" : "쫩쫩이"}</strong>: {msg.text}</p>
          </div>
        ))}
        {isLoading && <p><strong>쫩쫩이</strong>: 추천하는 중입니다... 🍜</p>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="추천 받고 싶은 메뉴를 입력해보세요"
        />
        <button onClick={sendMessage}>보내기</button>
      </div>
    </div>
  );
}

export default ChatBotPage;
