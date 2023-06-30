import { TrainerInterface } from 'interfaces/trainer';
import { GetQueryInterface } from 'interfaces';

export interface ExerciseInterface {
  id?: string;
  description: string;
  trainer_id?: string;
  created_at?: any;
  updated_at?: any;

  trainer?: TrainerInterface;
  _count?: {};
}

export interface ExerciseGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  trainer_id?: string;
}
