export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  photoUrl?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  employmentType?: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CustomSection {
  id: string;
  name: string;
  type: 'list' | 'text';
  items: CustomSectionItem[];
  content: string;
  visible: boolean;
}

export interface ResumeSettings {
  template: 'classic' | 'modern';
  primaryColor: string;
  fontFamily: string;
  dividerStyle: 'solid' | 'dashed' | 'dotted' | 'none';
  dividerWidth: '1px' | '2px' | '3px' | '4px';
  dividerOpacity: number; // 0 to 100
  dividerLength: '25%' | '50%' | '75%' | '100%';
  dividerAlignment: 'left' | 'center' | 'right';
  showMainHeaderDivider: boolean;
  showSummaryDivider: boolean;
  showExperienceDivider: boolean;
  showEducationDivider: boolean;
  showSkillsDivider: boolean;
  documentSpacing: 'tight' | 'normal' | 'relaxed';
  fontSize: '10pt' | '11pt' | '12pt';
  textColor: string;
  paperSize: 'a4' | 'letter';
  experienceFormat: 'bullets' | 'paragraph';
  sectionOrder?: string[];
  dateFormat?: 'short' | 'slash' | 'dot' | 'full';
  headerTransform?: 'uppercase' | 'capitalize' | 'lowercase' | 'normal-case';
  nameTransform?: 'uppercase' | 'capitalize' | 'lowercase' | 'normal-case';
  headerAlignment?: 'left' | 'center' | 'right';
  nameSize?: 'text-2xl' | 'text-3xl' | 'text-4xl' | 'text-5xl';
  jobTitleSize?: 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';
  contactInfoSize?: 'text-xs' | 'text-sm' | 'text-base';
  photoShape?: 'circle' | 'square' | 'rounded';
  photoSize?: 'small' | 'medium' | 'large' | 'xlarge';
  photoPosition?: 'left' | 'right' | 'top';
  language?: string;
  showAtConnector?: boolean;
  showInConnector?: boolean;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  educations: Education[];
  skills: string; // Comma or newline separated for simplicity
  customSections: CustomSection[];
  settings: ResumeSettings;
}

export const initialResumeData: ResumeData = {
  settings: {
    template: 'classic',
    primaryColor: '#0f172a',
    fontFamily: 'Arial, sans-serif',
    dividerStyle: 'solid',
    dividerWidth: '1px',
    dividerOpacity: 100,
    dividerLength: '100%',
    dividerAlignment: 'left',
    showMainHeaderDivider: true,
    showSummaryDivider: true,
    showExperienceDivider: true,
    showEducationDivider: true,
    showSkillsDivider: true,
    documentSpacing: 'normal',
    fontSize: '11pt',
    textColor: '#334155', // slate-700
    paperSize: 'a4',
    experienceFormat: 'bullets',
    sectionOrder: ['summary', 'experience', 'education', 'skills'],
    dateFormat: 'short',
    headerTransform: 'uppercase',
    nameTransform: 'uppercase',
    headerAlignment: 'left',
    nameSize: 'text-4xl',
    jobTitleSize: 'text-lg',
    contactInfoSize: 'text-sm',
    photoShape: 'circle',
    photoSize: 'medium',
    photoPosition: 'left',
    language: 'en',
    showAtConnector: true,
    showInConnector: true,
  },
  personalInfo: {
    fullName: 'Jane Doe',
    jobTitle: 'Senior Software Engineer',
    email: 'jane.doe@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    website: 'linkedin.com/in/janedoe',
    summary: 'A passionate and results-driven software engineer with over 5 years of experience in building scalable web applications. Proven ability to lead cross-functional teams and deliver high-quality software on time.',
  },
  experiences: [
    {
      id: 'exp1',
      company: 'Tech Innovators Inc.',
      position: 'Senior Software Engineer',
      startDate: '2020-01',
      endDate: '',
      current: true,
      employmentType: 'Full-time',
      description: '• Spearheaded the development of a microservices architecture, reducing system latency by 30%.\n• Mentored junior developers and led code review processes to maintain code quality.',
    },
    {
      id: 'exp2',
      company: 'Web Solutions LLC',
      position: 'Software Engineer',
      startDate: '2017-06',
      endDate: '2019-12',
      current: false,
      employmentType: 'Full-time',
      description: '• Developed and maintained RESTful APIs for the core product, serving over 1M daily requests.\n• Collaborated with product managers and designers to implement new features.',
    }
  ],
  educations: [
    {
      id: 'edu1',
      institution: 'University of Technology',
      degree: 'Master of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2015-09',
      endDate: '2017-05',
      description: '',
    },
    {
      id: 'edu2',
      institution: 'State University',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Engineering',
      startDate: '2011-09',
      endDate: '2015-05',
      description: '',
    }
  ],
  skills: 'JavaScript, TypeScript, React, Node.js, Python, PostgreSQL, AWS, Docker, Git',
  customSections: [],
};
