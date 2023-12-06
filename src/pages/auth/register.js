// Import necessary dependencies and components
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';

import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { useAuthContext } from 'src/contexts/AuthContext';

const RegisterPage = () => {
  const router = useRouter();
  const auth = useAuthContext();

  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      mobile: '',
      address: '',
      password: '',
      submit: null,
    },
    validationSchema: Yup.object({
      firstname: Yup.string().max(255).required('First Name is required'),
      lastname: Yup.string().max(255).required('Last Name is required'),
      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      mobile: Yup.string().max(15).required('Mobile is required'),
      address: Yup.string().max(255).required('Address is required'),
      password: Yup.string().max(255).required('Password is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await auth.createUser({
          firstname: values.firstname,
          lastname: values.lastname,
          email: values.email,
          mobile: values.mobile,
          address: values.address,
          password: values.password,
        });

        router.push('/auth/login');
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Register | Your App Name</title>
      </Head>
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%',
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Register</Typography>
              <Typography color="text.secondary" variant="body2">
                Already have an account?{' '}
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Log in
                </Link>
              </Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.firstname && formik.errors.firstname)}
                  fullWidth
                  helperText={formik.touched.firstname && formik.errors.firstname}
                  label="First Name"
                  name="firstname"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.firstname}
                />
                <TextField
                  error={!!(formik.touched.lastname && formik.errors.lastname)}
                  fullWidth
                  helperText={formik.touched.lastname && formik.errors.lastname}
                  label="Last Name"
                  name="lastname"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.lastname}
                />
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={!!(formik.touched.mobile && formik.errors.mobile)}
                  fullWidth
                  helperText={formik.touched.mobile && formik.errors.mobile}
                  label="Mobile"
                  name="mobile"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.mobile}
                />
                <TextField
                  error={!!(formik.touched.address && formik.errors.address)}
                  fullWidth
                  helperText={formik.touched.address && formik.errors.address}
                  label="Address"
                  name="address"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.address}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                Continue
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

RegisterPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default RegisterPage;
