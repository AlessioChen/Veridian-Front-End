"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LinkedInSkillsPage() {
  const [step, setStep] = useState(1);
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [additionalSkills, setAdditionalSkills] = useState("");
  const router = useRouter();

  const handleNextStep = () => {
    if (step === 1 && linkedinProfile) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    if (step === 2) {
      const data = {
        linkedinProfile,
        additionalSkills,
      };

      // Convert data to URL-safe query string
      const queryParams = new URLSearchParams({
        skills: encodeURIComponent(additionalSkills),
      }).toString();

      console.log("qps", queryParams);

      // Redirect to /chat page
      router.push(`/chat?${queryParams}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Step 1: LinkedIn Profile
            </h2>
            <input
              type="url"
              placeholder="Enter your LinkedIn profile URL"
              value={linkedinProfile}
              onChange={(e) => setLinkedinProfile(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button
              onClick={handleNextStep}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={!linkedinProfile}
            >
              Next
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Step 2: Additional Skillsets
            </h2>
            <textarea
              placeholder="Enter additional skills (comma-separated)"
              value={additionalSkills}
              onChange={(e) => setAdditionalSkills(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            ></textarea>
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
