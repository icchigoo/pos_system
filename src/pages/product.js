// ProductPage.js
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

import { useProductContext } from "src/contexts/product-context"; // Assuming you have a product context
import { useCategoryContext } from "src/contexts/category-context"; // Assuming you have a category context
import { useUnitContext } from "src/contexts/unit-context"; // Assuming you have a unit context

const ProductPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const productContext = useProductContext(); // Assuming you have a product context
  const categoryContext = useCategoryContext(); // Assuming you have a category context
  const unitContext = useUnitContext(); // Assuming you have a unit context

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newProductName, setNewProductName] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [newProductUnit, setNewProductUnit] = useState("");

  const fetchProducts = async () => {
    try {
      const productsData = await productContext.fetchProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await categoryContext.fetchCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const fetchUnits = async () => {
    try {
      const unitsData = await unitContext.fetchUnits();
      setUnits(unitsData);
    } catch (error) {
      console.error("Error fetching units: ", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchUnits();
  }, []);

  const applyPagination = (items, page, rowsPerPage) => {
    const startIndex = page * rowsPerPage;
    return items.slice(startIndex, startIndex + rowsPerPage);
  };

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setNewProductName("");
    setNewProductDescription("");
    setNewProductCategory("");
    setNewProductUnit("");
  };

  const handleCreateProduct = async () => {
    try {
      const productData = {
        product_name: newProductName,
        product_desc: newProductDescription,
        category_id: newProductCategory,
        unit_id: newProductUnit,
        // Include other properties as needed
      };
      await productContext.createProduct(productData);
      setIsAddDialogOpen(false);
      setNewProductName("");
      setNewProductDescription("");
      setNewProductCategory("");
      setNewProductUnit("");
      fetchProducts();
    } catch (error) {
      console.error("Error creating product: ", error);
    }
  };

  // Helper function to get category name by category id
  const getCategoryNameById = (categoryId) => {
    const category = categories.find((cat) => cat.category_id === categoryId);
    return category ? category.category_name : "";
  };

  // Helper function to get unit name by unit id
  const getUnitNameById = (unitId) => {
    const unit = units.find((un) => un.unit_id === unitId);
    return unit ? unit.unit_name : "";
  };

  return (
    <>
      <Head>
        <title>Products | Your App Name</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Products</Typography>
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
                    <TableCell>Product Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Unit</TableCell>
                    {/* Add other table headers as needed */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applyPagination(products, page, rowsPerPage).map((product) => (
                    <TableRow key={product.product_id}>
                      <TableCell>{product.product_name}</TableCell>
                      <TableCell>{product.product_desc}</TableCell>
                      <TableCell>{getCategoryNameById(product.category_id)}</TableCell>
                      <TableCell>{getUnitNameById(product.unit_id)}</TableCell>
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
          Create Product
          <IconButton edge="end" color="inherit" onClick={handleAddDialogClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              label="Product Name"
              fullWidth
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Description"
              fullWidth
              value={newProductDescription}
              onChange={(e) => setNewProductDescription(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              select
              label="Category"
              fullWidth
              value={newProductCategory}
              onChange={(e) => setNewProductCategory(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box mb={2}>
            <TextField
              select
              label="Unit"
              fullWidth
              value={newProductUnit}
              onChange={(e) => setNewProductUnit(e.target.value)}
            >
              {units.map((unit) => (
                <MenuItem key={unit.unit_id} value={unit.unit_id}>
                  {unit.unit_name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          {/* Add other fields for product creation as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={handleCreateProduct}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ProductPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProductPage;
