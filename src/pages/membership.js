import React, { useState, useEffect } from "react";
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
import { useMembershipContext } from "src/contexts/membership";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { applyPagination } from "src/utils/apply-pagination";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import TableSortLabel from "@mui/material/TableSortLabel";

const MembershipPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [memberships, setMemberships] = useState([]);
  const membershipContext = useMembershipContext();
  const [orderBy, setOrderBy] = useState("status");
  const [order, setOrder] = useState("asc");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const [newMembershipName, setNewMembershipName] = useState("");
  const [newMembershipPercentage, setNewMembershipPercentage] = useState("");
  const [newMembershipStatus, setNewMembershipStatus] = useState("active");

  const [editMembershipName, setEditMembershipName] = useState("");
  const [editMembershipPercentage, setEditMembershipPercentage] = useState("");
  const [editMembershipStatus, setEditMembershipStatus] = useState("active");

  const fetchMemberships = async () => {
    try {
      const membershipData = await membershipContext.fetchMemberships();
      setMemberships(membershipData);
    } catch (error) {
      console.error("Error fetching memberships: ", error);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    const sortedMemberships = [...memberships].sort((a, b) => {
      const aValue = a[property];
      const bValue = b[property];
      return (isAsc ? 1 : -1) * aValue.localeCompare(bValue);
    });

    setMemberships(sortedMemberships);
  };

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (membership) => {
    setSelectedMembership(membership);
    setEditMembershipName(membership.membership_name);
    setEditMembershipPercentage(membership.percentage);
    setEditMembershipStatus(membership.status);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (membership) => {
    setSelectedMembership(membership);
    setDeleteConfirmation(true);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setNewMembershipName("");
    setNewMembershipPercentage("");
    setNewMembershipStatus("active");
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedMembership(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteConfirmation(false);
    setSelectedMembership(null);
  };

  const handleCreateMembership = async () => {
    try {
      const membershipData = {
        membership_name: newMembershipName,
        percentage: parseFloat(newMembershipPercentage),
        status: newMembershipStatus,
      };
      await membershipContext.createMembership(membershipData);
      setIsAddDialogOpen(false);
      setNewMembershipName("");
      setNewMembershipPercentage("");
      setNewMembershipStatus("active");
      fetchMemberships();
    } catch (error) {
      console.error("Error creating membership: ", error);
    }
  };

  const handleEditMembership = async () => {
    if (selectedMembership) {
      try {
        const updatedMembershipData = {
          membership_name: editMembershipName,
          percentage: parseFloat(editMembershipPercentage),
          status: editMembershipStatus,
        };
        await membershipContext.editMembership(selectedMembership.membership_id, updatedMembershipData);
        setIsEditDialogOpen(false);
        setSelectedMembership(null);
        fetchMemberships();
      } catch (error) {
        console.error("Error editing membership: ", error);
      }
    }
  };

  const handleDeleteMembership = async () => {
    if (selectedMembership) {
      try {
        await membershipContext.deleteMembership(selectedMembership.membership_id);
        setDeleteConfirmation(false);
        setSelectedMembership(null);
        fetchMemberships();
      } catch (error) {
        console.error("Error deleting membership: ", error);
      }
    }
  };

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" spacing={4}>
          <Stack spacing={1}>
            <Typography variant="h4">Membership Types</Typography>
          </Stack>
          <div>
            <Button
              startIcon={
                <PlusIcon />
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
                <TableCell>Membership Name</TableCell>
                <TableCell>Percentage</TableCell>
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
              {applyPagination(memberships, page, rowsPerPage).map((membership) => (
                <TableRow key={membership.membership_id}>
                  <TableCell>{membership.membership_name}</TableCell>
                  <TableCell>{membership.percentage}</TableCell>
                  <TableCell>{membership.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(membership)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(membership)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      <Dialog open={isAddDialogOpen} onClose={handleAddDialogClose} fullWidth>
        <DialogTitle>
          Create Membership Type
          <IconButton edge="end" color="inherit" onClick={handleAddDialogClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              label="Membership Name"
              fullWidth
              value={newMembershipName}
              onChange={(e) => setNewMembershipName(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Percentage"
              fullWidth
              type="number"
              value={newMembershipPercentage}
              onChange={(e) => setNewMembershipPercentage(e.target.value)}
            />
          </Box>
          <TextField
            select
            label="Status"
            fullWidth
            value={newMembershipStatus}
            onChange={(e) => setNewMembershipStatus(e.target.value)}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={handleCreateMembership}>Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditDialogOpen} onClose={handleEditDialogClose} fullWidth>
        <DialogTitle>
          Edit Membership Type
          <IconButton edge="end" color="inherit" onClick={handleEditDialogClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              label="Membership Name"
              fullWidth
              value={editMembershipName}
              onChange={(e) => setEditMembershipName(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Percentage"
              fullWidth
              type="number"
              value={editMembershipPercentage}
              onChange={(e) => setEditMembershipPercentage(e.target.value)}
            />
          </Box>
          <TextField
            select
            label="Status"
            fullWidth
            value={editMembershipStatus}
            onChange={(e) => setEditMembershipStatus(e.target.value)}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditMembership}>Save</Button>
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
        <DialogContent>Are you sure you want to delete this membership type?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteMembership}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

MembershipPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MembershipPage;
