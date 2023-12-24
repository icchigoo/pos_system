import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const SalesPage = () => {
  const [billItems, setBillItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [taxableAmount, setTaxableAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [netAmount, setNetAmount] = useState(0);

  const [taxItems, setTaxItems] = useState([
    // Initialize with some default values if needed
    { sno: 1, taxPercentage: 5, amount: 0, total: 0 },
  ]);

  const handleAddItem = () => {
    setBillItems((prevItems) => [
      ...prevItems,
      {
        productName: "",
        rate: 0,
        qty: 0,
        total: 0,
        editable: true,
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    setBillItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  };

  const handleItemChange = (index, field, value) => {
    setBillItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index][field] = value;

      if (field === "qty" || field === "rate") {
        const qty = updatedItems[index].qty || 0;
        const rate = updatedItems[index].rate || 0;
        updatedItems[index].total = qty * rate;
      }

      return updatedItems;
    });
  };

  const handleTaxItemChange = (index, field, value) => {
    setTaxItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index][field] = value;

      if (field === "taxPercentage" || field === "amount") {
        const taxPercentage = updatedItems[index].taxPercentage || 0;
        const amount = updatedItems[index].amount || 0;
        updatedItems[index].total = (amount * taxPercentage) / 100;
      }

      return updatedItems;
    });
  };

  const calculateAmounts = () => {
    const calculatedSubtotal = billItems.reduce((total, item) => total + item.total, 0);
    setSubtotal(calculatedSubtotal);

    const calculatedDiscount = calculatedSubtotal * 0.1;
    setDiscount(calculatedDiscount);

    const calculatedTaxableAmount = calculatedSubtotal - calculatedDiscount;
    setTaxableAmount(calculatedTaxableAmount);

    const calculatedTotalAmount = calculatedTaxableAmount * 1.05;
    setTotalAmount(calculatedTotalAmount);

    setNetAmount(calculatedTotalAmount);
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 8, background: "inherit" }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5">Bill</Typography>
          </Grid>

          <Grid item xs={12} md={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <TextField label="Product Name" fullWidth />
                    </TableCell>
                    <TableCell>
                      <TextField label="Rate" fullWidth type="number" />
                    </TableCell>
                    <TableCell>
                      <TextField label="Qty" fullWidth type="number" />
                    </TableCell>
                    <TableCell>
                      <TextField label="Total" fullWidth InputProps={{ readOnly: true }} />
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" size="small" onClick={handleAddItem}>
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} md={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>S.No</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <TextField
                          label="Product Name"
                          fullWidth
                          value={item.productName}
                          onChange={(e) => handleItemChange(index, "productName", e.target.value)}
                          disabled={!item.editable}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          label="Rate"
                          fullWidth
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                          disabled={!item.editable}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          label="Qty"
                          fullWidth
                          type="number"
                          value={item.qty}
                          onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                          disabled={!item.editable}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          label="Total"
                          fullWidth
                          value={item.total}
                          InputProps={{ readOnly: true }}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleRemoveItem(index)} size="small">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Field</TableCell>
                        <TableCell>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Subtotal</TableCell>
                        <TableCell>
                          <TextField
                            value={subtotal}
                            InputProps={{ readOnly: true }}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Discount</TableCell>
                        <TableCell>
                          <TextField
                            value={discount}
                            InputProps={{ readOnly: true }}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Taxable Amount</TableCell>
                        <TableCell>
                          <TextField
                            value={taxableAmount}
                            InputProps={{ readOnly: true }}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Amount</TableCell>
                        <TableCell>
                          <TextField
                            value={totalAmount}
                            InputProps={{ readOnly: true }}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Net Amount</TableCell>
                        <TableCell>
                          <TextField
                            value={netAmount}
                            InputProps={{ readOnly: true }}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* New card for tax details */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>S.No</TableCell>
                        <TableCell>Tax Percentage</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {taxItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.sno}</TableCell>
                          <TableCell>
                            <TextField
                              value={item.taxPercentage}
                              onChange={(e) =>
                                handleTaxItemChange(index, "taxPercentage", e.target.value)
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={item.amount}
                              onChange={(e) => handleTaxItemChange(index, "amount", e.target.value)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={item.total}
                              InputProps={{ readOnly: true }}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

SalesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SalesPage;
