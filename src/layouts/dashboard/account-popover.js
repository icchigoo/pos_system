import { useCallback } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import { useAuthContext } from "src/contexts/AuthContext";
export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const router = useRouter();
  const { user, logout } = useAuthContext();

  const handleSignOut = useCallback(async () => {
    try {
      await logout(); // Call the logout function to clear user data
      onClose?.();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error during sign-out:", error);
      // Handle any error that might occur during sign-out
    }
  }, [onClose, router, logout]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="overline">Account</Typography>
        <Typography color="text.secondary" variant="body2">
          {user ? `${user.firstname} ${user.lastname}` : "Guest"}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: "8px",
          "& > *": {
            borderRadius: 1,
          },
        }}
      >
        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};
