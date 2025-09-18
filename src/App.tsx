import React, { useEffect, useRef, useState } from "react";

/**
 * Very simple chat app (React + TypeScript)
 * Paste this file into a React + TypeScript project as `src/App.tsx`.
 * Works with Create React App (typescript template) or Vite + React + TS.
 * No external libraries required.
 */

type Message = {
  id: number;
  author: string;
  text: string;
  time: string; // ISO or formatted
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>(() => [
    { id: 1, author: "Bot", text: "ようこそ！簡単なチャットです。", time: new Date().toLocaleTimeString() },
  ]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("You");
  const nextIdRef = useRef<number>(2);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const msg: Message = {
      id: nextIdRef.current++,
      author: name || "You",
      text: trimmed,
      time: new Date().toLocaleTimeString(),
    };
    setMessages((m) => [...m, msg]);
    setInput(""); // 入力をリセット

    // very simple faux-reply from "Bot" after a short delay
    setTimeout(() => {
      const reply: Message = {
        id: nextIdRef.current++,
        author: "Bot",
        text: `受け取りました: "${trimmed}"`,
        time: new Date().toLocaleTimeString(),
      };
      setMessages((m) => [...m, reply]);
    }, 700);
  }


  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={{ margin: 0, fontSize: 18 }}>Simple Chat</h1>
        <div style={styles.nameWrap}>
          <label style={{ fontSize: 12, marginRight: 6 }}>名前</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.nameInput}
            placeholder="あなたの名前"
          />
        </div>
      </header>

      <main style={styles.chatWindow}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={m.author === name ? styles.myMessageRow : styles.otherMessageRow}
          >
            <div style={styles.messageBubble}>
              <div style={styles.messageMeta}>
                <strong style={{ fontSize: 13 }}>{m.author}</strong>
                <span style={{ fontSize: 11, marginLeft: 8 }}>{m.time}</span>
              </div>
              <div style={{ marginTop: 6 }}>{m.text}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      <footer style={styles.footer}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力して Enter または送信ボタン"
        />
        <button style={styles.sendBtn} onClick={sendMessage}>
          送信
        </button>
      </footer>
    </div>
  );
}

const styles: { [k: string]: React.CSSProperties } = {
  app: {
    height: "100vh",
    width: "100vw", // 横いっぱいに広げる
    display: "flex",
    flexDirection: "column",
    fontFamily: "Helvetica, Arial, sans-serif",
    background: "#f3f4f6",
  },
  header: {
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "white",
  },
  nameWrap: { display: "flex", alignItems: "center" },
  nameInput: {
    padding: "6px 8px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    fontSize: 13,
  },
  chatWindow: {
    flex: 1,
    padding: 16,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  myMessageRow: { alignSelf: "flex-end", maxWidth: "80%" },
  otherMessageRow: { alignSelf: "flex-start", maxWidth: "80%" },
  messageBubble: {
    background: "white",
    padding: "10px 12px",
    borderRadius: 10,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  messageMeta: { display: "flex", alignItems: "center" },
  footer: {
    padding: 12,
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    gap: 8,
    background: "white",
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
  },
  sendBtn: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },
};
