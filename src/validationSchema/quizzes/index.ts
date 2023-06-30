import * as yup from 'yup';

export const quizValidationSchema = yup.object().shape({
  questions: yup.string().required(),
  trainer_id: yup.string().nullable(),
});
