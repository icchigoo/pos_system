import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  Box,
  Button,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  SvgIcon,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useSalesContext } from "src/contexts/sales-context";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { applyPagination } from "src/utils/apply-pagination";
import TableSortLabel from "@mui/material/TableSortLabel";

const SalesDashboardPage = () => {
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("sales_date");
  const [order, setOrder] = useState("asc");

  const salesContext = useSalesContext();

  const fetchSales = async () => {
    try {
      const salesData = await salesContext.fetchSales();
      setSales(salesData);
    } catch (error) {
      console.error("Error fetching sales: ", error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    const sortedSales = [...sales].sort((a, b) => {
      const aValue = a[property];
      const bValue = b[property];
      return (isAsc ? 1 : -1) * aValue.localeCompare(bValue);
    });

    setSales(sortedSales);
  };

  return (
    <>
      <Head>
        <title>Sales Dashboard | Your App Name</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Sales Dashboard</Typography>
              </Stack>
            </Stack>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "sales_date"}
                        direction={order === "asc" ? "desc" : "asc"}
                        onClick={() => handleSort("sales_date")}
                      >
                        Sales Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>Total</TableCell>
                    {/* Remove Sales ID */}
                    {/* Add more headers based on your sales data structure */}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applyPagination(sales, page, rowsPerPage).map((sale) => (
                    <TableRow key={sale.sale_id}>
                      <TableCell>{sale.sales_date}</TableCell>
                      <TableCell>{sale.payment_method}</TableCell>
                      <TableCell>{sale.total}</TableCell>
                      {/* Remove Sales ID */}
                      {/* Add more cells based on your sales data structure */}
                      <TableCell>
                        <IconButton onClick={() => handleDeleteSaleClick(sale)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
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

SalesDashboardPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SalesDashboardPage;
