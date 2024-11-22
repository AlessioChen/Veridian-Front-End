import { userProfile } from "@/services/userProfile";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const uploadAudioToServer = async (
  audioBlob: Blob
): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.mp3");

  try {
    const response = await fetch(`${API_BASE_URL}/transcript/`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.transcription || "No transcription available.";
  } catch (error) {
    console.error("Error uploading audio:", error);
    return "Error uploading audio.";
  }
};

export const sendMessageToChat = async (
  message: string,
  includeProfile: boolean = false
) => {
  try {
    const body = includeProfile
      ? {
          message: message,
          user_profile: userProfile,
        }
      : {
          message: message,
        };

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!data) {
      console.error("Error communicating with chat API:", response);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error sending message to chat API:", error);
    return null;
  }
};
