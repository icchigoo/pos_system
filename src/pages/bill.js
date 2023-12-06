import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Popover,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid
} from "@mui/material";
import { useCompanyContext } from "src/contexts/company-context";

const Bill = ({ saleData, products, taxes }) => {
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchCompanies } = useCompanyContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesData = await fetchCompanies();
        setCompanies(companiesData);
        setLoading(false);
        console.log("Companies data:", companiesData);
      } catch (error) {
        console.error("Error fetching companies data:", error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchCompanies]);

  const handlePopoverOpen = (event) => {
    setPopoverAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  const getProductName = (productId) => {
    const product = products.find((p) => p.product_id === productId);
    return product ? product.product_name : "Unknown Product";
  };

  const getTaxName = (taxId) => {
    const tax = taxes.find((t) => t.tax_id === taxId);
    return tax ? tax.tax_name : "Unknown Tax";
  };

  const companyData = companies.length > 0 ? companies[0] : null;

  // Print function
 // Print function
const handlePrint = () => {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Bill</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 20px;
            }
            .bill-content {
              text-align: center;
              margin-bottom: 20px;
            }
            .company-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-bottom: 20px;
            }
            .company-info {
              font-weight: bold;
            }
            .product-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .product-table th,
            .product-table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .summary-info {
              text-align: center;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <!-- Content to be printed -->
          <div class="bill-content">
          <div class="company-container">
          <Typography variant="h6" class="company-info">
            ${companyData ? companyData.company_name : "Company Name"}
          </Typography>
          ${loading ? "<CircularProgress />" : companyData ? `
            <Typography>${companyData.company_address}</Typography>
            <Typography>Contact: ${companyData.company_contact}</Typography>
            <Typography>Email: ${companyData.company_email}</Typography>
          ` : "<Typography>No company data found.</Typography>"}
        </div>
          </div>

          <div class="summary-info">
            <Typography>
              Date: ${saleData.sales_date} | Payment: ${saleData.payment_method}
            </Typography>
          </div>

        

          <table class="product-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${saleData.products.map((product, index) => `
                <tr key=${index}>
                  <td>${getProductName(product.product_id)}</td>
                  <td>${product.qty}</td>
                  <td>${product.price}</td>
                  <td>${product.total}</td>
                </tr>
              `).join("")}
              <tr>
                <td>Discount Percentage</td>
                <td></td>
                <td></td>
                <td>${saleData.discount_percentage}%</td>
              </tr>
              <tr>
                <td>Tax</td>
                <td></td>
                <td></td>
                <td>${getTaxName(saleData.tax)} %</td>
              </tr>
              <tr>
                <td>Total (Inc. Tax)</td>
                <td></td>
                <td></td>
                <td>${saleData.total}</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  } else {
    alert("Please allow pop-ups to print the bill.");
  }
};


  return (
<Grid container spacing={2}>
      <Grid item xs={6}> {/* Divide the space into two columns */}
        <Button variant="outlined" onClick={handlePopoverOpen}>
          View Bill
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button variant="outlined" onClick={handlePrint}>
          Print
        </Button>
      </Grid>

      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box p={2}>
          {/* Centered Company Information */}
          <Box textAlign="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              {companyData ? companyData.company_name : "Company Name"}
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : companyData ? (
              <>
                <Typography>{companyData.company_address}</Typography>
                <Typography>Contact: {companyData.company_contact}</Typography>
                <Typography>Email: {companyData.company_email}</Typography>
              </>
            ) : (
              <Typography>No company data found.</Typography>
            )}
          </Box>

          <Box mt={2} textAlign="center">
            <Typography>
              Date: {saleData.sales_date} | Payment: {saleData.payment_method}
            </Typography>
          </Box>

          {/* Product Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {saleData.products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{getProductName(product.product_id)}</TableCell>
                    <TableCell>{product.qty}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.total}</TableCell>
                  </TableRow>
                ))}
                {/* Include discount percentage, tax, and total in the table */}
                <TableRow>
                  <TableCell>Discount Percentage</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>{saleData.discount_percentage}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tax</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>{getTaxName(saleData.tax)} %</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total (Inc. Tax)</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>{saleData.total}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Popover>
      </Grid>
  );
};

export default Bill;
