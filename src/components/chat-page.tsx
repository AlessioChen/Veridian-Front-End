'use client'

import {useState, useRef, useEffect} from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {getUserProfileSuggestion, sendMessageToChat, uploadAudioToServer} from '@/services/api'
import { Mic, Square } from 'lucide-react'

type Message = {
    id: number
    text: string
    sender: 'user' | 'bot'
    isAudio?: boolean,
    audioUrl?: string,
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! How can I assist you today?", sender: 'bot' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])

    useEffect(() => {
        const fetchInitialMessage = async () => {
            setLoading(true);
            const initialResponse = await getUserProfileSuggestion();
            setLoading(false);

            if (initialResponse) {
                setMessages([
                    {
                        id: 1,
                        text: initialResponse.message || "Welcome! How can I assist you today?",
                        sender: 'bot',
                    },
                ]);
            } else {
                setMessages([
                    {
                        id: 1,
                        text: "Welcome! How can I assist you today?",
                        sender: 'bot',
                    },
                ]);
            }
        };

        fetchInitialMessage();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim()) {
            await sendMessage(input.trim())
            setInput('')
        }
    }

    const sendMessage = async (text: string, isAudio: boolean = false, audioUrl='') => {
        const userMessage: Message = {
            id: messages.length + 1,
            text: text,
            sender: 'user',
            isAudio,
            audioUrl
        }
        setMessages((prev) => [...prev, userMessage])
        setLoading(true)

        try {
            const response = await sendMessageToChat(text);

            if (response) {
                const botResponseText = response.response;

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

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaRecorderRef.current = new MediaRecorder(stream)
            audioChunksRef.current = []

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data)
            }

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })

                try {
                    const transcript = await uploadAudioToServer(audioBlob)
                    if (transcript) {
                        const audioUrl = URL.createObjectURL(audioBlob);
                        await sendMessage(transcript, true, audioUrl)
                    }
                } catch (error) {
                    console.error('Error handling audio transcript:', error)
                }
            }

            mediaRecorderRef.current.start()
            setIsRecording(true)
        } catch (error) {
            console.error('Error starting recording:', error)
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
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

                        { message.text}
                        {/*{message.isAudio ? (*/}
                        {/*    <audio src={message.audioUrl} controls className="w-full" />*/}
                        {/*) : (*/}
                        {/*    message.text*/}
                        {/*)}*/}
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
                <Button type="submit" disabled={loading || isRecording}>
                    {loading ? 'Sending...' : 'Send'}
                </Button>
                <Button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={loading}
                    variant="outline"
                >
                    {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
            </form>
        </div>
    )
}
