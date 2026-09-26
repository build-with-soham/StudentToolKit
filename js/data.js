/* Student Toolkit — Static data (V1)
   Opportunities are manually curated sample listings for the first version.
   Replace / extend these entries as you curate real opportunities. */

const OPPORTUNITIES = [
  {
    id: 'opp-01',
    title: 'National Level Hackathon 2026',
    org: 'TechFest Collective',
    category: 'Hackathon',
    desc: '36-hour team hackathon on solving campus and city problems with technology. Open to all undergraduate students.',
    eligibility: 'Any UG student, team of 2–4',
    deadline: '2026-09-15',
    location: 'Hybrid',
    skills: ['Any stack', 'Teamwork', 'Prototyping'],
    link: '#'
  },
  {
    id: 'opp-02',
    title: 'Frontend Developer Internship',
    org: 'PixelWorks Studio',
    category: 'Internship',
    desc: '3-month remote internship building marketing sites and UI components with HTML, CSS, JavaScript and React basics.',
    eligibility: '2nd/3rd year, basic JS portfolio',
    deadline: '2026-09-05',
    location: 'Remote',
    skills: ['HTML', 'CSS', 'JavaScript', 'Git'],
    link: '#'
  },
  {
    id: 'opp-03',
    title: 'Merit-cum-Means Engineering Scholarship',
    org: 'National Education Trust',
    category: 'Scholarship',
    desc: 'Annual scholarship for engineering students with strong academics and financial need. Covers partial tuition.',
    eligibility: 'CGPA 7.5+, family income criteria',
    deadline: '2026-10-01',
    location: 'India',
    skills: ['Academic record'],
    link: '#'
  },
  {
    id: 'opp-04',
    title: 'Web Development Bootcamp (Free)',
    org: 'CodeCamp Community',
    category: 'Workshop',
    desc: 'Weekend bootcamp covering HTML, CSS, JavaScript and a first deployed project. Beginner friendly.',
    eligibility: 'Open to all students',
    deadline: '2026-09-10',
    location: 'Online',
    skills: ['HTML', 'CSS', 'JavaScript'],
    link: '#'
  },
  {
    id: 'opp-05',
    title: 'Inter-College Coding Contest',
    org: 'AlgoLeague',
    category: 'Competition',
    desc: 'Online DSA contest with three rounds. Cash prizes and interview shortlists for top performers.',
    eligibility: 'UG/PG students with valid college ID',
    deadline: '2026-09-28',
    location: 'Online',
    skills: ['DSA', 'C++ / Java / Python'],
    link: '#'
  },
  {
    id: 'opp-06',
    title: 'Embedded Systems Research Assistantship',
    org: 'Dept. of Electronics Research Lab',
    category: 'Research',
    desc: 'Semester-long assistantship working on IoT sensor networks. Great for students targeting higher studies.',
    eligibility: 'ENTC/EEE students, CGPA 8.0+',
    deadline: '2026-09-20',
    location: 'On-campus',
    skills: ['C', 'Microcontrollers', 'IoT'],
    link: '#'
  },
  {
    id: 'opp-07',
    title: 'Campus Ambassador Program',
    org: 'LearnHub',
    category: 'Student Program',
    desc: 'Represent a learning platform on campus, organise events and earn certificates, swag and stipend.',
    eligibility: 'Any year, good communication',
    deadline: '2026-09-30',
    location: 'On-campus',
    skills: ['Communication', 'Marketing'],
    link: '#'
  },
  {
    id: 'opp-08',
    title: 'Data Analytics Summer Internship',
    org: 'InsightGrid Analytics',
    category: 'Internship',
    desc: 'Work on real dashboards and reports using SQL, Excel and Python. Mentorship provided.',
    eligibility: '3rd year+, SQL basics',
    deadline: '2026-10-12',
    location: 'Pune / Hybrid',
    skills: ['SQL', 'Python', 'Excel'],
    link: '#'
  },
  {
    id: 'opp-09',
    title: 'UI/UX Design Challenge',
    org: 'DesignCircle',
    category: 'Competition',
    desc: 'Redesign a student app flow in 48 hours. Winners get mentorship and internship interviews.',
    eligibility: 'Open to all students',
    deadline: '2026-10-05',
    location: 'Online',
    skills: ['Figma', 'Design thinking'],
    link: '#'
  },
  {
    id: 'opp-10',
    title: 'Cloud Fundamentals Workshop',
    org: 'SkyScale Academy',
    category: 'Workshop',
    desc: 'Two-day hands-on workshop on cloud basics, deployment and a free-tier project launch.',
    eligibility: 'Basic programming knowledge',
    deadline: '2026-09-18',
    location: 'Online',
    skills: ['Cloud', 'Linux basics'],
    link: '#'
  },
  {
    id: 'opp-11',
    title: 'Women in STEM Scholarship',
    org: 'BrightFuture Foundation',
    category: 'Scholarship',
    desc: 'Scholarship and mentorship program supporting women pursuing STEM degrees.',
    eligibility: 'Women UG students in STEM',
    deadline: '2026-11-01',
    location: 'India',
    skills: ['Academic record'],
    link: '#'
  },
  {
    id: 'opp-12',
    title: 'Open Source Contribution Sprint',
    org: 'OSS United',
    category: 'Student Program',
    desc: 'Month-long guided sprint to make your first open-source contributions with maintainer support.',
    eligibility: 'Git basics required',
    deadline: '2026-10-20',
    location: 'Remote',
    skills: ['Git', 'GitHub', 'Any language'],
    link: '#'
  }
];

/* Skill roadmap tracks (Module 2 — Career) */
const ROADMAPS = {
  software: {
    label: 'Software Engineer (Full-Stack Web)',
    steps: [
      { name: 'HTML', desc: 'Structure web pages with semantic markup.' },
      { name: 'CSS', desc: 'Style layouts, flexbox/grid and responsive design.' },
      { name: 'JavaScript', desc: 'DOM manipulation, ES6+, events and logic.' },
      { name: 'Git & GitHub', desc: 'Version control, commits, branches and PRs.' },
      { name: 'React', desc: 'Components, hooks and state management.' },
      { name: 'Node.js & Express', desc: 'Build backend APIs and servers.' },
      { name: 'Databases', desc: 'SQL basics, PostgreSQL and data modelling.' },
      { name: 'DSA', desc: 'Arrays, strings, trees, graphs and complexity.' },
      { name: 'Projects', desc: 'Build 2–3 deployed full-stack projects.' },
      { name: 'Internships', desc: 'Apply widely and track every application.' },
      { name: 'Placements', desc: 'Aptitude, interviews and offer negotiation.' }
    ]
  },
  data: {
    label: 'Data Science & AI',
    steps: [
      { name: 'Python', desc: 'Core syntax, functions and OOP.' },
      { name: 'Maths Foundations', desc: 'Statistics, probability and linear algebra.' },
      { name: 'NumPy & Pandas', desc: 'Data wrangling and analysis.' },
      { name: 'Visualisation', desc: 'Matplotlib, charts and storytelling.' },
      { name: 'SQL', desc: 'Query and join real datasets.' },
      { name: 'Machine Learning', desc: 'Regression, classification, evaluation.' },
      { name: 'Deep Learning', desc: 'Neural networks and frameworks.' },
      { name: 'Projects & Kaggle', desc: 'Competitions and a public portfolio.' },
      { name: 'Internships', desc: 'Apply with a project-backed resume.' }
    ]
  },
  core: {
    label: 'Core Electronics (ENTC/EEE)',
    steps: [
      { name: 'C Programming', desc: 'Pointers, memory and embedded C basics.' },
      { name: 'Digital Electronics', desc: 'Logic design, flip-flops and counters.' },
      { name: 'Microcontrollers', desc: 'Arduino / 8051 / ARM fundamentals.' },
      { name: 'PCB Design', desc: 'Schematic capture and layout tools.' },
      { name: 'Communication Systems', desc: 'Modulation, signals and networks.' },
      { name: 'IoT Projects', desc: 'Sensors, connectivity and cloud dashboards.' },
      { name: 'MATLAB / Simulation', desc: 'Simulate circuits and signals.' },
      { name: 'Internships & Core Jobs', desc: 'Target core companies and PSU exams.' }
    ]
  }
};

/* Sample placement eligibility criteria (Module 2 — Career).
   Replace with your college's real recruiter criteria. */
const COMPANIES = [
  { name: 'TechNova Systems', role: 'SDE Intern', minCgpa: 7.5, maxBacklogs: 0, branches: ['CSE', 'IT', 'ENTC'], years: [2027, 2028] },
  { name: 'CloudNine Software', role: 'Graduate Engineer Trainee', minCgpa: 6.5, maxBacklogs: 1, branches: ['CSE', 'IT', 'ENTC', 'EEE'], years: [2026, 2027] },
  { name: 'CircuitWorks', role: 'Embedded Engineer', minCgpa: 7.0, maxBacklogs: 0, branches: ['ENTC', 'EEE'], years: [2026, 2027, 2028] },
  { name: 'DataMesh Analytics', role: 'Data Analyst Intern', minCgpa: 7.0, maxBacklogs: 2, branches: ['CSE', 'IT', 'ENTC', 'MECH', 'CIVIL'], years: [2027, 2028] },
  { name: 'BuildRight Infra', role: 'Site Engineer Trainee', minCgpa: 6.0, maxBacklogs: 2, branches: ['CIVIL', 'MECH'], years: [2026, 2027] },
  { name: 'FinEdge', role: 'Business Analyst', minCgpa: 8.0, maxBacklogs: 0, branches: ['CSE', 'IT', 'ENTC', 'EEE', 'MECH', 'CIVIL'], years: [2026, 2027] }
];
