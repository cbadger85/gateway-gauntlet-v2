import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useHasRole } from '../hooks/useHasRole';
import { Role, User } from '../types/User';
import { enumToCapitalcase } from '../utils/enumToCapitalcase';
import Alert from '@material-ui/lab/Alert';
import DisableUser from './DisableUser';

const upsertUserSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .required('Please enter a first name')
    .max(16, 'First name must be less than 16 characters'),
  lastName: Yup.string()
    .trim()
    .required('Please enter a last name')
    .max(16, 'Last name must be less than 16 characters'),
  username: Yup.string()
    .trim()
    .max(16, 'Username must be less than 16 characters')
    .required('Please enter a username'),
  email: Yup.string()
    .trim()
    .required('Please enter an email')
    .max(32, 'Email must be less than 32 characters')
    .email('Must be a valid email'),
  roles: Yup.array()
    .required('At least one role is required')
    .ensure(),
});

export type FieldData = Yup.InferType<typeof upsertUserSchema>;

const useStyles = makeStyles(theme => ({
  cancelButton: {
    marginRight: theme.spacing(1),
  },
  textFieldRowContainer: {
    marginBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
  },
  halfWidthInputField: {
    width: '48%',
  },
  roleSelector: {
    minWidth: '250px',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 56px)',
  },
  badRequestAlert: {
    margin: theme.spacing(2, 0),
  },
}));

const defaultUser = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  roles: [],
};

const UpsertUserForm: React.FC<UpsertUserFormProps> = ({
  user = defaultUser,
  closeForm,
  save,
  isSideDrawer,
  errorMessage,
  clearErrorMessage,
  updateUser,
}) => {
  const { register, handleSubmit, control, errors } = useForm<FieldData>({
    mode: 'onBlur',
    validationSchema: upsertUserSchema,
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      roles: user.roles,
    },
  });
  const classes = useStyles();
  const hasRole = useHasRole();

  const getRoleOptions = (): string[] => {
    if (hasRole(Role.SUPER_ADMIN)) {
      return Object.keys(Role);
    }

    if (hasRole(Role.ADMIN)) {
      return Object.keys(Role).filter(
        role => !(role === Role.SUPER_ADMIN || role === Role.ADMIN),
      );
    }

    return [];
  };

  const handleEditUser = (values: FieldData): void => {
    save(values);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleEditUser)}
      className={classes.formContainer}
      data-testid="upsert-user-form"
    >
      <div>
        <div className={isSideDrawer ? '' : classes.textFieldRowContainer}>
          <TextField
            className={isSideDrawer ? '' : classes.halfWidthInputField}
            fullWidth
            label="First Name"
            name="firstName"
            autoFocus
            autoComplete="off"
            required
            error={!!errors.firstName}
            helperText={errors.firstName ? errors.firstName.message : ''}
            data-testid="first-name-input"
            inputRef={register}
          />
          <TextField
            className={isSideDrawer ? '' : classes.halfWidthInputField}
            fullWidth
            label="Last Name"
            name="lastName"
            autoComplete="off"
            required
            inputRef={register}
            error={!!errors.lastName}
            helperText={errors.lastName ? errors.lastName.message : ''}
            data-testid="last-name-input"
          />
        </div>
        <div className={isSideDrawer ? '' : classes.textFieldRowContainer}>
          <TextField
            margin="dense"
            fullWidth
            className={isSideDrawer ? '' : classes.halfWidthInputField}
            label="Username"
            name="username"
            autoComplete="off"
            required
            error={!!errors.username}
            helperText={errors.username ? errors.username.message : ''}
            data-testid="username-input"
            inputRef={register}
          />
          <TextField
            margin="dense"
            fullWidth
            required
            className={isSideDrawer ? '' : classes.halfWidthInputField}
            label="Email"
            name="email"
            autoComplete="off"
            type="email"
            inputRef={register}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
            data-testid="email-input"
          />
        </div>
        <FormControl
          required
          error={!!errors.roles}
          className={isSideDrawer ? '' : classes.roleSelector}
          fullWidth={isSideDrawer}
        >
          <InputLabel id="role-multiselect">Roles</InputLabel>
          <Controller
            as={Select}
            labelId="role-multiselect"
            name="roles"
            label="Roles"
            multiple
            control={control}
            SelectDisplayProps={{
              'data-testid': 'role-button',
            }}
          >
            {getRoleOptions().map(role => (
              <MenuItem key={role} value={role} data-testid={`${role}-option`}>
                {enumToCapitalcase(role)}
              </MenuItem>
            ))}
          </Controller>
          <FormHelperText error={!!errors.roles}>
            {errors.roles ? errors.roles.message : ''}
          </FormHelperText>
        </FormControl>
      </div>
      <Box flex="1">
        {errorMessage && (
          <Alert
            variant="outlined"
            severity="error"
            onClose={clearErrorMessage}
            className={classes.badRequestAlert}
          >
            {errorMessage}
          </Alert>
        )}
      </Box>
      <Box display="flex" justifyContent="flex-end">
        {isSideDrawer ? (
          <Button onClick={closeForm} className={classes.cancelButton}>
            Cancel
          </Button>
        ) : (
          <DisableUser
            onClick={closeForm}
            user={user as User}
            updateUser={updateUser || (() => null)}
          />
        )}
        <Button variant="outlined" color="primary" type="submit">
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default UpsertUserForm;

type UpsertUserFormProps = EditUserFormProps | AddUserFormProps;

interface EditUserFormProps {
  user: User;
  save: (values: FieldData) => void;
  closeForm: () => void;
  isSideDrawer?: undefined;
  errorMessage?: string;
  clearErrorMessage: () => void;
  updateUser: (user: User) => void;
}

interface AddUserFormProps {
  user?: undefined;
  save: (values: FieldData) => void;
  closeForm: () => void;
  isSideDrawer: true;
  errorMessage?: string;
  clearErrorMessage: () => void;
  updateUser?: undefined;
}
