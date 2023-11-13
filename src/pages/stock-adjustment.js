// StockAdjustmentPage.js
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  MenuItem,
  TableSortLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";

import { useStockAdjustmentContext } from "src/contexts/stock-adjustment";
import { useProductContext } from "src/contexts/product-context"; // Assuming you have a product context

const StockAdjustmentPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [stockAdjustments, setStockAdjustments] = useState([]);
  const stockAdjustmentContext = useStockAdjustmentContext(); // Assuming you have a stock adjustment context
  const productContext = useProductContext(); // Assuming you have a product context

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newAdjustmentTitle, setNewAdjustmentTitle] = useState("");
  const [newAdjustmentQty, setNewAdjustmentQty] = useState("");
  const [newAdjustmentType, setNewAdjustmentType] = useState("");
  const [newReason, setNewReason] = useState("");
  const [newProductId, setNewProductId] = useState("");
  const [products, setProducts] = useState([]);

  const fetchStockAdjustments = async () => {
    try {
      const stockAdjustmentsData = await stockAdjustmentContext.fetchStockAdjustments();
      setStockAdjustments(stockAdjustmentsData);
    } catch (error) {
      console.error("Error fetching stock adjustments: ", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const productsData = await productContext.fetchProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  useEffect(() => {
    fetchStockAdjustments();
    fetchProducts();
  }, []);

  const applyPagination = (items, page, rowsPerPage) => {
    const startIndex = page * rowsPerPage;
    return items.slice(startIndex, startIndex + rowsPerPage);
  };

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const getProductNameById = (productId) => {
    const product = products.find((p) => p.product_id === productId);
    return product ? product.product_name : 'N/A';
  };
  

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setNewAdjustmentTitle("");
    setNewAdjustmentQty("");
    setNewAdjustmentType("");
    setNewReason("");
    setNewProductId("");
  };

  const handleCreateStockAdjustment = async () => {
    try {
      const stockAdjustmentData = {
        adjustment_title: newAdjustmentTitle,
        adjustment_qty: newAdjustmentQty,
        adjustment_type: newAdjustmentType,
        reason: newReason,
        product_id: newProductId,
        // Include other properties as needed
      };
      await stockAdjustmentContext.createStockAdjustment(stockAdjustmentData);
      setIsAddDialogOpen(false);
      setNewAdjustmentTitle("");
      setNewAdjustmentQty("");
      setNewAdjustmentType("");
      setNewReason("");
      setNewProductId("");
      fetchStockAdjustments();
    } catch (error) {
      console.error("Error creating stock adjustment: ", error);
    }
  };

  return (
    <>
      <Head>
        <title>Stock Adjustments | Your App Name</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Stock Adjustments</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={handleAddClick}
                >
                  Add
                </Button>
              </div>
            </Stack>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Adjustment Title</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Product Name</TableCell>
                    {/* Add other table headers as needed */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applyPagination(stockAdjustments, page, rowsPerPage).map((adjustment) => (
                    <TableRow key={adjustment.stock_adj_id}>
                      <TableCell>{adjustment.adjustment_title}</TableCell>
                      <TableCell>{adjustment.adjustment_qty}</TableCell>
                      <TableCell>{adjustment.adjustment_type}</TableCell>
                      <TableCell>{adjustment.reason}</TableCell>
                      <TableCell>{getProductNameById(adjustment.product_id)}</TableCell>

                      {/* Add other table cells as needed */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Container>
      </Box>

      <Dialog open={isAddDialogOpen} onClose={handleAddDialogClose} fullWidth>
        <DialogTitle>
          Create Stock Adjustment
          <IconButton edge="end" color="inherit" onClick={handleAddDialogClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              label="Adjustment Title"
              fullWidth
              value={newAdjustmentTitle}
              onChange={(e) => setNewAdjustmentTitle(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Quantity"
              fullWidth
              value={newAdjustmentQty}
              onChange={(e) => setNewAdjustmentQty(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Type"
              fullWidth
              value={newAdjustmentType}
              onChange={(e) => setNewAdjustmentType(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Reason"
              fullWidth
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              select
              label="Product ID"
              fullWidth
              value={newProductId}
              onChange={(e) => setNewProductId(e.target.value)}
            >
              {products.map((product) => (
                <MenuItem key={product.product_id} value={product.product_id}>
                  {product.product_name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {/* Add other fields for stock adjustment creation as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={handleCreateStockAdjustment}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

StockAdjustmentPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default StockAdjustmentPage;
