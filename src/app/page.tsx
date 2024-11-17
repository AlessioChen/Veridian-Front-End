"use client";

import { useState } from "react";
import SalaryChart from "@/components/SalaryChart";
import ChatPage from "@/components/chat-page";

export default function Home() {
  const [currentSalary, setCurrentSalary] = useState(50000);
  const [annualIncrement, setAnnualIncrement] = useState(3);
  const [jobChangeIncrement, setJobChangeIncrement] = useState(10);
  const [inflationRate, setInflationRate] = useState(2);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-svh p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="row-start-2 grid grid-cols-[400px_1fr] gap-8">
        <ChatPage
          currentSalary={currentSalary}
          annualIncrement={annualIncrement}
          jobChangeIncrement={jobChangeIncrement}
          inflationRate={inflationRate}
        />
        <div className="flex flex-col items-center">
          <SalaryChart
            currentSalary={currentSalary}
            setCurrentSalary={setCurrentSalary}
            annualIncrement={annualIncrement}
            setAnnualIncrement={setAnnualIncrement}
            jobChangeIncrement={jobChangeIncrement}
            setJobChangeIncrement={setJobChangeIncrement}
            inflationRate={inflationRate}
            setInflationRate={setInflationRate}
          />
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
