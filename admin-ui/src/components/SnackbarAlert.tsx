import React from 'react';
import { SnackbarMessage } from '../types/SnackbarMessage';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/rootReducer';
import { removeSnackbar } from '../store/alert/alertSlice';

export const SnackbarAlert: React.FC<SnackBarAlertProps> = ({
  id,
  message,
  severity,
  open,
  removeSnackbarAlert,
}) => {
  const handleOnClose = (): void => {
    removeSnackbarAlert(id);
  };
  return (
    <Snackbar
      ClickAwayListenerProps={{ onClickAway: undefined }}
      key={id}
      open={open}
      autoHideDuration={4000}
      onClose={handleOnClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        elevation={6}
        variant="filled"
        severity={severity}
        onClose={handleOnClose}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

interface SnackBarAlertProps extends SnackbarMessage {
  open: boolean;
  removeSnackbarAlert: (id: string) => void;
}

const SnackbarManager: React.FC = () => {
  const alert = useSelector((state: RootState) => state.alert);
  const dispatch = useDispatch();

  const removeSnackbarAlert = (id: string): void => {
    dispatch(removeSnackbar(id));
  };

  return (
    <>
      {alert.snackbars.map(({ id, message, severity }) => (
        <SnackbarAlert
          key={id}
          id={id}
          message={message}
          severity={severity}
          removeSnackbarAlert={removeSnackbarAlert}
          open={id === alert.current}
        />
      ))}
    </>
  );
};

export default SnackbarManager;
