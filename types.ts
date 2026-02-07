
export type Role = 'user' | 'model';

export interface Message {
  role: Role;
  text: string;
  timestamp: Date;
}

export interface PersonaState {
  hasIntroduced: boolean;
  detectedUserGender: 'male' | 'female' | 'unknown';
  aiGender: 'male' | 'female' | 'neutral';
  nameRevealed: boolean;
  emotionalState: 'distant' | 'friendly' | 'sweet' | 'romantic' | 'ended';
  assignedName: string | null;
}
