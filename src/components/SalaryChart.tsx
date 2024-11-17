'use client';

import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function SalaryChart() {
    const [currentSalary, setCurrentSalary] = useState(50000); // Default: $50,000
    const [annualIncrement, setAnnualIncrement] = useState(3); // Default: 3%
    // const [jobChangeIncrement, setJobChangeIncrement] = useState(10); // Default: 10% every 5 years
    const [inflationRate, setInflationRate] = useState(2); // Default: 2%

    const calculateTrends = () => {
        const years = Array.from({ length: 20 }, (_, i) => i + 1);
        const inflationFactor = 1 + inflationRate / 100;
        const salaryStayTrend: number[] = [];
        const salaryChangeTrend: number[] = [];

        let staySalary = currentSalary;
        let changeSalary = currentSalary;

        years.forEach((year) => {
            // Stay trend: Increment annually with inflation adjustment
            staySalary *= 1 + annualIncrement / 100;
            salaryStayTrend.push(staySalary / Math.pow(inflationFactor, year)); // Adjust for inflation

            // Change trend: Increment higher every 5 years
            if (year % 5 === 0) {
                // changeSalary *= 1 + jobChangeIncrement / 100;
            } else {
                changeSalary *= 1 + annualIncrement / 100;
            }
            salaryChangeTrend.push(changeSalary / Math.pow(inflationFactor, year)); // Adjust for inflation
        });

        return { years, salaryStayTrend, salaryChangeTrend };
    };

    const { years, salaryStayTrend, salaryChangeTrend } = calculateTrends();

    const data = {
        labels: years,
        datasets: [
            {
                label: 'Stay in Current Job',
                data: salaryStayTrend,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            },
            {
                label: 'Switch Jobs Regularly',
                data: salaryChangeTrend,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Salary Trend Comparison</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block mb-2">Current Salary ($):</label>
                    <input
                        type="number"
                        value={currentSalary}
                        onChange={(e) => setCurrentSalary(Number(e.target.value))}
                        className="w-full border rounded px-2 py-1"
                    />
                </div>
                <div>
                    <label className="block mb-2">Annual Increment (%):</label>
                    <input
                        type="number"
                        value={annualIncrement}
                        onChange={(e) => setAnnualIncrement(Number(e.target.value))}
                        className="w-full border rounded px-2 py-1"
                    />
                </div>
                {/*<div>*/}
                {/*    <label className="block mb-2">Job Change Increment (%):</label>*/}
                {/*    <input*/}
                {/*        type="number"*/}
                {/*        value={jobChangeIncrement}*/}
                {/*        onChange={(e) => setJobChangeIncrement(Number(e.target.value))}*/}
                {/*        className="w-full border rounded px-2 py-1"*/}
                {/*    />*/}
                {/*</div>*/}
                <div>
                    <label className="block mb-2">Inflation Rate (%):</label>
                    <input
                        type="number"
                        value={inflationRate}
                        onChange={(e) => setInflationRate(Number(e.target.value))}
                        className="w-full border rounded px-2 py-1"
                    />
                </div>
            </div>
            <Line data={data} />
        </div>
    );
}
