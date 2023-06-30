import { TrainerInterface } from 'interfaces/trainer';
import { GetQueryInterface } from 'interfaces';

export interface CourseContentInterface {
  id?: string;
  content: string;
  trainer_id?: string;
  created_at?: any;
  updated_at?: any;

  trainer?: TrainerInterface;
  _count?: {};
}

export interface CourseContentGetQueryInterface extends GetQueryInterface {
  id?: string;
  content?: string;
  trainer_id?: string;
}
