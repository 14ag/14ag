export type ProjectIcon = 'file' | 'pc' | 'folder' | 'net' | 'camera';

export interface ProjectForm {
  icon: ProjectIcon;
  title: string;
  description: string;
  techs: string[];
  _url: string;
  live_url?: string;
  category: string;
}

export interface ProjectRecord extends ProjectForm {
  id: number;
}

export interface ProjectsResponse {
  projects: ProjectRecord[];
  categories: string[];
}

export type FormErrors = Partial<Record<keyof ProjectForm | 'techDraft', string>>;
