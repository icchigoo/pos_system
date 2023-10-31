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
  TableSortLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useCategoryContext } from "src/contexts/category-context";
import { useGroupContext } from "src/contexts/group-context";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";

const CategoryPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const categoryContext = useCategoryContext();
  const groupContext = useGroupContext();
  const [orderBy, setOrderBy] = useState("status");
  const [order, setOrder] = useState("asc");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryGroup, setNewCategoryGroup] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryDescription, setEditCategoryDescription] = useState("");
  const [editCategoryGroup, setEditCategoryGroup] = useState("");
  const [editCategoryStatus, setEditCategoryStatus] = useState("");

  const fetchCategories = async () => {
    try {
      const categoriesData = await categoryContext.fetchCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const groupsData = await groupContext.fetchGroups();
      setGroups(groupsData);
    } catch (error) {
      console.error("Error fetching groups: ", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchGroups();
  }, []);

  const applyPagination = (items, page, rowsPerPage) => {
    const startIndex = page * rowsPerPage;
    return items.slice(startIndex, startIndex + rowsPerPage);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    const sortedCategories = [...categories].sort((a, b) => {
      const aValue = a[property];
      const bValue = b[property];
      return (isAsc ? 1 : -1) * aValue.localeCompare(bValue);
    });

    setCategories(sortedCategories);
  };

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setEditCategoryName(category.category_name);
    setEditCategoryDescription(category.category_desc);
    setEditCategoryGroup(category.group_id);
    setEditCategoryStatus(category.status);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setDeleteConfirmation(true);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setNewCategoryName("");
    setNewCategoryDescription("");
    setNewCategoryGroup("");
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteConfirmation(false);
    setSelectedCategory(null);
  };

  const handleCreateCategory = async () => {
    try {
      const categoryData = {
        category_name: newCategoryName,
        category_desc: newCategoryDescription,
        group_id: newCategoryGroup,
      };
      await categoryContext.createCategory(categoryData);
      setIsAddDialogOpen(false);
      setNewCategoryName("");
      setNewCategoryDescription("");
      setNewCategoryGroup("");
      fetchCategories();
    } catch (error) {
      console.error("Error creating category: ", error);
    }
  };

  const handleEditCategory = async () => {
    if (selectedCategory) {
      try {
        const updatedCategoryData = {
          category_name: editCategoryName,
          category_desc: editCategoryDescription,
          group_id: editCategoryGroup,
          status: editCategoryStatus,
        };
        await categoryContext.editCategory(selectedCategory.category_id, updatedCategoryData);
        setIsEditDialogOpen(false);
        setSelectedCategory(null);
        fetchCategories();
      } catch (error) {
        console.error("Error editing category: ", error);
      }
    }
  };

  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      try {
        await categoryContext.deleteCategory(selectedCategory.category_id);
        setDeleteConfirmation(false);
        setSelectedCategory(null);
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category: ", error);
      }
    }
  };

  // Render the group name by looking up the group name using group_id
  const getGroupNameByGroupId = (groupId) => {
    const group = groups.find((group) => group.group_id === groupId);
    return group ? group.group_name : "";
  };

  return (
    <>
      <Head>
        <title>Categories | Your App Name</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Categories</Typography>
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
                    <TableCell>Category Name</TableCell>
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
                    <TableCell>Group</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applyPagination(categories, page, rowsPerPage).map((category) => (
                    <TableRow key={category.category_id}>
                      <TableCell>{category.category_name}</TableCell>
                      <TableCell>{category.category_desc}</TableCell>
                      <TableCell>{category.status}</TableCell>
                      <TableCell>{getGroupNameByGroupId(category.group_id)}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(category)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(category)}>
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
          Create Category
          <IconButton edge="end" color="inherit" onClick={handleAddDialogClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              label="Category Name"
              fullWidth
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Description"
              fullWidth
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
            />
          </Box>
          <TextField
            select
            label="Group"
            fullWidth
            value={newCategoryGroup}
            onChange={(e) => setNewCategoryGroup(e.target.value)}
          >
            {groups.map((group) => (
              <MenuItem key={group.group_id} value={group.group_id}>
                {group.group_name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={handleCreateCategory}>Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditDialogOpen} onClose={handleEditDialogClose} fullWidth>
        <DialogTitle>
          Edit Category
          <IconButton edge="end" color="inherit" onClick={handleEditDialogClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              label="Category Name"
              fullWidth
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Description"
              fullWidth
              value={editCategoryDescription}
              onChange={(e) => setEditCategoryDescription(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              select
              label="Group"
              fullWidth
              value={editCategoryGroup}
              onChange={(e) => setEditCategoryGroup(e.target.value)}
            >
              {groups.map((group) => (
                <MenuItem key={group.group_id} value={group.group_id}>
                  {group.group_name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <TextField
            select
            label="Status"
            fullWidth
            value={editCategoryStatus}
            onChange={(e) => setEditCategoryStatus(e.target.value)}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditCategory}>Save</Button>
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
        <DialogContent>Are you sure you want to delete this category?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCategory}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

CategoryPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CategoryPage;
