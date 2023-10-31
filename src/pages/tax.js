import React, { useCallback, useState, useEffect } from "react";
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
import { useTaxContext } from "src/contexts/tax-context";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { applyPagination } from "src/utils/apply-pagination";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import TableSortLabel from "@mui/material/TableSortLabel";

const TaxPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [taxes, setTaxes] = useState([]);
  const taxContext = useTaxContext();
  const [orderBy, setOrderBy] = useState("status");
  const [order, setOrder] = useState("asc");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const [newTaxName, setNewTaxName] = useState("");
  const [newTaxDesc, setNewTaxDesc] = useState("");
  const [newTaxStatus, setNewTaxStatus] = useState("active");

  const [editTaxName, setEditTaxName] = useState("");
  const [editTaxDesc, setEditTaxDesc] = useState("");
  const [editTaxStatus, setEditTaxStatus] = useState("");

  const fetchTaxes = async () => {
    try {
      const taxesData = await taxContext.fetchTaxes();
      setTaxes(taxesData);
    } catch (error) {
      console.error("Error fetching taxes: ", error);
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    const sortedTaxes = [...taxes].sort((a, b) => {
      const aValue = a[property];
      const bValue = b[property];
      return (isAsc ? 1 : -1) * aValue.localeCompare(bValue);
    });

    setTaxes(sortedTaxes);
  };

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (tax) => {
    setSelectedTax(tax);
    setEditTaxName(tax.tax_name);
    setEditTaxDesc(tax.tax_desc);
    setEditTaxStatus(tax.status);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (tax) => {
    setSelectedTax(tax);
    setDeleteConfirmation(true);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setNewTaxName("");
    setNewTaxDesc("");
    setNewTaxStatus("active");
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedTax(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteConfirmation(false);
    setSelectedTax(null);
  };

  const handleCreateTax = async () => {
    try {
      const taxData = {
        tax_name: newTaxName,
        tax_desc: newTaxDesc,
        status: newTaxStatus,
      };
      await taxContext.createTax(taxData);
      setIsAddDialogOpen(false);
      setNewTaxName("");
      setNewTaxDesc("");
      setNewTaxStatus("active");
      fetchTaxes();
    } catch (error) {
      console.error("Error creating tax: ", error);
    }
  };

  const handleEditTax = async () => {
    if (selectedTax) {
      try {
        const updatedTaxData = {
          tax_name: editTaxName,
          tax_desc: editTaxDesc,
          status: editTaxStatus,
        };
        await taxContext.editTax(selectedTax.tax_id, updatedTaxData);
        setIsEditDialogOpen(false);
        setSelectedTax(null);
        fetchTaxes();
      } catch (error) {
        console.error("Error editing tax: ", error);
      }
    }
  };

  const handleDeleteTax = async () => {
    if (selectedTax) {
      try {
        await taxContext.deleteTax(selectedTax.tax_id);
        setDeleteConfirmation(false);
        setSelectedTax(null);
        fetchTaxes();
      } catch (error) {
        console.error("Error deleting tax: ", error);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Taxes | Pos System</title>
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
                <Typography variant="h4">Taxes</Typography>
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
                    <TableCell>Tax Name</TableCell>
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
                  {applyPagination(taxes, page, rowsPerPage).map((tax) => (
                    <TableRow key={tax.tax_id}>
                      <TableCell>{tax.tax_name}</TableCell>
                      <TableCell>{tax.tax_desc}</TableCell>
                      <TableCell>{tax.status}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(tax)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(tax)}>
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
          Create Tax
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleAddDialogClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              label="Tax Name"
              fullWidth
              value={newTaxName}
              onChange={(e) => setNewTaxName(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Description"
              fullWidth
              value={newTaxDesc}
              onChange={(e) => setNewTaxDesc(e.target.value)}
            />
          </Box>
          <TextField
            select
            label="Status"
            fullWidth
            value={newTaxStatus}
            onChange={(e) => setNewTaxStatus(e.target.value)}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={handleCreateTax}>Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditDialogOpen} onClose={handleEditDialogClose} fullWidth>
        <DialogTitle>
          Edit Tax
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleEditDialogClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              label="Tax Name"
              fullWidth
              value={editTaxName}
              onChange={(e) => setEditTaxName(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Description"
              fullWidth
              value={editTaxDesc}
              onChange={(e) => setEditTaxDesc(e.target.value)}
            />
          </Box>
          <TextField
            select
            label="Status"
            fullWidth
            value={editTaxStatus}
            onChange={(e) => setEditTaxStatus(e.target.value)}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditTax}>Save</Button>
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
        <DialogContent>Are you sure you want to delete this tax?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteTax}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

TaxPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default TaxPage;
