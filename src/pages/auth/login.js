import { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Button,
  Alert
} from '@mui/material';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { useAuthContext } from 'src/context/authContext';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const { login } = useAuthContext();
  const router = useRouter(); 
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      // If login is successful, navigate to the desired page
      router.push('/'); // Change '/dashboard' to the path you want to navigate to
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  return (
    <>
      <Head>
        <title>Login | Pos System</title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">Login</Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Don&apos;t have an account?{' '}
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Register
                </Link>
              </Typography>
            </Stack>
            <Tabs value="email" sx={{ mb: 3 }}>
              <Tab label="Email" value="email" />
              <Tab label="Phone Number" disabled />
            </Tabs>
            <form onSubmit={handleLogin}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Stack>
              {error && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {error}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                variant="contained"
                type="submit"
              >
                Continue
              </Button>
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
              >
                Skip authentication
              </Button>
              <Alert
                color="primary"
                severity="info"
                sx={{ mt: 3 }}
              >
                <div>
                  You can use <b>demo@devias.io</b> and password{' '}
                  <b>Password123!</b>
                </div>
              </Alert>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

LoginPage.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default LoginPage;
