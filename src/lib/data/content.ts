import { env } from '$env/dynamic/public';
import type { AboutStat, ContactChannel, NavLink, SkillCategory } from '$lib/types';

const contactEmail = env.PUBLIC_CONTACT_EMAIL || 'muriukipn@gmail.com';

export const navLinks: NavLink[] = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' }
];

export const typingPhrases = [
  'ICT Management Professional',
  'Technical Support Specialist',
  'Systems Administration',
  'Problem Solver'
];

export const skillCategories: SkillCategory[] = [
  {
    title: 'Development',
    icon: 'code',
    items: ['Python', 'JavaScript', 'Java', 'HTML', 'CSS', 'Visual Basic', 'MySQL', 'OOP']
  },
  {
    title: 'Infrastructure & Security',
    icon: 'shield',
    items: [
      'Linux / Unix',
      'Windows Server',
      'Active Directory',
      'Cisco Networking',
      'Network Security',
      'ITIL',
      'Incident Mgmt'
    ]
  },
  {
    title: 'Tools & Platforms',
    icon: 'wrench',
    items: [
      'Windows',
      'Linux',
      'Android',
      'Virtualisation',
      'Git / GitHub',
      'MS Office',
      'Agile / Scrum',
      'IT Project Mgmt',
      'System Recovery'
    ]
  }
];

export const aboutParagraphs = [
  'I hold a B.Sc. in ICT Management from Maseno University and have hands-on experience in technical support, systems administration, and IT service delivery gained during my attachment at the Public Service Commission, Kenya. I achieved a 92% first-call resolution rate supporting 200+ government employees, and I hold Cisco CyberOps and IoT certifications.',
  "I'm passionate about building efficient, secure IT environments and combining technical rigour with user-centred thinking to solve real-world problems. Currently seeking roles in IT support engineering, systems administration, network operations, and cybersecurity."
];

export const aboutStats: AboutStat[] = [
  { value: '92%', label: 'First-call Resolution' },
  { value: '200+', label: 'Users Supported' },
  { value: '3', label: 'Certifications' }
];

export const contactChannels: ContactChannel[] = [
  { icon: 'mail', label: contactEmail, href: `mailto:${contactEmail}` },
  { icon: 'phone', label: '+254 725 091 032', href: 'tel:+254725091032' },
  { icon: 'pin', label: 'Nairobi, Kenya' },
  { icon: 'github', label: 'GitHub', href: 'https://github.com/14ag', external: true },
  { icon: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/14ag', external: true }
];
