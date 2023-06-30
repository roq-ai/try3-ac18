import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createQuiz } from 'apiSdk/quizzes';
import { Error } from 'components/error';
import { quizValidationSchema } from 'validationSchema/quizzes';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { TrainerInterface } from 'interfaces/trainer';
import { getTrainers } from 'apiSdk/trainers';
import { QuizInterface } from 'interfaces/quiz';

function QuizCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: QuizInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createQuiz(values);
      resetForm();
      router.push('/quizzes');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<QuizInterface>({
    initialValues: {
      questions: '',
      trainer_id: (router.query.trainer_id as string) ?? null,
    },
    validationSchema: quizValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Quiz
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="questions" mb="4" isInvalid={!!formik.errors?.questions}>
            <FormLabel>Questions</FormLabel>
            <Input type="text" name="questions" value={formik.values?.questions} onChange={formik.handleChange} />
            {formik.errors.questions && <FormErrorMessage>{formik.errors?.questions}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<TrainerInterface>
            formik={formik}
            name={'trainer_id'}
            label={'Select Trainer'}
            placeholder={'Select Trainer'}
            fetcher={getTrainers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'quiz',
    operation: AccessOperationEnum.CREATE,
  }),
)(QuizCreatePage);
