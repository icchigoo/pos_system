// pages/supplier.js
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useSupplierContext } from "../contexts/supplier-context";
import { Layout as DashboardLayout } from "../layouts/dashboard/layout";
import { applyPagination } from "../utils/apply-pagination";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import TableSortLabel from "@mui/material/TableSortLabel";

const SupplierPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [suppliers, setSuppliers] = useState([]);
  const supplierContext = useSupplierContext();

  const [orderBy, setOrderBy] = useState("status");
  const [order, setOrder] = useState("asc");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const [newSupplierName, setNewSupplierName] = useState("");
  const [newSupplierDescription, setNewSupplierDescription] = useState("");
  const [editSupplierName, setEditSupplierName] = useState("");
  const [editSupplierDescription, setEditSupplierDescription] = useState("");
  const [editSupplierStatus, setEditSupplierStatus] = useState(""); // Status state

  const fetchSuppliers = async () => {
    try {
      const suppliersData = await supplierContext.fetchSuppliers();
      setSuppliers(suppliersData);
    } catch (error) {
      console.error("Error fetching suppliers: ", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    const sortedSuppliers = [...suppliers].sort((a, b) => {
      const aValue = a[property];
      const bValue = b[property];
      return (isAsc ? 1 : -1) * aValue.localeCompare(bValue);
    });

    setSuppliers(sortedSuppliers);
  };

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (supplier) => {
    setSelectedSupplier(supplier);
    setEditSupplierName(supplier.supplier_name);
    setEditSupplierDescription(supplier.description);
    setEditSupplierStatus(supplier.status); // Set status for editing
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (supplier) => {
    setSelectedSupplier(supplier);
    setDeleteConfirmation(true);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setNewSupplierName("");
    setNewSupplierDescription("");
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedSupplier(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteConfirmation(false);
    setSelectedSupplier(null);
  };

  const handleCreateSupplier = async () => {
    try {
      const supplierData = {
        supplier_name: newSupplierName,
        description: newSupplierDescription,
      };
      await supplierContext.createSupplier(supplierData);
      setIsAddDialogOpen(false);
      setNewSupplierName("");
      setNewSupplierDescription("");
      fetchSuppliers();
    } catch (error) {
      console.error("Error creating supplier: ", error);
    }
  };

  const handleEditSupplier = async () => {
    if (selectedSupplier) {
      try {
        const updatedSupplierData = {
          supplier_name: editSupplierName,
          description: editSupplierDescription,
          status: editSupplierStatus, // Include status in the update
        };
        await supplierContext.editSupplier(selectedSupplier.supplier_id, updatedSupplierData);
        setIsEditDialogOpen(false);
        setSelectedSupplier(null);
        fetchSuppliers();
      } catch (error) {
        console.error("Error editing supplier: ", error);
      }
    }
  };

  const handleDeleteSupplier = async () => {
    if (selectedSupplier) {
      try {
        await supplierContext.deleteSupplier(selectedSupplier.supplier_id);
        setDeleteConfirmation(false);
        setSelectedSupplier(null);
        fetchSuppliers();
      } catch (error) {
        console.error("Error deleting supplier: ", error);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Suppliers | Your App Name</title>
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
                <Typography variant="h4">Suppliers</Typography>
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
                    <TableCell>Supplier Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === "status"}
                        direction={orderBy === "status" ? order : "asc"}
                        onClick={() => handleSort("status")}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applyPagination(suppliers, page, rowsPerPage).map((supplier) => (
                    <TableRow key={supplier.supplier_id}>
                      <TableCell>{supplier.supplier_name}</TableCell>
                      <TableCell>{supplier.description}</TableCell>
                      <TableCell>{supplier.status}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(supplier)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(supplier)}>
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

      <Dialog open={isAddDialogOpen} onClose={handleAddDialogClose} fullWidth>
        <DialogTitle>
          Create Supplier
          <IconButton edge="end" color="inherit" onClick={handleAddDialogClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              label="Supplier Name"
              fullWidth
              value={newSupplierName}
              onChange={(e) => setNewSupplierName(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Description"
              fullWidth
              value={newSupplierDescription}
              onChange={(e) => setNewSupplierDescription(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={handleCreateSupplier}>Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditDialogOpen} onClose={handleEditDialogClose} fullWidth>
        <DialogTitle>
          Edit Supplier
          <IconButton edge="end" color="inherit" onClick={handleEditDialogClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              label="Supplier Name"
              fullWidth
              value={editSupplierName}
              onChange={(e) => setEditSupplierName(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Description"
              fullWidth
              value={editSupplierDescription}
              onChange={(e) => setEditSupplierDescription(e.target.value)}
            />
          </Box>
          <TextField
            select
            label="Status"
            fullWidth
            value={editSupplierStatus}
            onChange={(e) => setEditSupplierStatus(e.target.value)}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditSupplier}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmation} onClose={handleDeleteDialogClose} fullWidth>
        <DialogTitle>
          Confirm Delete
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleDeleteDialogClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>Are you sure you want to delete this supplier?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteSupplier}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

SupplierPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SupplierPage;
