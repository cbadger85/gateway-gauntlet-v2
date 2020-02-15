import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .trim()
    .required('Please enter a password')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: Yup.string()
    .trim()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password'), null], 'Passwords need to match'),
});

type FieldData = Yup.InferType<typeof passwordSchema>;

const useStyles = makeStyles(theme => ({
  submitButton: {
    margin: theme.spacing(3, 0, 2),
  },
  cancelButton: {
    margin: theme.spacing(1, 2, 0),
  },
}));

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  submitPasswordReset,
  profilePage,
  onCancel,
}) => {
  const classes = useStyles();

  const { register, errors, handleSubmit } = useForm<FieldData>({
    mode: 'onBlur',
    validationSchema: passwordSchema,
  });

  return (
    <form
      onSubmit={handleSubmit(submitPasswordReset)}
      noValidate
      data-testid="password-reset-form"
    >
      <TextField
        margin="normal"
        type="password"
        required
        fullWidth
        label="Password"
        name="password"
        autoComplete="off"
        autoFocus
        inputRef={register}
        error={!!errors.password}
        helperText={errors.password ? errors.password?.message : ''}
        data-testid="password-input"
      />
      <TextField
        margin="normal"
        type="password"
        required
        fullWidth
        label="Confirm Password"
        name="confirmPassword"
        autoComplete="off"
        inputRef={register}
        error={!!errors.confirmPassword}
        helperText={
          errors.confirmPassword ? errors.confirmPassword?.message : ''
        }
        data-testid="confirm-password-input"
      />
      <Box
        display={profilePage ? 'flex' : undefined}
        justifyContent={profilePage ? 'flex-end' : undefined}
        alignItems={profilePage ? 'center' : undefined}
        data-testid="button-container"
      >
        {profilePage && (
          <Button
            className={classes.cancelButton}
            onClick={onCancel}
            data-testid="cancel-button"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          color={profilePage ? 'primary' : 'secondary'}
          variant="outlined"
          fullWidth={!profilePage}
          className={classes.submitButton}
        >
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default PasswordResetForm;

interface PasswordResetFormProps {
  submitPasswordReset: (value: FieldData) => void;
  profilePage?: boolean;
  onCancel?: () => void;
}
