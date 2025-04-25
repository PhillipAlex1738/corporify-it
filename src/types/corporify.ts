
import { ToneOption } from '@/hooks/useCorporify';

export type CorporifyHistory = {
  id: string;
  input: string;
  output: string;
  timestamp: string;
  tone: ToneOption;
  isSaved?: boolean;
};
