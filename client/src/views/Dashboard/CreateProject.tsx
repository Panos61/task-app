import { useMutation, useQuery } from '@apollo/client';
import { Formik, Form, FieldProps, Field } from 'formik';
import { TextInput, Button, ColorInput } from '@mantine/core';
import * as Yup from 'yup';
import type { Project } from '@graphql/project/types';
import { GET_ME } from '@graphql/user/queries';
import { GET_PROJECTS } from '@graphql/project/queries';
import { CREATE_PROJECT } from '@graphql/project/mutations';

interface FormValues {
  name: string;
  color: string;
}

const formValidation = Yup.object({
  name: Yup.string().required(),
  color: Yup.string(),
});

export const CreateProject = () => {
  const { data } = useQuery(GET_ME, {
    fetchPolicy: 'cache-only',
  });
  const meData = data?.me;

  const [createProject, { loading, error }] = useMutation(CREATE_PROJECT, {
    update(cache, { data: { createProject } }) {
      const existingProjects = cache.readQuery<{ projects: Project[] }>({
        query: GET_PROJECTS,
        variables: { ownerID: meData?.id },
      });

      cache.writeQuery({
        query: GET_PROJECTS,
        variables: { ownerID: meData?.id },
        data: {
          projects: [
            ...(existingProjects?.projects || []),
            createProject,
          ],
        },
      });
    },
  });

  const handleSubmit = ({ name, color }: FormValues) => {
    createProject({ variables: { input: { name, color } } });
  };

  return (
    <div className='flex flex-col items-center justify-center gap-20 h-full mt-24'>
      <div>
        <h1 className='flex items-center gap-12 text-2xl font-bold text-text-primary'>
          Create New Project
        </h1>
        <p className='text-center text-sm'>Set up your new project.</p>
      </div>
      <div className='max-w-[900px] rounded-12'>
        <div className='flex flex-col gap-8'>
          <Formik
            initialValues={{ name: '', color: '#45E340' }}
            validationSchema={formValidation}
            onSubmit={({ name, color }: FormValues) => {
              handleSubmit({ name, color });
            }}
          >
            {({ errors }) => (
              <Form className='relative flex flex-col items-center gap-12 w-[400px]'>
                <Field name='name'>
                  {({ field }: FieldProps) => (
                    <TextInput
                      label='Project Name'
                      placeholder='Name your project'
                      error={errors.name}
                      inputWrapperOrder={[
                        'label',
                        'error',
                        'input',
                        'description',
                      ]}
                      className='w-full'
                      {...field}
                    />
                  )}
                </Field>
                <Field name='color'>
                  {({ field, form }: FieldProps) => (
                    <ColorInput
                      label='Project Color'
                      description='Choose a color for your project'
                      placeholder='Pick a color'
                      className='w-full'
                      value={field.value}
                      defaultValue='#45E340'
                      onChange={(value) => form.setFieldValue('color', value)}
                      onBlur={field.onBlur}
                    />
                  )}
                </Field>
                <Button type='submit' mt='sm' disabled={loading}>
                  {loading ? 'Loading...' : 'Create'}
                </Button>
                <span className='text-sm text-red-500'>{error?.message}</span>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
