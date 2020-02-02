import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Form, FormikProps } from 'formik';
import React from 'react';

const useStyles = makeStyles(theme => ({
  inputFields: {
    margin: theme.spacing(1),
    width: '100%',
  },
  loginButton: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const LoginForm: React.FC<LoginFormProps> = ({
  values,
  handleChange,
  setFieldTouched,
  touched,
  errors,
  isValid,
  handleBlur,
}) => {
  const classes = useStyles();

  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ): void => {
    e.persist();
    handleChange(e);
    setFieldTouched(e.target.name, true, false);
  };

  return (
    <Form className={classes.inputFields}>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        onChange={changeHandler}
        value={values.username}
        error={touched.username && !!errors.username}
        helperText={touched.username ? errors.username : ''}
        onBlur={handleBlur}
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
        onChange={changeHandler}
        value={values.password}
        error={touched.password && !!errors.password}
        helperText={touched.password ? errors.password : ''}
        onBlur={handleBlur}
      />
      <Button
        type="submit"
        className={classes.loginButton}
        color="primary"
        variant="contained"
        disabled={!isValid}
        fullWidth
      >
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;

type LoginFormProps = FormikProps<{
  username: string;
  password: string;
}>;
