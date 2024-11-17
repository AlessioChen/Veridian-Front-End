'use client';

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Component() {

    const [linkedinProfile, setLinkedinProfile] = useState('');
    const [additionalSkills, setAdditionalSkills] = useState('');
    const router = useRouter();

    const handleSubmit = () => {
            router.push('/chat');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className="w-full max-w-lg py-8">
                <header className="mb-4"> {/* Reduced margin-bottom */}
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
                        <CardContent className="p-6 md:p-8 "> {/* Increased height of form */}
                            <form className="space-y-8">
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
                                        <Label className="text-base">What are you looking for? *</Label>
                                        <RadioGroup defaultValue="improve" className="space-y-3">
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
                                    onClick={handleSubmit}
                                >
                                    Continue
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}
