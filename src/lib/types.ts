export type ThemeMode = 'dark' | 'light';

export type NavSectionId = 'home' | 'projects' | 'skills' | 'about' | 'contact';

export interface NavLink {
  id: NavSectionId;
  label: string;
}

export interface Project {
  icon: string;
  title: string;
  description: string;
  techs: string[];
  _url: string;
  category: string;
  live_url?: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  message_body: string;
}

export interface SkillCategory {
  title: string;
  icon: 'code' | 'shield' | 'wrench';
  items: string[];
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface ContactChannel {
  icon: 'mail' | 'phone' | 'pin' | 'github' | 'linkedin';
  label: string;
  href?: string;
  external?: boolean;
}

export type SectionChangeHandler = (section: NavSectionId) => void;
