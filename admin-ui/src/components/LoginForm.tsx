import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

type FieldData = Yup.InferType<typeof loginSchema>;

const useStyles = makeStyles(theme => ({
  inputFields: {
    margin: theme.spacing(1),
    width: '100%',
  },
  loginButton: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const LoginForm: React.FC<LoginFormProps> = ({ login }) => {
  const classes = useStyles();
  const { register, errors, handleSubmit } = useForm<FieldData>({
    mode: 'onBlur',
    validationSchema: loginSchema,
  });

  return (
    <form
      className={classes.inputFields}
      onSubmit={handleSubmit(login)}
      noValidate
      data-testid="login-form"
    >
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        inputRef={register}
        error={!!errors.username}
        helperText={errors.username ? errors.username.message : ''}
        data-testid="username-input"
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Password"
        name="password"
        type="password"
        autoComplete="password"
        inputRef={register}
        error={!!errors.password}
        helperText={errors.password ? errors.password.message : ''}
        data-testid="password-input"
      />
      <Button
        type="submit"
        className={classes.loginButton}
        variant="outlined"
        color="secondary"
        fullWidth
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;

type LoginFormProps = {
  login: (values: FieldData) => void;
};
