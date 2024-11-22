"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendMessageToChat, uploadAudioToServer } from "@/services/api";
import { Mic, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  isAudio?: boolean;
  audioUrl?: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const fetchInitialMessage = async () => {
      setLoading(true);
      const initialResponse = await sendMessageToChat(
        "Hello, I'd like some advice from the GENERAL Agent.",
        true
      );
      setLoading(false);

      if (initialResponse) {
        setMessages([
          {
            id: 1,
            text:
              initialResponse.response ||
              "Welcome! How can I assist you today?",
            sender: "bot",
          },
        ]);
      } else {
        setMessages([
          {
            id: 1,
            text: "Welcome! How can I assist you today?",
            sender: "bot",
          },
        ]);
      }
    };

    fetchInitialMessage();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await sendMessage(input.trim());
      setInput("");
    }
  };

  const sendMessage = async (
    text: string,
    isAudio: boolean = false,
    audioUrl = ""
  ) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: text,
      sender: "user",
      isAudio,
      audioUrl,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await sendMessageToChat(text);

      if (response) {
        const botResponseText = response.response;

        setMessages((prevMessages) => [
          ...prevMessages,
          { id: prevMessages.length + 1, text: botResponseText, sender: "bot" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          text: "Sorry, something went wrong. Please try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      if ("ondataavailable" in mediaRecorderRef.current) {
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
      }

      if ("onstop" in mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });

          try {
            const transcript = await uploadAudioToServer(audioBlob);
            if (transcript) {
              const audioUrl = URL.createObjectURL(audioBlob);
              await sendMessage(transcript, true, audioUrl);
            }
          } catch (error) {
            console.error("Error handling audio transcript:", error);
          }
        };
      }

      if ("start" in mediaRecorderRef.current) {
        mediaRecorderRef.current.start();
      }
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if ("stop" in mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1">
        <div className="max-w-3xl mx-auto">
          <ScrollArea className="h-[calc(100vh-120px)] pt-4 px-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-8 flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-orange-500 to-orange-300 text-white"
                        : "bg-gradient-to-r from-emerald-700 to-emerald-500 text-white"
                    }`}
                  >
                    {message.sender === "user" ? "U" : "A"}
                  </div>
                  {/* Message */}
                  <div
                    className={`py-3 px-4 rounded-lg ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-orange-500 to-orange-300 text-white"
                        : "bg-white text-emerald-700"
                    }`}
                  >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: (props) => <p className="mb-2" {...props} />,
                          h1: (props) => <h1 className="text-2xl font-bold mb-4" {...props} />,
                          h2: (props) => <h2 className="text-xl font-bold mb-3" {...props} />,
                          h3: (props) => <h3 className="text-lg font-bold mb-2" {...props} />,
                          ul: (props) => <ul className="list-disc ml-4 mb-4" {...props} />,
                          ol: (props) => <ol className="list-decimal ml-4 mb-4" {...props} />,
                          li: (props) => <li className="mb-1" {...props} />,
                          code: ({
                                   inline,
                                   children,
                                   ...props
                                 }: {
                            inline?: boolean;
                            className?: string;
                            children?: React.ReactNode;
                          }) => (
                              <code
                                  className={`${
                                      inline
                                          ? "bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5"
                                          : "block bg-gray-100 dark:bg-gray-800 rounded p-4 whitespace-pre-wrap"
                                  }`}
                                  {...props}
                              >
                                {children}
                              </code>
                          ),
                          pre: (props) => <pre className="my-2" {...props} />,
                          blockquote: (props) => {
                            return (
                                <blockquote className="border-l-4 border-gray-300 pl-4 my-4" {...props} />
                            );
                          },
                          a: (props) => <a className="text-blue-500 hover:underline" {...props} />,
                        }}
                    >
                      {message.text}
                    </ReactMarkdown>
                    {message.isAudio && (
                      <audio
                        src={message.audioUrl}
                        controls
                        className="mt-2 w-full"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="mb-8 flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-700 to-emerald-500 text-white flex items-center justify-center">
                    A
                  </div>
                  <div className="py-3 px-4 rounded-lg bg-white text-emerald-700">
                    <div className="typing-indicator">Typing...</div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
      <div className="border-t bg-white p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message ChatBot..."
              className="flex-grow rounded-lg border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
            <Button
              type="submit"
              disabled={loading || isRecording}
              className="bg-gradient-to-r from-orange-500 to-orange-300 text-white hover:shadow-lg transition-shadow"
            >
              {loading ? "Sending..." : "Send"}
            </Button>
            <Button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading}
              variant="outline"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              {isRecording ? (
                <Square className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
