import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { useGroupContext } from 'src/contexts/group-context';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { applyPagination } from 'src/utils/apply-pagination';

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [groups, setGroups] = useState([]); // State for storing groups data
  const groupContext = useGroupContext();

  const fetchGroups = async () => {
    try {
      const groupsData = await groupContext.fetchGroups(); // Replace with the appropriate function from your GroupContext
      setGroups(groupsData);
    } catch (error) {
      console.error('Error fetching groups: ', error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []); // Fetch groups when the component mounts

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <>
      <Head>
        <title>Groups | Pos System</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Groups</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Group Name</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applyPagination(groups, page, rowsPerPage).map((group) => (
                 <TableRow key={group.group_id}>
                 <TableCell>{group.group_name}</TableCell>
                 <TableCell>{group.group_desc}</TableCell>
               </TableRow>
               
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
