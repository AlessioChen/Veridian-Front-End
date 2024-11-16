'use client';

import { useState, useRef } from 'react';
import { PlayIcon, PauseIcon, StopIcon, TrashIcon } from '@radix-ui/react-icons';
import { uploadAudioToServer } from '@/services/api';

export default function AudioRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const [transcription, setTranscription] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };
            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioURL(audioUrl);
                chunksRef.current = [];

                const transcript = await uploadAudioToServer(audioBlob);
                setTranscription(transcript);
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setIsPaused(false);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            if (isPaused) {
                mediaRecorderRef.current.resume();
            } else {
                mediaRecorderRef.current.pause();
            }
            setIsPaused(!isPaused);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
        }
    };

    const deleteRecording = () => {
        if (audioURL) {
            URL.revokeObjectURL(audioURL);
            setAudioURL(null);
            setTranscription(null);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-4">
                <button
                    onClick={startRecording}
                    disabled={isRecording}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50"
                    aria-label="Start recording"
                >
                    <PlayIcon className="h-6 w-6" />
                </button>
                <button
                    onClick={pauseRecording}
                    disabled={!isRecording}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50"
                    aria-label={isPaused ? 'Resume recording' : 'Pause recording'}
                >
                    <PauseIcon className="h-6 w-6" />
                </button>
                <button
                    onClick={stopRecording}
                    disabled={!isRecording}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50"
                    aria-label="Stop recording"
                >
                    <StopIcon className="h-6 w-6" />
                </button>
                {audioURL && (
                    <button
                        onClick={deleteRecording}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
                        aria-label="Delete recording"
                    >
                        <TrashIcon className="h-6 w-6" />
                    </button>
                )}
            </div>

            {audioURL && (
                <div className="mt-4">
                    <audio controls src={audioURL}>
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}

            {transcription && (
                <div className="mt-4">
                    <h3 className="font-bold text-lg">Transcription:</h3>
                    <p>{transcription}</p>
                </div>
            )}
        </div>
    );
}
