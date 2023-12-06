import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Typography,
  Grid,
  Button,
  Avatar,
  Divider,
  Card,
  CardHeader,
  CardContent,
  TextField,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

import { useAuthContext } from "src/contexts/AuthContext";

const Page = () => {
  const { user } = useAuthContext();

  const userData = user || {
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
  };

  return (
    <form autoComplete="off">
      <Card>
        <CardHeader title="Profile" />
        <CardContent sx={{ pt: 0 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                required
                variant="outlined"
                value={userData.firstname}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                required
                variant="outlined"
                value={userData.lastname}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                required
                variant="outlined"
                value={userData.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                variant="outlined"
                value={userData.mobile || ""}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
      </Card>
    </form>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
