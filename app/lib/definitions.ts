export type Role = 'guest' | 'user' | 'admin';
export type AuthRole = Exclude<Role, 'guest'>;

export type Subject = {
  slug: string;
  name: string;
  teacher: string;
};

export type Deadline = {
  id: number;
  title: string;
  subjectSlug: string;
  dueDate: string; // ISO 8601
  description: string;
};

export type DeadlineStore = {
  subjects: Subject[];
  deadlines: Deadline[];
  completions: Record<string, number[]>;
};
