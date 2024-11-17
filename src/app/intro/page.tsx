"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Component() {
  const [linkedinProfile, setLinkedinProfile] = useState("");
  const [additionalSkills, setAdditionalSkills] = useState("");
  const [lookingFor, setLookingFor] = useState("improve");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send data directly to chat endpoint
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Hello, I'd like some general advice from the GENERAL Agent based on my profile. My LinkedIn profile is ${linkedinProfile}, I have the following additional skills: ${additionalSkills}, and I am looking for opportunities to ${lookingFor}.
          
          My information:

          Current Job: Assembly Line Supervisor
Current Salary: Unspecified
Work Experience:
Assembly Line Supervisor, Midlands Automotive Co., June 2019 to Present (over 4 years)
Warehouse Associate, Rainforest Warehousing Co., March 2014 to May 2019 (over 5 years)
Production Operator, Shop3D, October 2006 to September 2014 (over 8 years)
Assembly Line Worker, Manchester Technology Co., May 1997 to July 2005 (over 8 years)

Work Skills:
Production management
Quality control process implementation
Team training and development
Inventory management
Lean techniques
Time management
Collaborative teamwork
Forklift operation and maintenance
Safety and risk management

Industry Knowledge: 
Quality control
Inventory management
Lean warehouse management
Manufacturing processes and systems
Quality assurance processes

Educational Achievement: Not Available
Geographical Constraints: Restricted to England, United Kingdom (specifically Birmingham and Coventry area)

Motivations: Unavailable
Time Constraint: Unspecified
          `,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit profile");
      }

      await router.push("/chat");
    } catch (error) {
      console.error("Error submitting profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-lg py-8">
        <header className="mb-4">
          {" "}
          {/* Reduced margin-bottom */}
          <div className="flex items-center gap-2 justify-start">
            <Image
              src="/logo.png"
              alt="Veridian Logo"
              width={240}
              height={40}
            />
          </div>
        </header>

        <main className="relative flex justify-center">
          <Card className="bg-white shadow-sm w-full">
            <CardContent className="p-6 md:p-8 ">
              {" "}
              {/* Increased height of form */}
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <h1 className="text-4xl font-bold text-emerald-700">
                    Introduce yourself.
                  </h1>

                  {/* LinkedIn Input */}
                  <input
                    type="url"
                    placeholder="Enter your LinkedIn profile URL"
                    value={linkedinProfile}
                    onChange={(e) => setLinkedinProfile(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                  />

                  {/* Looking For */}
                  <div className="space-y-3">
                    <Label className="text-base">
                      What are you looking for? *
                    </Label>
                    <RadioGroup
                      defaultValue="improve"
                      name="looking-for"
                      className="space-y-3"
                      onValueChange={setLookingFor}
                      value={lookingFor}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="improve" id="improve" />
                        <Label htmlFor="improve" className="font-normal">
                          Improve my current situation.
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="new" id="new" />
                        <Label htmlFor="new" className="font-normal">
                          I&apos;m ready for something new.
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-2">
                    <Label htmlFor="additional" className="text-base">
                      Additional Skill sets
                    </Label>
                    <textarea
                      placeholder="Enter additional skills (comma-separated)"
                      value={additionalSkills}
                      onChange={(e) => setAdditionalSkills(e.target.value)}
                      className="w-full p-2 border rounded mb-4"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-lg hover:from-orange-500 hover:to-orange-600"
                >
                  Continue
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
