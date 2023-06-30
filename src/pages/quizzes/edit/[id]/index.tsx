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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getQuizById, updateQuizById } from 'apiSdk/quizzes';
import { Error } from 'components/error';
import { quizValidationSchema } from 'validationSchema/quizzes';
import { QuizInterface } from 'interfaces/quiz';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { TrainerInterface } from 'interfaces/trainer';
import { getTrainers } from 'apiSdk/trainers';

function QuizEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<QuizInterface>(
    () => (id ? `/quizzes/${id}` : null),
    () => getQuizById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: QuizInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateQuizById(id, values);
      mutate(updated);
      resetForm();
      router.push('/quizzes');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<QuizInterface>({
    initialValues: data,
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
            Edit Quiz
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(QuizEditPage);
