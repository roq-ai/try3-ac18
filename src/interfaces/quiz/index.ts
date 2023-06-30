import { TrainerInterface } from 'interfaces/trainer';
import { GetQueryInterface } from 'interfaces';

export interface QuizInterface {
  id?: string;
  questions: string;
  trainer_id?: string;
  created_at?: any;
  updated_at?: any;

  trainer?: TrainerInterface;
  _count?: {};
}

export interface QuizGetQueryInterface extends GetQueryInterface {
  id?: string;
  questions?: string;
  trainer_id?: string;
}
