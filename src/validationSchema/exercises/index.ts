import * as yup from 'yup';

export const exerciseValidationSchema = yup.object().shape({
  description: yup.string().required(),
  trainer_id: yup.string().nullable(),
});
