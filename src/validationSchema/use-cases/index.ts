import * as yup from 'yup';

export const useCaseValidationSchema = yup.object().shape({
  description: yup.string().required(),
  trainer_id: yup.string().nullable(),
});
