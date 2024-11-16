
const API_BASE_URL = 'http://127.0.0.1:8000';

export const uploadAudioToServer = async (audioBlob: Blob): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.mp3');

    try {
        const response = await fetch(`${API_BASE_URL}/transcript/`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        return data.transcription || 'No transcription available.';
    } catch (error) {
        console.error('Error uploading audio:', error);
        return 'Error uploading audio.';
    }
};

export const sendMessageToChat = async (message: string): Promise<ReadableStream<Uint8Array> | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response) {
            console.error('Error communicating with chat API:', response);
            return null;
        }

        return response.body;

    } catch (error) {
        console.error('Error sending message to chat API:', error);
        return null;
    }
};
