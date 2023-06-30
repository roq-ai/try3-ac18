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
import { createCourseContent } from 'apiSdk/course-contents';
import { Error } from 'components/error';
import { courseContentValidationSchema } from 'validationSchema/course-contents';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { TrainerInterface } from 'interfaces/trainer';
import { getTrainers } from 'apiSdk/trainers';
import { CourseContentInterface } from 'interfaces/course-content';

function CourseContentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CourseContentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCourseContent(values);
      resetForm();
      router.push('/course-contents');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CourseContentInterface>({
    initialValues: {
      content: '',
      trainer_id: (router.query.trainer_id as string) ?? null,
    },
    validationSchema: courseContentValidationSchema,
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
            Create Course Content
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="content" mb="4" isInvalid={!!formik.errors?.content}>
            <FormLabel>Content</FormLabel>
            <Input type="text" name="content" value={formik.values?.content} onChange={formik.handleChange} />
            {formik.errors.content && <FormErrorMessage>{formik.errors?.content}</FormErrorMessage>}
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
    entity: 'course_content',
    operation: AccessOperationEnum.CREATE,
  }),
)(CourseContentCreatePage);
