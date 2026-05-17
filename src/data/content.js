// =====================================================================
// Single source of truth for portfolio content.
// Edit text/links here — everything in the UI flows from these constants.
// =====================================================================

export const SITE = {
  name: 'Paras Varshney',
  shortName: 'Paras',
  role: 'Sr. Data Scientist',
  email: 'paras.varshney97@gmail.com',
  location: 'Boston, MA',
  // To enable the Resume button: drop a resume.pdf in /public, then change
  // this to '/resume.pdf'. Empty string keeps the button hidden.
  resumeUrl: '',
  socials: [
    { name: 'GitHub',   url: 'https://github.com/blurred-machine' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/blurred-machine' },
    { name: 'Medium',   url: 'https://medium.com/@blurred-machine' },
    { name: 'Kaggle',   url: 'https://www.kaggle.com/blurredmachine' },
  ],
};

export const NAV_LINKS = [
  { num: '01', name: 'About',      href: '#about' },
  { num: '02', name: 'Experience', href: '#experience' },
  { num: '03', name: 'Work',       href: '#work' },
  { num: '04', name: 'Beyond',     href: '#around' },
  { num: '05', name: 'Contact',    href: '#contact' },
];

export const HERO = {
  intro: 'Hi, my name is',
  name: 'Paras Varshney.',
  tagline: 'I build AI that impacts millions.',
  description:
    "Sr. Data Scientist at Fidelity Investments — shipping real-time AI models that prevents fraud and safeguards our customers.",
  cta: { label: 'Check out my work', href: '#work' },
};

export const ABOUT = {
  photo: '/me.jpg',
  status: { live: true, label: 'Open to collaborate' },
  location: 'Boston, MA',
  currentlyAt: { company: 'Fidelity Investments', role: 'Sr. Data Scientist (Manager)' },
  // Headline KPI strip — bold numbers that anchor the section.
  stats: [
    { value: '5+',  label: 'years shipping production ML' },
    { value: '98%', label: 'fraud attempts prevented' },
    { value: '$25M',label: 'safeguarded monthly' },
    { value: '#63', label: 'Kaggle global rank' },
  ],
  paragraphs: [
    "Sr. Data Scientist and Manager of Fraud Intelligence at Fidelity Investments — building real-time ML that screens 6M trades a day, prevents ~98% of fraud attempts, and safeguards ~$25M monthly across Wealth Management, Retirement and Digital Assets.",
    "Five years across fraud, research and infrastructure: $4M secured for underwater mammal research with MIT at Egan Labs, 71% invoice processing reduction at Beyond Limits, and an open-source smart-city ITMS pipeline at LogicAI / IISc moving 900K points/min across 5 cities.",
    "Kaggle Master (#63 global). 1 of 16 Global Data Science Ambassadors at HP. Keynoted NVIDIA GTC 2021 and ODSC West 2022. M.S. Data Analytics Engineering, Northeastern (3.95). B.Tech CS, IIIT Kurnool (4.0).",
  ],
  // Tokens that get teal-highlighted inside the paragraphs above.
  highlights: [
    'Sr. Data Scientist', 'Manager of Fraud Intelligence', 'Fidelity Investments',
    '6M trades a day', '~98%', '$25M monthly',
    '$4M', '71% invoice processing reduction', '900K points/min',
    'Kaggle Master', '#63 global', '1 of 16 Global Data Science Ambassadors',
    'NVIDIA GTC 2021', 'ODSC West 2022',
    'M.S. Data Analytics Engineering, Northeastern', 'B.Tech CS, IIIT Kurnool',
    '3.95', '4.0',
  ],
  // Skills grouped by capability so the cloud has visual structure.
  skillGroups: [
    { label: 'Languages',  items: ['Python', 'SQL'] },
    { label: 'ML / DL',    items: ['PyTorch', 'TensorFlow'] },
    { label: 'GenAI',      items: ['LangChain', 'LangGraph', 'RAG / VectorDB', 'Multi-agent'] },
    { label: 'Data',       items: ['Kafka', 'Flink', 'SageMaker'] },
    { label: 'Ship',       items: ['Docker', 'Kubernetes'] },
  ],
};

export const JOBS = [
  {
    company: 'Fidelity',
    fullCompany: 'Fidelity Investments',
    title: 'Sr. Data Scientist (Manager)',
    team: 'Fraud Intelligence',
    url: 'https://www.fidelity.com',
    range: 'May 2024 — Present',
    current: true,
    metrics: [
      { value: '$25M', label: 'saved monthly' },
      { value: '6M', label: 'trades/day' },
      { value: '-68%', label: 'manual reviews' },
    ],
    tech: ['Python', 'SageMaker', 'Real-time ML', 'DocV', 'Explainability'],
    bullets: [
      'Lead the development and deployment of a real-time fraud-prevention engine analysing 200+ risk parameters with DocV auth layers — cut manual reviews by 68% and saving ~$25M monthly.',
      'Driving a High Frequency Trading fraud model at 6M trades/day, inferenced on SageMaker online distributed training.',
      'Automated the Customer Fraud Risk REST toolkit (CFR) for auth, verification and metrics — with bias mitigation, explainability and reason-code generation across the rule + model engine.',
      'Overseeing cyber-fraud capabilities across Wealth Management, Retirement plans, and Digital Assets.',
    ],
  },
  {
    company: 'Egan Labs',
    fullCompany: 'Egan Labs · with MIT',
    title: 'Data Science Researcher',
    team: 'Acoustic ML',
    url: 'https://www.northeastern.edu',
    range: 'Feb 2023 — May 2024',
    metrics: [
      { value: '$4M', label: 'funding secured' },
      { value: '0.983', label: 'silhouette score' },
      { value: '200M', label: 'samples clustered' },
    ],
    tech: ['PyTorch', 'PCA', 't-SNE', 'Streamlit', 'Signal Processing'],
    bullets: [
      'Redesigned an acoustic array for underwater mammal sound clustering — achieved a silhouette coefficient of 0.983 across 200M samples (4k–500k Hz).',
      'Built a real-time Streamlit GUI for end-to-end visualisation, plus a geospatial localization map tying acoustic + GPS sensor data.',
      'Collaborated with MIT researchers on the Gulf of Mexico expedition — work helped secure $4M in funding for a 6-fold subsection v2 array.',
      'Used PCA, t-SNE, and spectrogram signal processing to reach 95% recognition accuracy on cluttered audio.',
    ],
  },
  {
    company: 'HP',
    fullCompany: 'HP · Z by HP',
    title: 'Global Data Science Ambassador',
    team: 'Z by HP',
    url: 'https://www.hp.com',
    range: 'Aug 2020 — Oct 2023',
    metrics: [
      { value: '1 of 16', label: 'global ambassadors' },
      { value: '2', label: 'global keynotes' },
      { value: '13', label: 'Kaggle comps led' },
    ],
    tech: ['NVIDIA', 'Z by HP', 'Kaggle', 'GTC', 'ODSC'],
    bullets: [
      'One of 16 Global Data Science Ambassadors worldwide for HP — partnered with NVIDIA on GPU-accelerated DS workflows.',
      'Keynoted NVIDIA GTC AI 2021 and ODSC West 2022, showcasing applied advances in AI and data science.',
      'Initiated community + mentorship programs across Kaggle, mentoring teams to KaggleDays x HP global championship wins.',
      'Acted as a bridge between industry stakeholders and emerging data scientists worldwide.',
    ],
  },
  {
    company: 'Beyond Limits',
    fullCompany: 'Beyond Limits',
    title: 'Data Science Intern',
    team: 'Applied AI',
    url: 'https://www.beyond.ai',
    range: 'Jun 2023 — Aug 2023',
    metrics: [
      { value: '-71%', label: 'invoice time' },
      { value: '-0.6×', label: 'prediction error' },
    ],
    tech: ['NLP', 'Form Recognizers', 'Oracle', 'AWS S3'],
    bullets: [
      'Cut invoice processing time by 71% by leveraging Form Recognizers + real-time account-code suggestions.',
      'Reduced prediction error by 0.6x with NLP + hierarchical classification strategies.',
      'Led a streamlined ERP integration eliminating manual Chart-of-Accounts lookups, on Oracle DB + AWS S3.',
    ],
  },
  {
    company: 'Logic AI',
    fullCompany: 'Logic AI · IISc',
    title: 'Data Scientist — ITMS',
    team: 'Smart City',
    url: 'https://logicai.io',
    range: 'Apr 2020 — Sep 2022',
    metrics: [
      { value: '900K', label: 'pts/min ingestion' },
      { value: '5', label: 'smart cities' },
      { value: '0.91', label: 'F1 stable' },
    ],
    tech: ['Kafka', 'Flink', 'SageMaker', 'Databricks', 'CI/CD'],
    bullets: [
      'Improved real-time ingestion by 15% by shifting to Kafka Streams — 1.5x ITMS forecasting throughput on 1.2M points/min.',
      'Drove error rate down to a stable 0.91 F1 with hierarchical classification + drift analysis on AWS SageMaker.',
      'Built an open-source ITMS ingestion pipeline serving 5 smart cities at 900k pts/min, lifting throughput 1.6x.',
      'Reduced congestion 20% via transport-data governance on Databricks, while accelerating CI/CD MLOps by 15%.',
    ],
  },
];

// "Featured" projects — Paras's most impactful work, treated as case studies.
export const PROJECTS_FEATURED = [
  {
    title: 'Real-Time Fraud Prevention Engine',
    org: 'Fidelity Investments',
    accent: 'fraud',
    description:
      'A production fraud-risk engine analysing 200+ live signals per transaction with DocV auth layers and real-time risk ratings. Built-in bias mitigation and reason-code generation make every decision auditable. Cut manual reviews 68% and saves an estimated $25M monthly.',
    tech: ['Python', 'AWS SageMaker', 'Real-time ML', 'Explainability'],
    links: [],
  },
  {
    title: 'Acoustic Array for Marine Mammal Clustering',
    org: 'Egan Labs · with MIT',
    accent: 'acoustic',
    description:
      'Redesigned an underwater acoustic array, then layered state-of-the-art clustering across 200M samples spanning 4k–500k Hz. Reached a 0.983 silhouette coefficient and a 95% recognition rate — work that helped secure $4M in funding for a 6-fold subsection v2.',
    tech: ['PyTorch', 'Signal Processing', 'PCA / t-SNE', 'Streamlit'],
    links: [],
  },
  {
    title: 'ITMS Smart-City Forecasting Pipeline',
    org: 'Logic AI · IISc',
    accent: 'transport',
    description:
      'An open-source intelligent-transport pipeline ingesting 900k points/min from 5 smart cities. Kafka Streams + Apache Flink with hierarchical drift-aware classifiers held a stable 0.91 F1 while pushing throughput 1.6x and reducing congestion 20%.',
    tech: ['Kafka Streams', 'Apache Flink', 'Databricks', 'SageMaker'],
    links: [],
  },
  {
    title: 'NLP-Driven Invoice Intelligence',
    org: 'Beyond Limits',
    accent: 'invoice',
    description:
      'A Form-Recognizer + hierarchical-NLP workflow that proposes account codes in real time. Cut invoice processing time by 71% and shaved 0.6x off prediction error — eliminating manual Chart-of-Accounts lookups across the ERP.',
    tech: ['NLP', 'Form Recognizers', 'AWS S3', 'Oracle'],
    links: [],
  },
];

// Smaller "noteworthy" cards — talks, recognition, side work.
export const PROJECTS_OTHER = [
  {
    title: 'NVIDIA GTC AI 2021 — Speaker',
    description: 'Keynoted GPU-accelerated DS workflows in collaboration with NVIDIA, on behalf of Z by HP.',
    tech: ['Keynote', 'NVIDIA', 'HP'],
    links: [],
  },
  {
    title: 'ODSC West 2022 — Speaker',
    description: 'Talk on production-grade ML lessons across fraud, transport and research deployments.',
    tech: ['ODSC', 'Talk', 'MLOps'],
    links: [],
  },
  {
    title: 'Kaggle Master — Rank #63',
    description: 'Global rank in competitive ML; organized 13 KaggleDays x HP competitions as mentor/judge.',
    tech: ['Kaggle', 'Mentorship'],
    links: [{ label: 'Profile', href: 'https://www.kaggle.com/blurredmachine' }],
  },
  {
    title: 'Towards Data Science (Medium)',
    description: 'Author with 10–15k monthly readers — articles on statistics, ML and applied data science.',
    tech: ['Writing', 'TDS', 'Medium'],
    links: [{ label: 'Read', href: 'https://medium.com/@blurred-machine' }],
  },
  {
    title: 'HP Global DS Ambassador',
    description: '1 of 16 worldwide, 2020–23 — thought leadership at the intersection of hardware + AI.',
    tech: ['HP', 'Z by HP', 'Community'],
    links: [],
  },
  {
    title: 'M.S. Data Analytics Engineering',
    description: 'Northeastern University · GPA 3.95 / 4.0. President, Data Science Club (1500+ members).',
    tech: ['Northeastern', 'GPA 3.95'],
    links: [{ label: 'Northeastern', href: 'https://www.northeastern.edu' }],
  },
];

// Kaggle has no public API for personal profile data, so this list is
// curated. Add/remove highlights here — each links out to Kaggle.
export const KAGGLE_HIGHLIGHTS = [
  {
    title: 'Kaggle Master · Global Rank #63',
    description:
      'Top-tier global ranking across competitive ML — earned through sustained top-percentile finishes on production-grade datasets.',
    badge: 'Master Tier',
    url: 'https://www.kaggle.com/blurredmachine',
  },
  {
    title: 'KaggleDays × Z by HP Global Championship',
    description:
      'Mentored teams that placed in the global championship — a flagship Kaggle event run with the Z by HP partnership.',
    badge: 'Mentor',
    url: 'https://www.kaggle.com/blurredmachine',
  },
  {
    title: '13 Orchestrated Competitions',
    description:
      'Organized 13 KaggleDays competitions while at LogicAI, broadening reach and onboarding hundreds of new data scientists.',
    badge: 'Organizer',
    url: 'https://www.kaggle.com/blurredmachine',
  },
];

export const CONTACT = {
  heading: "What's Next?",
  title: 'Get In Touch',
  body:
    "I'm always interested in conversations about applied AI, advanced analytics, agentic systems, and production ML. Whether you have a problem to solve or just want to swap notes, my inbox is open. I'll do my best to reply.",
  email: 'blurredai.hello@gmail.com',
  cta: {
    label: 'Schedule a 1:1 call',
    href: 'https://superprofile.bio/bookings/blurredai?sessionId=6a08fbcfeebe850013e54587',
    external: true,
  },
};
