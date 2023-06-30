import { CourseContentInterface } from 'interfaces/course-content';
import { ExerciseInterface } from 'interfaces/exercise';
import { QuizInterface } from 'interfaces/quiz';
import { UseCaseInterface } from 'interfaces/use-case';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface TrainerInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  course_content?: CourseContentInterface[];
  exercise?: ExerciseInterface[];
  quiz?: QuizInterface[];
  use_case?: UseCaseInterface[];
  user?: UserInterface;
  _count?: {
    course_content?: number;
    exercise?: number;
    quiz?: number;
    use_case?: number;
  };
}

export interface TrainerGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
