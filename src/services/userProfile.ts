type Job = {
  title: string;
  location: string;
  dates: {
    start: string;
    end: string;
  };
  details?: string[];
};

type Education = {
  level: string;
  details: string;
};

type UserProfile = {
  jobs: Job[];
  education?: Education[];
  skills: string[];
  location?: string;
  wanted_skills?: string;
};

export const userProfile = (wanted_skills?: string): UserProfile => {
  return {
    jobs: [
      {
        title: "Assembly Line Supervisor",
        location: "Birmingham, England, United Kingdom",
        dates: {
          start: "Jun 2019",
          end: "Present",
        },

        details: [
          "Managed production schedules and coordinated with suppliers to ensure timely delivery of auto parts, resulting in a 98% on-time production rate and reducing downtime by 15%",
          "Implemented a new quality control process that increased the efficiency of the assembly line by 20% and reduced defects in auto parts by 30%, leading to higher customer satisfaction",
          "Trained a team of 15 assembly line workers on best practices for productivity, resulting in a 25% increase in output and meeting production targets ahead of schedule",
        ],
      },
      {
        title: "Warehouse Associate",
        location: "Coventry, England, United Kingdom",
        dates: {
          start: "Mar 2014",
          end: "May 2019",
        },
        details: [
          "Processed and packed over 500 delivery boxes daily, ensuring accurate contents and timely shipments, resulting in a 98% on-time delivery rate",
          "Utilized lean inventory management techniques to optimize warehouse space utilization, reducing carrying costs by 15%",
          "Collaborated with cross-functional teams to implement a new quality control process for packing procedures, leading to a 20% decrease in shipping errors",
        ],
      },
      {
        title: "Production Operator",
        location: "Birmingham, England, United Kingdom",
        dates: {
          start: "Oct 2006",
          end: "Sep 2014",
        },
        details: [
          "Operated various types of factory forklifts to transport materials and products throughout the warehouse, resulting in a 15% increase in efficiency and productivity",
          "Maintained forklift equipment by conducting regular inspections and performing necessary maintenance tasks, reducing downtime by 20%",
          "Trained 10 new employees on proper forklift operation techniques, leading to a 30% decrease in accidents and safety incidents within the facility",
        ],
      },
      {
        title: "Assembly Line Worker",
        location: "Manchester",
        dates: {
          start: "May 1997",
          end: "Jul 2005",
        },
        details: ["Line Management"],
      },
    ],
    education: [
      {
        level: "high-school",
        details: "GCSE: 2Bs, 4Cs, 3Ds",
      },
    ],
    skills: [
      "Line Management",
      "Production Management",
      "Quality Control",
      "Team Leadership",
    ],
    location: "middleborough",
    wanted_skills,
  };
};
