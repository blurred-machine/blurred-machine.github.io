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
  resumeCta: {
    label: 'Download Resume',
    href: '/paras_varshney_resume.pdf',
    external: true,
  },
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
    "Kaggle Master (#63 global, top 0.001%). 1 of 16 Global Data Science Ambassadors at HP. Keynoted NVIDIA GTC 2021 and ODSC West 2022. M.S. Data Analytics Engineering, Northeastern (3.92). B.Tech CS, IIIT (9.06/10).",
  ],
  // Tokens that get teal-highlighted inside the paragraphs above.
  highlights: [
    'Sr. Data Scientist', 'Manager of Fraud Intelligence', 'Fidelity Investments',
    '6M trades a day', '~98%', '$25M monthly',
    '$4M', '71% invoice processing reduction', '900K points/min',
    'Kaggle Master', '#63 global', '1 of 16 Global Data Science Ambassadors',
    'NVIDIA GTC 2021', 'ODSC West 2022',
    'M.S. Data Analytics Engineering, Northeastern', 'B.Tech CS, IIIT',
    '3.92', '9.06/10', 'top 0.001%',
  ],
  // Skills grouped by capability — mirrors the 8-category breakdown on the
  // resume so what's shown here is what's on paper.
  skillGroups: [
    { label: 'Languages',           items: ['Python', 'SQL', 'R', 'Java', 'Rust'] },
    { label: 'Databases & Big Data',items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Snowflake', 'BigQuery', 'Spark', 'Databricks'] },
    { label: 'ML & Statistics',     items: ['scikit-learn', 'XGBoost', 'pandas', 'NumPy', 'A/B Testing', 'Causal Inference', 'Time-Series'] },
    { label: 'Deep Learning & NLP', items: ['PyTorch', 'TensorFlow', 'Hugging Face', 'BERT', 'spaCy'] },
    { label: 'GenAI & LLMs',        items: ['LangChain', 'LangGraph', 'LlamaIndex', 'RAG', 'Agentic AI', 'Multi-agent', 'MCP'] },
    { label: 'LLM Engineering',     items: ['Prompt Engineering', 'LoRA / PEFT', 'Embeddings', 'Pinecone', 'FAISS', 'Chroma', 'Weaviate', 'GPT-4', 'Claude', 'RAGAS', 'LangSmith', 'NeMo Guardrails'] },
    { label: 'MLOps & Cloud',       items: ['Docker', 'Kubernetes', 'MLflow', 'FastAPI', 'Airflow', 'AWS SageMaker', 'AWS Bedrock', 'GCP Vertex AI', 'CI/CD', 'Evidently'] },
    { label: 'Viz & Tools',         items: ['Tableau', 'Power BI', 'Streamlit', 'Plotly', 'matplotlib', 'Git', 'Kafka', 'Scala', 'Linux', 'Jupyter', 'DBT'] },
  ],
};

export const JOBS = [
  {
    company: 'Fidelity',
    fullCompany: 'Fidelity Investments',
    title: 'Senior Data Scientist',
    team: 'Fraud Intelligence',
    url: 'https://www.fidelity.com',
    range: 'Jun 2024 — Present',
    current: true,
    metrics: [
      { value: '$25M+', label: 'fraud prevented / mo' },
      { value: '6M+', label: 'daily trades' },
      { value: '<100ms', label: 'inference latency' },
    ],
    tech: ['PySpark', 'AWS SageMaker', 'Transformers', 'FastAPI', 'Docker', 'Kubernetes', 'MLflow', 'SHAP', 'Evidently'],
    bullets: [
      'Owned development of real-time, low-latency fraud detection on 6M+ daily trades — built transformer-based ensemble models on PySpark feature pipelines with distributed training on AWS SageMaker, achieving sub-100ms inference latency.',
      'Drove production deployment of the fraud-prevention engine, engineering 2000+ risk features for real-time scoring with model governance and threshold tuning — prevented $25M/month in fraud losses while reducing manual reviews by 68%.',
      'Led team to build the Customer Fraud Risk REST API (FastAPI, Docker, Kubernetes, MLflow, CI/CD) serving real-time risk scores with SHAP-based explainability, bias mitigation, and drift monitoring (Evidently) across rule and ML engines.',
    ],
  },
  {
    company: 'Egan Labs',
    fullCompany: 'Egan Labs · MIT',
    title: 'Data Science Researcher',
    team: 'Acoustic ML',
    url: 'https://www.northeastern.edu',
    range: 'Feb 2023 — May 2024',
    metrics: [
      { value: '$4M', label: 'funding secured' },
      { value: '0.983', label: 'silhouette score' },
      { value: '200M+', label: 'samples clustered' },
    ],
    tech: ['K-Means', 'DBSCAN', 'Hierarchical Clustering', 'pandas', 'NumPy', 'SciPy', 'Plotly', 'Streamlit', 'FFT'],
    bullets: [
      'Designed an acoustic array for underwater mammal sound clustering — applied unsupervised ML (K-Means, DBSCAN, hierarchical clustering) on 200M+ samples across 4k–500k Hz bands, achieving a silhouette coefficient of 0.983.',
      'Developed a real-time Streamlit GUI for end-to-end data visualisation and EDA, leveraging pandas, NumPy, SciPy, and Plotly for large-scale signal processing pipelines with FFT-based feature extraction.',
      'Collaborated with MIT researchers on data acquisition expeditions, securing $4M in funding for a v2 build with a 6-fold subsection array; co-authored findings for a peer-reviewed publication.',
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
    fullCompany: 'Logic AI',
    title: 'Data Scientist',
    team: 'ITMS',
    url: 'https://logicai.io',
    range: 'Apr 2020 — Sep 2022',
    metrics: [
      { value: '1.2M', label: 'data pts/min' },
      { value: '1.5×', label: 'forecasting throughput' },
      { value: '0.91', label: 'F1 score' },
    ],
    tech: ['PySpark', 'Dask', 'Kafka', 'Airflow', 'AWS SageMaker', 'S3', 'MLflow'],
    bullets: [
      'Improved real-time ingestion efficiency by 15% via Kafka Streams migration, accelerating ITMS time-series forecasting throughput by 1.5× and handling 1.2M data points/minute.',
      'Reduced error rate by 0.6× to a stable 0.91 F1 score using hierarchical classification and concept-drift detection on AWS SageMaker and S3, with MLflow for model tracking and monitoring.',
      'Built and orchestrated production ETL pipelines for real-time data ingestion using PySpark, Dask, Kafka, and Airflow for model inference, scheduling, execution, and observability.',
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
