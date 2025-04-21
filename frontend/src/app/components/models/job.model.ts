export interface Job {
  id: number;
  company: string;
  role: string;
  salary: number;
  type: string;
  postedDate: string;
  applied?: boolean; // ✅ Added this optional property
}
