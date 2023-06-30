import * as yup from 'yup';

export const courseContentValidationSchema = yup.object().shape({
  content: yup.string().required(),
  trainer_id: yup.string().nullable(),
});
