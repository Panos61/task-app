import { useState } from 'react';
import { useApolloClient, useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router';
import { Button, TextInput } from '@mantine/core';
import { Form, Formik, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames';

import { LOGIN, REGISTER } from '@graphql/user/mutations';

interface LoginValues {
  username: string;
  password: string;
}

interface RegisterValues {
  username: string;
  password: string;
  confirmPassword?: string;
}

const registerValidationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(3, 'Password must be at least 3 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const Auth = () => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [isRegistering, setIsRegistering] = useState(
    state?.isRegistering || false
  );

  const [login, { loading: loginLoading, error: loginError }] =
    useMutation(LOGIN);
  const [register, { loading: registerLoading, error: registerError }] =
    useMutation(REGISTER);

  const handleLoginSubmit = ({ username, password }: LoginValues) => {
    login({ variables: { input: { username, password } } }).then((res) => {
      if (res.data && res.data.login) {
        localStorage.setItem('token', res.data.login.token);
        client.resetStore().then(() => {
          navigate('/dashboard');
        });
      }
    });
  };

  const handleRegisterSubmit = ({ username, password }: RegisterValues) => {
    register({ variables: { input: { username, password } } }).then((res) => {
      if (res.data && res.data.register) {
        localStorage.setItem('token', res.data.register.token);
        navigate('/dashboard');
      }
    });
  };

  const handleRegisterCTA = () => {
    setIsRegistering(true);
  };

  const loginFormCls = classNames(
    'transform transition-all duration-500',
    isRegistering ? 'translate-x-full opacity-0' : 'translate-x-0'
  );

  const registerFormCls = classNames(
    'absolute top-0 w-full transform transition-all duration-500',
    isRegistering ? '-translate-x-0 opacity-100' : '-translate-x-full opacity-0'
  );

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-custom-bg bg-cover bg-fixed'>
      <div className='relative w-[400px]'>
        <div className={loginFormCls}>
          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={({ username, password }: LoginValues) => {
              handleLoginSubmit({ username, password });
            }}
          >
            {({ errors, touched }) => (
              <Form className='relative flex flex-col items-center w-[400px]'>
                <span className='mb-12 text-center text-2xl font-bold'>
                  Authorize your account
                </span>
                <span className='text-xs mt-8'>
                  Don't have an account?{' '}
                  <a
                    className='underline text-text-primary cursor-pointer'
                    onClick={handleRegisterCTA}
                  >
                    Register
                  </a>
                </span>
                <Field name='username'>
                  {({ field }: FieldProps) => (
                    <TextInput
                      label='Username'
                      placeholder='Enter your username'
                      error={touched.username && errors.username}
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
                <Field name='password'>
                  {({ field }: FieldProps) => (
                    <TextInput
                      mt='md'
                      label='Password'
                      type='password'
                      placeholder='Enter your password'
                      error={touched.password && errors.password}
                      inputWrapperOrder={[
                        'label',
                        'input',
                        'description',
                        'error',
                      ]}
                      className='w-full'
                      {...field}
                    />
                  )}
                </Field>
                <Button type='submit' fullWidth mt='lg' disabled={loginLoading}>
                  {loginLoading ? 'Loading...' : 'Login'}
                </Button>
                {loginError && (
                  <span className='text-xs text-red-500 mt-8'>
                    {loginError.message}
                  </span>
                )}
                <p className='mt-8 text-center text-xs'>
                  Once the authorization is successful, you will be redirected
                  to the dashboard.
                </p>
                <a
                  className='mt-24 self-start text-left text-xs underline cursor-pointer'
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </a>
              </Form>
            )}
          </Formik>
        </div>
        <div className={registerFormCls}>
          <Formik
            initialValues={{ username: '', password: '', confirmPassword: '' }}
            validationSchema={registerValidationSchema}
            onSubmit={({ username, password }: RegisterValues) => {
              handleRegisterSubmit({ username, password });
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className='flex flex-col items-center w-full'>
                <span className='mb-12 text-center text-2xl font-bold'>
                  Create an account
                </span>
                <Field name='username'>
                  {({ field }: FieldProps) => (
                    <TextInput
                      label='Username'
                      placeholder='Choose a username'
                      error={touched.username && errors.username}
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
                <Field name='password'>
                  {({ field }: FieldProps) => (
                    <TextInput
                      mt='md'
                      label='Password'
                      type='password'
                      placeholder='Choose a password'
                      error={touched.password && errors.password}
                      inputWrapperOrder={[
                        'label',
                        'input',
                        'description',
                        'error',
                      ]}
                      className='w-full'
                      {...field}
                    />
                  )}
                </Field>
                <Field name='confirmPassword'>
                  {({ field }: FieldProps) => (
                    <TextInput
                      mt='md'
                      label='Confirm Password'
                      type='password'
                      placeholder='Confirm your password'
                      error={touched.confirmPassword && errors.confirmPassword}
                      inputWrapperOrder={[
                        'label',
                        'input',
                        'description',
                        'error',
                      ]}
                      className='w-full'
                      {...field}
                    />
                  )}
                </Field>
                <Button type='submit' fullWidth mt='lg' disabled={isSubmitting}>
                  {isSubmitting || registerLoading ? 'Loading...' : 'Register'}
                </Button>
                {registerError && (
                  <span className='text-xs text-red-500 mt-8'>
                    {registerError.message}
                  </span>
                )}
                <span className='text-xs mt-8'>
                  Already have an account?{' '}
                  <button
                    type='button'
                    className='underline text-text-primary'
                    onClick={() => setIsRegistering(false)}
                  >
                    Login
                  </button>
                </span>
                <a
                  className='mt-24 self-start text-left text-xs underline cursor-pointer'
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </a>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
