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
  MenuItem, // Add MenuItem for the dropdown
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useUnitContext } from "src/contexts/unit-context"; // Import the unit context
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { applyPagination } from "src/utils/apply-pagination";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import TableSortLabel from "@mui/material/TableSortLabel";

const UnitPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [units, setUnits] = useState([]);
  const unitContext = useUnitContext(); // Use the unit context
  const [orderBy, setOrderBy] = useState("status");
  const [order, setOrder] = useState("asc");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const [newUnitName, setNewUnitName] = useState("");
  const [newUnitDescription, setNewUnitDescription] = useState("");
  const [newUnitStatus, setNewUnitStatus] = useState(""); // Status state

  const [editUnitName, setEditUnitName] = useState("");
  const [editUnitDescription, setEditUnitDescription] = useState("");
  const [editUnitStatus, setEditUnitStatus] = useState(""); // Status state

  const fetchUnits = async () => {
    try {
      const unitsData = await unitContext.fetchUnits();
      setUnits(unitsData);
    } catch (error) {
      console.error("Error fetching units: ", error);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    const sortedUnits = [...units].sort((a, b) => {
      const aValue = a[property];
      const bValue = b[property];
      return (isAsc ? 1 : -1) * aValue.localeCompare(bValue);
    });

    setUnits(sortedUnits);
  };

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (unit) => {
    setSelectedUnit(unit);
    setEditUnitName(unit.unit_name);
    setEditUnitDescription(unit.group_desc);
    setEditUnitStatus(unit.status); // Set status for editing
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (unit) => {
    setSelectedUnit(unit);
    setDeleteConfirmation(true);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setNewUnitName("");
    setNewUnitDescription("");
    setNewUnitStatus(""); // Reset status
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedUnit(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteConfirmation(false);
    setSelectedUnit(null);
  };

  const handleCreateUnit = async () => {
    try {
      const unitData = {
        unit_name: newUnitName,
        group_desc: newUnitDescription,
        status: newUnitStatus, // Include status
      };
      await unitContext.createUnit(unitData);
      setIsAddDialogOpen(false);
      setNewUnitName("");
      setNewUnitDescription("");
      setNewUnitStatus(""); // Reset status
      fetchUnits();
    } catch (error) {
      console.error("Error creating unit: ", error);
    }
  };

  const handleEditUnit = async () => {
    if (selectedUnit) {
      try {
        const updatedUnitData = {
          unit_name: editUnitName,
          group_desc: editUnitDescription,
          status: editUnitStatus, // Include status
        };
        await unitContext.editUnit(selectedUnit.unit_id, updatedUnitData);
        setIsEditDialogOpen(false);
        setSelectedUnit(null);
        fetchUnits();
      } catch (error) {
        console.error("Error editing unit: ", error);
      }
    }
  };

  const handleDeleteUnit = async () => {
    if (selectedUnit) {
      try {
        await unitContext.deleteUnit(selectedUnit.unit_id);
        setDeleteConfirmation(false);
        setSelectedUnit(null);
        fetchUnits();
      } catch (error) {
        console.error("Error deleting unit: ", error);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Units | Your App Name</title>
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
                <Typography variant="h4">Units</Typography>
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
                    <TableCell>Unit Name</TableCell>
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
                  {applyPagination(units, page, rowsPerPage).map((unit) => (
                    <TableRow key={unit.unit_id}>
                      <TableCell>{unit.unit_name}</TableCell>
                      <TableCell>{unit.group_desc}</TableCell>
                      <TableCell>{unit.status}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(unit)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(unit)}>
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
          Create Unit
          <IconButton edge="end" color="inherit" onClick={handleAddDialogClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              label="Unit Name"
              fullWidth
              value={newUnitName}
              onChange={(e) => setNewUnitName(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Description"
              fullWidth
              value={newUnitDescription}
              onChange={(e) => setNewUnitDescription(e.target.value)}
            />
          </Box>
          <TextField
            select
            label="Status"
            fullWidth
            value={newUnitStatus}
            onChange={(e) => setNewUnitStatus(e.target.value)}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={handleCreateUnit}>Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditDialogOpen} onClose={handleEditDialogClose} fullWidth>
        <DialogTitle>
          Edit Unit
          <IconButton edge="end" color="inherit" onClick={handleEditDialogClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              label="Unit Name"
              fullWidth
              value={editUnitName}
              onChange={(e) => setEditUnitName(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Description"
              fullWidth
              value={editUnitDescription}
              onChange={(e) => setEditUnitDescription(e.target.value)}
            />
          </Box>
          <TextField
            select
            label="Status"
            fullWidth
            value={editUnitStatus}
            onChange={(e) => setEditUnitStatus(e.target.value)}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditUnit}>Save</Button>
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
        <DialogContent>Are you sure you want to delete this unit?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteUnit}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

UnitPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UnitPage;
