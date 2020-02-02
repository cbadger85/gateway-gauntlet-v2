import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Form, Formik } from 'formik';
import React, { useMemo, useState } from 'react';
import * as Yup from 'yup';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Must be an email')
    .required('Email is required'),
});

const useStyles = makeStyles(theme => ({
  inputFields: {
    margin: theme.spacing(1),
    width: '100%',
  },
}));

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  closeModal,
  isOpen,
  submitForgotPassword,
}) => {
  const classes = useStyles();
  const [isBlurred, setIsBlurred] = useState({
    email: false,
  });

  const forgotPasswordInitialValues = useMemo(
    () => ({
      email: '',
    }),
    [],
  );

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e): void => {
    setIsBlurred(state => ({
      ...state,
      [e.target.name]: true,
    }));
  };

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <DialogTitle>Forgot Password?</DialogTitle>
      <Formik
        initialValues={forgotPasswordInitialValues}
        validationSchema={forgotPasswordSchema}
        validateOnMount
        onSubmit={submitForgotPassword}
      >
        {props => (
          <DialogContent>
            <DialogContentText>
              Enter your email and a password reset link will be sent to you.
            </DialogContentText>
            <Form className={classes.inputFields}>
              <TextField
                margin="dense"
                required
                fullWidth
                label="Email"
                name="email"
                autoComplete="email"
                type="email"
                autoFocus
                onChange={e => {
                  e.persist();
                  props.handleChange(e);
                  props.setFieldTouched(e.target.name, true, false);
                }}
                value={props.values.email}
                error={isBlurred && !!props.errors.email}
                helperText={isBlurred ? props.errors.email : ''}
                onBlur={handleBlur}
              />
              <DialogActions>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={!props.isValid}
                >
                  Submit
                </Button>
                <Button onClick={closeModal} color="secondary">
                  Cancel
                </Button>
              </DialogActions>
            </Form>
          </DialogContent>
        )}
      </Formik>
    </Dialog>
  );
};

export default ForgotPasswordModal;

interface ForgotPasswordModalProps {
  closeModal: () => void;
  isOpen: boolean;
  submitForgotPassword: (values: { email: string }) => void;
}
