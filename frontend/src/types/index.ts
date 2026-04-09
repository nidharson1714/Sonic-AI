export interface User {
  id: number;
  username: string;
  email: string;
}

export interface GenerationJob {
  id: string;
  prompt: string;
  genre: string;
  status: 'queued' | 'processing' | 'inference' | 'complete' | 'failed';
  track_id?: number | null;
}

export interface Track {
  id: number;
  title: string;
  prompt_used: string;
  genre: string;
  duration_sec: number;
  file_path: string;
  created_at: string;
}
