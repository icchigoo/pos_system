import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Bill from "./bill";

import { useSalesContext } from "src/contexts/sales-context";
import { useProductContext } from "src/contexts/product-context";
import { useTaxContext } from "src/contexts/tax-context";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const SalesPage = () => {
  const [saleProducts, setSaleProducts] = useState([
    {
      product_id: "",
      qty: 0,
      price: 0,
      total: 0,
    },
  ]);

  const [newSaleSalesDate, setNewSaleSalesDate] = useState("");
  const [newSalePaymentMethod, setNewSalePaymentMethod] = useState("");
  const [newSaleDiscountAmt, setNewSaleDiscountAmt] = useState(0);
  const [newSaleDiscountPercentage, setNewSaleDiscountPercentage] = useState(0);
  const [newSaleTax, setNewSaleTax] = useState(0);
  const [showBill, setShowBill] = useState(false);
  const [saleData, setSaleData] = useState(null);

  const salesContext = useSalesContext();
  const productContext = useProductContext();
  const taxContext = useTaxContext();

  const [products, setProducts] = useState([]);
  const [taxOptions, setTaxOptions] = useState([]);
  const [taxes, setTaxes] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productsData = await productContext.fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    const fetchTaxData = async () => {
      try {
        const taxesData = await taxContext.fetchTaxes();
        setTaxes(taxesData); // Update setTaxOptions to setTaxes
      } catch (error) {
        console.error("Error fetching taxes: ", error);
      }
    };

    fetchProductData();
    fetchTaxData();
  }, [productContext, taxContext]);

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...saleProducts];
    updatedProducts[index][field] = value;
    if (field === "qty" || field === "price") {
      // Update the total if quantity or price changes
      const qty = updatedProducts[index].qty || 0;
      const price = updatedProducts[index].price || 0;
      updatedProducts[index].total = qty * price;
    }
    setSaleProducts(updatedProducts);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Ensure month and day have two digits
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  const calculateGrandTotal = () => {
    const productTotals = saleProducts.reduce((total, product) => total + product.total, 0);
    const discountAmt = newSaleDiscountAmt * saleProducts.length;
    const discountPercentage = newSaleDiscountPercentage;
    const totalBeforeDiscount = productTotals;
    const totalDiscount =
      totalBeforeDiscount - (totalBeforeDiscount * discountPercentage) / 100 - discountAmt;

    const selectedTax = taxes.find((tax) => tax.tax_id === newSaleTax);
    const taxAmount = selectedTax ? parseFloat(selectedTax.tax_name) : 0;

    const grandTotal = totalDiscount + taxAmount;

    return grandTotal;
  };

  const handleAddProduct = () => {
    setSaleProducts((prevProducts) => [
      ...prevProducts,
      {
        product_id: "",
        qty: 0,
        price: 0,
        total: 0,
      },
    ]);
  };

  const handleRemoveProduct = (index) => {
    setSaleProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts.splice(index, 1);
      return updatedProducts;
    });
  };

  const handleCreateSale = async () => {
    try {
      const updatedSaleProducts = saleProducts.map((product) => ({
        ...product,
        total: product.qty * product.price,
      }));

      const selectedTax = taxes.find((tax) => tax.tax_id === newSaleTax);
      const taxAmount = selectedTax ? parseFloat(selectedTax.tax_name) : 0;

      const grandTotal = calculateGrandTotal();
      const salesDateToUse = newSaleSalesDate || getCurrentDate();

      const saleData = {
        products: updatedSaleProducts,
        sales_date: salesDateToUse,
        payment_method: newSalePaymentMethod, // Include the Payment Method here
        discount_amt: newSaleDiscountAmt,
        discount_percentage: newSaleDiscountPercentage,
        tax: newSaleTax,
        total: grandTotal,
      };

      setShowBill(true);
      setSaleData(saleData);

      console.log("Data being sent to the server:", saleData);

      await salesContext.createSale(saleData);

      setSaleProducts([
        {
          product_id: "",
          qty: 0,
          price: 0,
          total: 0,
        },
      ]);
      setNewSaleSalesDate("");
      setNewSalePaymentMethod("");
      setNewSaleDiscountAmt(0);
      setNewSaleDiscountPercentage(0);
      setNewSaleTax(0);
    } catch (error) {
      console.error("Error creating sale: ", error);
    }
  };

  return (
    <>
      <Head>
        <title>Sales | Your App Name</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Sales</Typography>
              </Stack>
            </Stack>

            {saleProducts.map((product, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Product"
                    fullWidth
                    value={product.product_id}
                    onChange={(e) => handleProductChange(index, "product_id", e.target.value)}
                  >
                    {products.map((productOption) => (
                      <MenuItem key={productOption.product_id} value={productOption.product_id}>
                        {productOption.product_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Price"
                    fullWidth
                    type="number"
                    value={product.price}
                    onChange={(e) => handleProductChange(index, "price", e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Quantity"
                    fullWidth
                    type="number"
                    value={product.qty}
                    onChange={(e) => handleProductChange(index, "qty", e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Total"
                    fullWidth
                    value={product.total}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleRemoveProduct(index)}
                    startIcon={<DeleteIcon />}
                  >
                    Remove
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    onClick={handleAddProduct}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            ))}

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Sales Date"
                  fullWidth
                  type="date"
                  value={newSaleSalesDate || getCurrentDate()}
                  onChange={(e) => setNewSaleSalesDate(e.target.value)}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Payment Method"
                  fullWidth
                  value={newSalePaymentMethod}
                  onChange={(e) => setNewSalePaymentMethod(e.target.value)}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  select
                  label="Tax"
                  fullWidth
                  type="number"
                  value={newSaleTax}
                  onChange={(e) => setNewSaleTax(e.target.value)}
                >
                  {taxes.map(
                    (
                      taxOption // Change taxOptions to taxes
                    ) => (
                      <MenuItem key={taxOption.tax_id} value={taxOption.tax_id}>
                        {taxOption.tax_name}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Discount Percentage"
                  fullWidth
                  type="number"
                  value={newSaleDiscountPercentage}
                  onChange={(e) => setNewSaleDiscountPercentage(e.target.value)}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Grand Total"
                  fullWidth
                  value={calculateGrandTotal()}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center"> {/* Added alignItems */}
              <Grid item xs={6}>
                <Button variant="contained" onClick={handleCreateSale}>
                  Create
                </Button>
              </Grid>
          
            </Grid>

            {showBill && <Bill saleData={saleData} products={products} taxes={taxes} />}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

SalesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SalesPage;
