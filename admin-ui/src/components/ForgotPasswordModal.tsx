import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Must be a valid email')
    .required('Email is required'),
});

const useStyles = makeStyles(theme => ({
  inputFields: {
    margin: theme.spacing(1),
    width: '100%',
  },
}));

type FormData = {
  email: string;
};

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  closeModal,
  isOpen,
  submitForgotPassword,
}) => {
  const classes = useStyles();

  const { register, errors, handleSubmit } = useForm<FormData>({
    mode: 'onBlur',
    validationSchema: forgotPasswordSchema,
  });

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <DialogTitle>Forgot Password?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter your email and a password reset link will be sent to you.
        </DialogContentText>
        <form
          className={classes.inputFields}
          onSubmit={handleSubmit(submitForgotPassword)}
          noValidate
          data-testid="forgot-password-form"
        >
          <TextField
            margin="dense"
            required
            fullWidth
            label="Email"
            name="email"
            autoComplete="off"
            type="email"
            autoFocus
            inputRef={register}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
            data-testid="email-input"
          />
          <DialogActions>
            <Button onClick={closeModal} data-testid="email-cancel-button">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outlined"
              data-testid="email-submit-button"
              color="secondary"
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;

interface ForgotPasswordModalProps {
  closeModal: () => void;
  isOpen: boolean;
  submitForgotPassword: (values: { email: string }) => void;
}
