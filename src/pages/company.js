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
import { useCompanyContext } from "src/contexts/company-context";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { applyPagination } from "src/utils/apply-pagination";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const companyContext = useCompanyContext();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyAddress, setNewCompanyAddress] = useState("");
  const [newCompanyEmail, setNewCompanyEmail] = useState("");
  const [newCompanyContact, setNewCompanyContact] = useState("");
  const [newCompanyPAN, setNewCompanyPAN] = useState("");
  const [newCompanyType, setNewCompanyType] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRefLink, setNewRefLink] = useState("");

  const [editCompanyEmail, setEditCompanyEmail] = useState("");
  const [editCompanyContact, setEditCompanyContact] = useState("");
  const [editCompanyPAN, setEditCompanyPAN] = useState("");
  const [editCompanyType, setEditCompanyType] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRefLink, setEditRefLink] = useState("");

  const [editCompanyName, setEditCompanyName] = useState("");
  const [editCompanyAddress, setEditCompanyAddress] = useState("");

  const fetchCompanies = async () => {
    try {
      const companiesData = await companyContext.fetchCompanies();
      setCompanies(companiesData);
    } catch (error) {
      console.error("Error fetching companies: ", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (company) => {
    setSelectedCompany(company);
    setEditCompanyName(company.company_name);
    setEditCompanyAddress(company.company_address);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (company) => {
    setSelectedCompany(company);
    setDeleteConfirmation(true);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
    setNewCompanyName("");
    setNewCompanyAddress("");
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedCompany(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteConfirmation(false);
    setSelectedCompany(null);
  };

  const handleCreateCompany = async () => {
    try {
      const companyData = {
        company_name: newCompanyName,
        company_address: newCompanyAddress,
        company_email: newCompanyEmail,
        company_contact: newCompanyContact,
        company_PAN: newCompanyPAN,
        company_type: newCompanyType,
        username: newUsername,
        password: newPassword,
        ref_link: newRefLink,
      };
      await companyContext.createCompany(companyData);
      setIsAddDialogOpen(false);
      setNewCompanyName("");
      setNewCompanyAddress("");
      setNewCompanyEmail("");
      setNewCompanyContact("");
      setNewCompanyPAN("");
      setNewCompanyType("");
      setNewUsername("");
      setNewPassword("");
      setNewRefLink("");
      fetchCompanies();
    } catch (error) {
      console.error("Error creating company: ", error);
    }
  };

  const handleEditCompany = async () => {
    if (selectedCompany) {
      try {
        const updatedCompanyData = {
          company_name: editCompanyName,
          company_address: editCompanyAddress,
          company_email: editCompanyEmail,
          company_contact: editCompanyContact,
          company_PAN: editCompanyPAN,
          company_type: editCompanyType,
          username: editUsername,
          password: editPassword,
          ref_link: editRefLink,
        };
        await companyContext.editCompany(selectedCompany.company_id, updatedCompanyData);
        setIsEditDialogOpen(false);
        setSelectedCompany(null);
        fetchCompanies();
      } catch (error) {
        console.error("Error editing company: ", error);
      }
    }
  };

  const handleDeleteCompany = async () => {
    if (selectedCompany) {
      try {
        await companyContext.deleteCompany(selectedCompany.company_id);
        setDeleteConfirmation(false);
        setSelectedCompany(null);
        fetchCompanies();
      } catch (error) {
        console.error("Error deleting company: ", error);
      }
    }
  };

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Companies</Typography>
              </Stack>
              <div>
                <Button startIcon={<PlusIcon />} variant="contained" onClick={handleAddClick}>
                  Add
                </Button>
              </div>
            </Stack>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Company Name</TableCell>
                    <TableCell>Company Address</TableCell>
                    <TableCell>Company Email</TableCell>
                    <TableCell>Company Contact</TableCell>
                    <TableCell>Company PAN</TableCell>
                    <TableCell>Company Type</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Password</TableCell>
                    <TableCell>Ref Link</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applyPagination(companies, page, rowsPerPage).map((company) => (
                    <TableRow key={company.company_id}>
                      <TableCell>{company.company_name}</TableCell>
                      <TableCell>{company.company_address}</TableCell>
                      <TableCell>{company.company_email}</TableCell>
                      <TableCell>{company.company_contact}</TableCell>
                      <TableCell>{company.company_PAN}</TableCell>
                      <TableCell>{company.company_type}</TableCell>
                      <TableCell>{company.username}</TableCell>
                      <TableCell>{company.password}</TableCell>
                      <TableCell>{company.ref_link}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(company)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(company)}>
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
          Create Company
          <IconButton edge="end" color="inherit" onClick={handleAddDialogClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              label="Company Name"
              fullWidth
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Company Address"
              fullWidth
              value={newCompanyAddress}
              onChange={(e) => setNewCompanyAddress(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Company Email"
              fullWidth
              value={newCompanyEmail}
              onChange={(e) => setNewCompanyEmail(e.target.value)}
            />
          </Box>{" "}
          <Box mb={2}>
            <TextField
              label="Company Contact"
              fullWidth
              value={newCompanyContact}
              onChange={(e) => setNewCompanyContact(e.target.value)}
            />
          </Box>{" "}
          <Box mb={2}>
            <TextField
              label="Company PAN"
              fullWidth
              value={newCompanyPAN}
              onChange={(e) => setNewCompanyPAN(e.target.value)}
            />
          </Box>{" "}
          <Box mb={2}>
            <TextField
              label="Company Type"
              fullWidth
              value={newCompanyType}
              onChange={(e) => setNewCompanyType(e.target.value)}
            />
          </Box>{" "}
          <Box mb={2}>
            <TextField
              label="Username"
              fullWidth
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Ref Link"
              fullWidth
              value={newRefLink}
              onChange={(e) => setNewRefLink(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button onClick={handleCreateCompany}>Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditDialogOpen} onClose={handleEditDialogClose} fullWidth>
        <DialogTitle>
          Edit Company
          <IconButton edge="end" color="inherit" onClick={handleEditDialogClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <TextField
              label="Company Name"
              fullWidth
              value={editCompanyName}
              onChange={(e) => setEditCompanyName(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Company Address"
              fullWidth
              value={editCompanyAddress}
              onChange={(e) => setEditCompanyAddress(e.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Company Email"
              fullWidth
              value={editCompanyEmail}
              onChange={(e) => setEditCompanyEmail(e.target.value)}
            />
          </Box>{" "}
          <Box mb={2}>
            <TextField
              label="Company Contact"
              fullWidth
              value={editCompanyContact}
              onChange={(e) => setEditCompanyContact(e.target.value)}
            />
          </Box>{" "}
          <Box mb={2}>
            <TextField
              label="Company PAN"
              fullWidth
              value={editCompanyPAN}
              onChange={(e) => setEditCompanyPAN(e.target.value)}
            />
          </Box>{" "}
          <Box mb={2}>
            <TextField
              label="Company Type"
              fullWidth
              value={editCompanyType}
              onChange={(e) => setEditCompanyType(e.target.value)}
            />
          </Box>{" "}
          <Box mb={2}>
            <TextField
              label="Username"
              fullWidth
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
            />
          </Box>{" "}
          <Box mb={2}>
            <TextField
              label="Password"
              fullWidth
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
            />
          </Box>{" "}
          <Box mb={2}>
            <TextField
              label="Ref Link"
              fullWidth
              value={editRefLink}
              onChange={(e) => setEditRefLink(e.target.value)}
            />
          </Box>{" "}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditCompany}>Save</Button>
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
        <DialogContent>Are you sure you want to delete this company?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCompany}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

CompanyPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CompanyPage;
