// File: src/data/sampleResume.ts

export const SAMPLE_JOB_DESCRIPTION = `We are looking for a Senior Software Engineer to join our growing team.

Requirements:
- 5+ years of experience in software development
- Strong proficiency in TypeScript, React, and Node.js
- Experience with cloud platforms (AWS, GCP, or Azure)
- Experience with SQL and NoSQL databases
- Knowledge of CI/CD pipelines and DevOps practices
- Excellent problem-solving and communication skills
- Experience with agile/scrum methodologies

Nice to have:
- Experience with microservices architecture
- Familiarity with containerization (Docker, Kubernetes)
- Open-source contributions
- Experience leading or mentoring engineers
`;
import { v4 as uuidv4 } from 'uuid';
import type { Resume } from '../types/resume';

const ID = {
  summary: uuidv4(),
  experience: uuidv4(),
  education: uuidv4(),
  skills: uuidv4(),
  projects: uuidv4(),
  certifications: uuidv4(),
  languages: uuidv4(),
  awards: uuidv4(),
  exp1: uuidv4(),
  exp2: uuidv4(),
  edu1: uuidv4(),
  proj1: uuidv4(),
  proj2: uuidv4(),
  cert1: uuidv4(),
  cert2: uuidv4(),
  lang1: uuidv4(),
  lang2: uuidv4(),
  award1: uuidv4(),
  b1: uuidv4(), b2: uuidv4(), b3: uuidv4(),
  b4: uuidv4(), b5: uuidv4(), b6: uuidv4(),
  pb1: uuidv4(), pb2: uuidv4(),
  sg1: uuidv4(), sg2: uuidv4(), sg3: uuidv4(), sg4: uuidv4(),
};

export const SAMPLE_RESUME: Resume = {
  meta: {
    version: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: 'My Resume',
  },
  header: {
    name: 'Alex Johnson',
    title: 'Senior Software Engineer',
    tagline: 'Building scalable, user-centric solutions for 6+ years',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'https://alexjohnson.dev',
    linkedin: 'linkedin.com/in/alexjohnson',
    github: 'github.com/alexjohnson',
    photo: '',
  },
  sections: [
    {
      id: ID.summary,
      type: 'summary',
      label: 'Summary',
      enabled: true,
      order: 0,
      content: {
        type: 'summary',
        text: 'Results-driven Senior Software Engineer with 6+ years of experience designing and delivering high-performance web applications. Proven track record in TypeScript, React, and cloud-native architectures. Passionate about clean code, developer experience, and building products that scale.',
      },
    },
    {
      id: ID.experience,
      type: 'experience',
      label: 'Experience',
      enabled: true,
      order: 1,
      content: {
        type: 'experience',
        items: [
          {
            id: ID.exp1,
            company: 'Acme Technologies',
            role: 'Senior Software Engineer',
            startDate: '2021-03',
            endDate: '',
            current: true,
            location: 'San Francisco, CA',
            employmentType: 'Full-time',
            techStack: ['TypeScript', 'React', 'Node.js', 'AWS', 'PostgreSQL'],
            bullets: [
              { id: ID.b1, text: 'Architected and shipped a real-time collaboration platform serving 50,000+ daily active users, reducing latency by 40%.' },
              { id: ID.b2, text: 'Led migration from monolith to microservices, improving deployment frequency from monthly to daily releases.' },
              { id: ID.b3, text: 'Mentored 4 junior engineers, introducing code review standards and CI/CD best practices that reduced bug rate by 30%.' },
            ],
          },
          {
            id: ID.exp2,
            company: 'StartupHub Inc.',
            role: 'Software Engineer',
            startDate: '2018-06',
            endDate: '2021-02',
            current: false,
            location: 'Remote',
            employmentType: 'Full-time',
            techStack: ['JavaScript', 'Vue.js', 'Python', 'Django', 'Redis'],
            bullets: [
              { id: ID.b4, text: 'Built and owned the customer-facing analytics dashboard used by 200+ enterprise clients.' },
              { id: ID.b5, text: 'Optimized SQL query performance reducing average page load times from 4.2s to 0.8s.' },
              { id: ID.b6, text: 'Integrated Stripe payment APIs handling $2M+ in monthly transactions with 99.99% uptime.' },
            ],
          },
        ],
      },
    },
    {
      id: ID.education,
      type: 'education',
      label: 'Education',
      enabled: true,
      order: 2,
      content: {
        type: 'education',
        items: [
          {
            id: ID.edu1,
            institution: 'University of California, Berkeley',
            degree: 'B.S.',
            field: 'Computer Science',
            startDate: '2014-08',
            endDate: '2018-05',
            gpa: '3.8',
            honors: 'Magna Cum Laude',
          },
        ],
      },
    },
    {
      id: ID.skills,
      type: 'skills',
      label: 'Skills',
      enabled: true,
      order: 3,
      content: {
        type: 'skills',
        groups: [
          { id: ID.sg1, category: 'Languages', skills: 'TypeScript, JavaScript, Python, SQL, Bash' },
          { id: ID.sg2, category: 'Frontend', skills: 'React, Next.js, Vue.js, Tailwind CSS, Vite' },
          { id: ID.sg3, category: 'Backend & Cloud', skills: 'Node.js, Django, PostgreSQL, Redis, AWS, Docker' },
          { id: ID.sg4, category: 'Tools & Practices', skills: 'Git, GitHub Actions, Jest, Cypress, Agile/Scrum' },
        ],
      },
    },
    {
      id: ID.projects,
      type: 'projects',
      label: 'Projects',
      enabled: true,
      order: 4,
      content: {
        type: 'projects',
        items: [
          {
            id: ID.proj1,
            name: 'OpenMetrics Dashboard',
            description: 'Open-source observability dashboard with real-time data streaming.',
            techStack: 'React, WebSocket, InfluxDB, Grafana',
            url: 'https://github.com/alexjohnson/openmetrics',
            githubUrl: 'https://github.com/alexjohnson/openmetrics',
            liveUrl: 'https://openmetrics.alexjohnson.dev',
            role: 'Creator & Maintainer',
            startDate: '2022-01',
            endDate: '2023-06',
            bullets: [
              { id: ID.pb1, text: 'Grew to 1,200+ GitHub stars and 80+ contributors in 18 months.' },
              { id: ID.pb2, text: 'Implemented custom WebSocket engine handling 10,000+ concurrent data streams.' },
            ],
          },
          {
            id: ID.proj2,
            name: 'CareerCraft',
            description: 'AI-powered resume builder with ATS scoring and PDF export — the app you are using right now.',
            techStack: 'React, TypeScript, Vite, Tailwind CSS, Zustand',
            url: 'https://github.com/alexjohnson/careercraft',
            githubUrl: 'https://github.com/alexjohnson/careercraft',
            liveUrl: '',
            role: 'Lead Developer',
            startDate: '2024-01',
            endDate: '',
            bullets: [],
          },
        ],
      },
    },
    {
      id: ID.certifications,
      type: 'certifications',
      label: 'Certifications',
      enabled: true,
      order: 5,
      content: {
        type: 'certifications',
        items: [
          { id: ID.cert1, name: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', date: '2023-04', expiry: '2026-04', url: 'https://aws.amazon.com/certification/', credential: 'AWS-SAA-12345' },
          { id: ID.cert2, name: 'Professional Scrum Master I (PSM I)', issuer: 'Scrum.org', date: '2022-11', expiry: '', url: '', credential: '' },
        ],
      },
    },
    {
      id: ID.languages,
      type: 'languages',
      label: 'Languages',
      enabled: true,
      order: 6,
      content: {
        type: 'languages',
        items: [
          { id: ID.lang1, language: 'English', proficiency: 'Native' },
          { id: ID.lang2, language: 'Spanish', proficiency: 'Intermediate' },
        ],
      },
    },
    {
      id: ID.awards,
      type: 'awards',
      label: 'Awards',
      enabled: false,
      order: 7,
      content: {
        type: 'awards',
        items: [
          { id: ID.award1, title: 'Engineer of the Year', organization: 'Acme Technologies', date: '2023-12', description: 'Recognized for leading the platform reliability initiative that achieved 99.99% uptime.' },
        ],
      },
    },
  ],
  styles: {
    templateId: 'modern',
    fontFamily: 'Inter',
    fontSize: 14,
    primaryColor: '#2563eb',
    accentColor: '#3b82f6',
    spacing: 'normal',
    columns: 1,
  },
};
