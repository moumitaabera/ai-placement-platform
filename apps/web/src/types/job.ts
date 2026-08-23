export interface Job {
  id: string;
  title: string;
  description: string;
  location?: string;
  salary?: string;
  employmentType: string;
  experienceLevel: string;
  skills: string[];
  // deadline?: string;
  deadline?: string | null;
  createdAt: string;
}

export interface JobPayload {
  title: string;
  description: string;
  location?: string;
  salary?: string;
  employmentType: string;
  experienceLevel: string;
  skills: string[];
  deadline?: string;
}