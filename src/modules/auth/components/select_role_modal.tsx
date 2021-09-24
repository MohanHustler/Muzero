import React, { FunctionComponent, useState } from 'react';
import { Box, FormControl, Grid, Select, MenuItem, Typography } from '@material-ui/core';
import Button from '../../common/components/form_elements/button';
import Modal from '../../common/components/modal';
import { Role } from '../../common/enums/role';

interface Props {
  openModal: boolean;
  handleClose: () => any;
  handleSelectRole: (role: Role) => any;
  roles: Role[]
}

const SelectRoleModal: FunctionComponent<Props> = ({
  openModal,
  handleClose,
  handleSelectRole,
  roles
}) => {
  const [role, setRole] = useState<Role>();

  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if(role){
      handleSelectRole(role);
    }
  };

  return (
    <Modal
      open={openModal}
      handleClose={handleClose}
      header={
        <Box display="flex" alignItems="center">
          <Box marginLeft="15px">
            <Typography component="span" color="secondary">
              <Box component="h3" color="white" fontWeight="400" margin="0">
                Select Role
              </Box>
            </Typography>
          </Box>
        </Box>
      }
    >
      <form onSubmit={handleFormSubmission}>
        <Grid container>
          <Grid item xs={12} md={8}>
            <FormControl fullWidth margin="normal">
              <Select
                  value={role}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
                  setRole(e.target.value as Role)
                  }
                  displayEmpty
                >
                  <MenuItem value="">Select role</MenuItem>
                  {roles.length > 0 && roles.map((item) => (
                    <MenuItem value={item} >{item}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" marginTop="10px">
          <Button
            disableElevation
            variant="contained"
            color="secondary"
            type="submit"
          >
            Submit
          </Button>
        </Box>
      </form>
    </Modal>
  );
};

export default SelectRoleModal;
