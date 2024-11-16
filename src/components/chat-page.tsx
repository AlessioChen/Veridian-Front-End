'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { sendMessageToChat } from '@/services/api'

type Message = {
    id: number
    text: string
    sender: 'user' | 'bot'
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! How can I assist you today?", sender: 'bot' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim()) {
            const userMessage: Message = {
                id: messages.length + 1,
                text: input.trim(),
                sender: 'user'
            }
            setMessages([...messages, userMessage])
            setInput('')
            setLoading(true)

            try {
                const chatStream = await sendMessageToChat(userMessage.text)
                if (chatStream) {
                    const reader = chatStream.getReader()
                    const decoder = new TextDecoder('utf-8')
                    let botResponseText = ''

                    // Read the stream completely
                    while (true) {
                        const { value, done } = await reader.read()
                        if (done) break
                        botResponseText += decoder.decode(value, { stream: true })
                    }

                    // Update messages after the stream is fully read
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { id: prevMessages.length + 1, text: botResponseText, sender: 'bot' }
                    ])
                }
            } catch (error) {
                console.error('Error fetching bot response:', error)
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        id: prevMessages.length + 1,
                        text: "Sorry, something went wrong. Please try again later.",
                        sender: 'bot'
                    }
                ])
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Chat Page</h1>
            <ScrollArea className="flex-grow mb-4 p-4 border rounded-md">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`mb-2 p-2 rounded-lg ${
                            message.sender === 'user'
                                ? 'bg-blue-500 text-white self-end'
                                : 'bg-gray-200 text-gray-800 self-start'
                        }`}
                    >
                        {message.text}
                    </div>
                ))}
                {loading && (
                    <div className="mb-2 p-2 rounded-lg bg-gray-200 text-gray-800 self-start">
                        Typing...
                    </div>
                )}
            </ScrollArea>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow"
                />
                <Button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send'}
                </Button>
            </form>
        </div>
    )
}
