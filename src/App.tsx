import React, { useEffect, useRef, useState } from "react";
import "./App.css";

/**
 * Bedrock形式対応のチャットアプリ (React + TypeScript)
 */

// 表示用のメッセージ型
type Message = {
  id: number;
  author: string;
  text: string;
  time: string;
};

// Bedrock形式のメッセージ型
type BedrockMessage = {
  role: "user" | "assistant";
  content: Array<{ text: string }>;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>(() => [
    { 
      id: 1, 
      author: "Bot", 
      text: "ようこそ！何かお手伝いできることはありますか？", 
      time: new Date().toLocaleTimeString() 
    },
  ]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("You");
  const [isLoading, setIsLoading] = useState(false);
  
  // Bedrock形式のチャット履歴を保持
  const [chatHistory, setChatHistory] = useState<BedrockMessage[]>([]);
  
  const nextIdRef = useRef<number>(2);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // APIエンドポイント（仮）
  const API_ENDPOINT = "https://exxmgbg0hl.execute-api.ap-northeast-1.amazonaws.com/simpleChat/simpleChat";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // ユーザーメッセージを表示用に追加
    const userMsg: Message = {
      id: nextIdRef.current++,
      author: name || "You",
      text: trimmed,
      time: new Date().toLocaleTimeString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // APIリクエストを送信
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          chat_history: chatHistory, // Bedrock形式のまま送信
          user_name: name || "ユーザー",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response;

      // AIの応答を表示用に追加
      const botMsg: Message = {
        id: nextIdRef.current++,
        author: "Bot",
        text: aiResponse,
        time: new Date().toLocaleTimeString(),
      };
      setMessages((m) => [...m, botMsg]);

      // Bedrock形式でチャット履歴を更新
      const newHistory: BedrockMessage[] = [
        ...chatHistory,
        {
          role: "user",
          content: [{ text: trimmed }],
        },
        {
          role: "assistant",
          content: [{ text: aiResponse }],
        },
      ];
      setChatHistory(newHistory);

    } catch (error) {
      console.error("API Error:", error);
      
      // エラーメッセージを表示
      const errorMsg: Message = {
        id: nextIdRef.current++,
        author: "Bot",
        text: "申し訳ございません。エラーが発生しました。もう一度お試しください。",
        time: new Date().toLocaleTimeString(),
      };
      setMessages((m) => [...m, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    setMessages([
      { 
        id: 1, 
        author: "Bot", 
        text: "チャットをクリアしました。何かお手伝いできることはありますか？", 
        time: new Date().toLocaleTimeString() 
      },
    ]);
    setChatHistory([]);
    nextIdRef.current = 2;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>AI Chat (Bedrock)</h1>
        <div className="header-controls">
          <div className="name-wrap">
            <label>名前</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="name-input"
              placeholder="あなたの名前"
            />
          </div>
          <button className="clear-btn" onClick={clearChat}>
            クリア
          </button>
        </div>
      </header>

      <main className="chat-window">
        {messages.map((m) => (
          <div
            key={m.id}
            className={m.author === name ? "message-row my-message" : "message-row other-message"}
          >
            <div className={`message-bubble ${m.author === name ? "my-bubble" : "other-bubble"}`}>
              <div className="message-meta">
                <strong>{m.author}</strong>
                <span className="message-time">{m.time}</span>
              </div>
              <div className="message-text">{m.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-row other-message">
            <div className="message-bubble other-bubble">
              <div className="loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      <footer className="footer">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="メッセージを入力して Enter または送信ボタン"
          disabled={isLoading}
        />
        <button 
          className={`send-btn ${isLoading ? "disabled" : ""}`}
          onClick={sendMessage}
          disabled={isLoading}
        >
          {isLoading ? "送信中..." : "送信"}
        </button>
      </footer>
    </div>
  );
}