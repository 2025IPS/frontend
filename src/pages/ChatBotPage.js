import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatBotPage.css";

function ChatBotPage() {
  const [messages, setMessages] = useState([
    { type: "bot", text: "안녕하세요, 쫩쫩이입니다. \n 어떤 메뉴를 추천해드릴까요?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); 

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
      <div className="chat-header">
        <h1>
          <span className="text-pink">오늘의</span>
          <span className="text-brown"> 먹방</span>
          <span className="text-pink">은</span>
        </h1>
      </div>

      <div className="chat-box">
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`}>
              {msg.type === "bot" && (
                <div className="chat-profile">
                  <div className="profile-wrapper">
                    <img src="/chatbot.png" alt="쫩쫩이" className="profile-img" />
                  </div>
                </div>
              )}
              <div className="message-content">{msg.text}</div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <div className="chat-profile">
                <div className="profile-wrapper">
                  <img src="/chatbot.png" alt="쫩쫩이" className="profile-img" />
                </div>
              </div>
              <div className="message-content">추천하는 중입니다... 🍜</div>
            </div>
          )}
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="눌러서 쫩쫩이에게 메뉴 추천받기"
            className="chat-input"
          />
          <button onClick={sendMessage} className="send-button">➤</button>
        </div>
      </div>

      <nav className="bottom-nav">
        <button className="nav-button" onClick={() => navigate("/home")}>
          <img src="/home.png" alt="홈" className="nav-icon" />
        </button>
        <button className="nav-button" onClick={() => navigate("/menu-result")}>
          <span className="bookmark-icon">📁</span>
        </button>
        <button className="nav-button" onClick={() => navigate("/mypage")}>
          <img src="/movetomypage.png" alt="마이페이지" className="nav-icon" />
        </button>
      </nav>
    </div>
  );
}

export default ChatBotPage;
