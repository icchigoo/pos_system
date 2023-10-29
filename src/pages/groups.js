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
import { useGroupContext } from "src/contexts/group-context";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { applyPagination } from "src/utils/apply-pagination";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import TableSortLabel from "@mui/material/TableSortLabel";

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [groups, setGroups] = useState([]);
  const groupContext = useGroupContext();
  const [orderBy, setOrderBy] = useState("status");
  const [order, setOrder] = useState("asc");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupDescription, setEditGroupDescription] = useState("");
  const [editGroupStatus, setEditGroupStatus] = useState(""); // Status state

  const fetchGroups = async () => {
    try {
      const groupsData = await groupContext.fetchGroups();
      setGroups(groupsData);
    } catch (error) {
      console.error("Error fetching groups: ", error);
    }
  };

  useEffect(() => {
    fetchGroups();
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

    const sortedGroups = [...groups].sort((a, b) => {
      const aValue = a[property];
      const bValue = b[property];
      return (isAsc ? 1 : -1) * aValue.localeCompare(bValue);
    });

    setGroups(sortedGroups);
  };

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (group) => {
    setSelectedGroup(group);
    setEditGroupName(group.group_name);
    setEditGroupDescription(group.group_desc);
    setEditGroupStatus(group.status); // Set status for editing
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (group) => {
    setSelectedGroup(group);
    setDeleteConfirmation(true);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setNewGroupName("");
    setNewGroupDescription("");
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedGroup(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteConfirmation(false);
    setSelectedGroup(null);
  };

  const handleCreateGroup = async () => {
    try {
      const groupData = {
        group_name: newGroupName,
        group_desc: newGroupDescription,
      };
      await groupContext.createGroup(groupData);
      setIsAddDialogOpen(false);
      setNewGroupName("");
      setNewGroupDescription("");
      fetchGroups();
    } catch (error) {
      console.error("Error creating group: ", error);
    }
  };

  const handleEditGroup = async () => {
    if (selectedGroup) {
      try {
        const updatedGroupData = {
          group_name: editGroupName,
          group_desc: editGroupDescription,
          status: editGroupStatus, // Include status in the update
        };
        await groupContext.editGroup(selectedGroup.group_id, updatedGroupData);
        setIsEditDialogOpen(false);
        setSelectedGroup(null);
        fetchGroups();
      } catch (error) {
        console.error("Error editing group: ", error);
      }
    }
  };

  const handleDeleteGroup = async () => {
    if (selectedGroup) {
      try {
        await groupContext.deleteGroup(selectedGroup.group_id);
        setDeleteConfirmation(false);
        setSelectedGroup(null);
        fetchGroups();
      } catch (error) {
        console.error("Error deleting group: ", error);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Groups | Pos System</title>
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
                <Typography variant="h4">Groups</Typography>
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
                    <TableCell>Group Name</TableCell>
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
                  {applyPagination(groups, page, rowsPerPage).map((group) => (
                    <TableRow key={group.group_id}>
                      <TableCell>{group.group_name}</TableCell>
                      <TableCell>{group.group_desc}</TableCell>
                      <TableCell>{group.status}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(group)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(group)}>
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
          Create Group
          <IconButton edge="end" color="inherit" onClick={handleAddDialogClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              label="Group Name"
              fullWidth
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Description"
              fullWidth
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={handleCreateGroup}>Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditDialogOpen} onClose={handleEditDialogClose} fullWidth>
        <DialogTitle>
          Edit Group
          <IconButton edge="end" color="inherit" onClick={handleEditDialogClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              label="Group Name"
              fullWidth
              value={editGroupName}
              onChange={(e) => setEditGroupName(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Description"
              fullWidth
              value={editGroupDescription}
              onChange={(e) => setEditGroupDescription(e.target.value)}
            />
          </Box>
          <TextField
            select
            label="Status"
            fullWidth
            value={editGroupStatus}
            onChange={(e) => setEditGroupStatus(e.target.value)}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditGroup}>Save</Button>
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
        <DialogContent>Are you sure you want to delete this group?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteGroup}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
