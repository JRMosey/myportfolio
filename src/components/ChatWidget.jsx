import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import profile from "../data/profile";

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState(profile.pseudoChat || "Visiteur");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io("http://localhost:3001");

        socketRef.current.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!message.trim()) return;

        const messageData = {
            username,
            message,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        socketRef.current.emit("send_message", messageData);
        setMessage("");
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-xl z-50 transition"
            >
                {isOpen ? "✕" : "💬 Chat"}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 h-[500px] bg-white shadow-2xl rounded-2xl flex flex-col z-50 border overflow-hidden">
                    <div className="bg-blue-600 text-white p-4 font-semibold flex justify-between items-center">
                        Discussion en direct
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white text-lg"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-3 border-b bg-white">
                        <input
                            type="text"
                            placeholder="Votre nom"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder-gray-500"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-3 shadow-sm text-black"
                            >
                                <div className="text-sm font-semibold text-blue-600">
                                    {msg.username}
                                </div>

                                <div className="text-sm text-black">
                                    {msg.message}
                                </div>

                                <div className="text-xs text-gray-500 text-right">
                                    {msg.time}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef}></div>
                    </div>

                    <div className="p-3 border-t flex gap-2 bg-white">
                        <input
                            type="text"
                            placeholder="Écrivez un message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder-gray-500"
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            Envoyer
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;