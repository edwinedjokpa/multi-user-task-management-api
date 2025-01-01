export interface EmailJobData {
  userEmail: string;
  subject: string;
  message: string;
}

export interface RealTimeJobData {
  user: { id: string; email: string };
  subject: string;
  message: string;
}
