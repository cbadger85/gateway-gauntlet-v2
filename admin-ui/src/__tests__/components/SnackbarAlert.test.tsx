import React from 'react';
import { useSelector } from 'react-redux';
import { SnackbarMessage } from '../../types/SnackbarMessage';
import { shallow } from 'enzyme';
import SnackbarManager, { SnackbarAlert } from '../../components/SnackbarAlert';
import { removeSnackbar } from '../../store/alert/alertSlice';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
  useSelector: jest.fn(),
}));

jest.mock('../../store/alert/alertSlice', () => ({
  removeSnackbar: jest.fn(),
}));

const snackbar1: SnackbarMessage = {
  id: 'aaaa',
  message: 'foo',
  severity: 'error',
};

const snackbar2: SnackbarMessage = {
  id: 'bbbb',
  message: 'foo',
  severity: 'error',
};

beforeEach(jest.clearAllMocks);

describe('SnackbarAlert', () => {
  describe('<SnackbarAlert />', () => {
    it('should call removeSnackbarAlert when on close is called', () => {
      const removeSnackbarAlert = jest.fn();

      const wrapper = shallow(
        <SnackbarAlert
          id={snackbar1.id}
          message={snackbar1.message}
          severity={snackbar1.severity}
          removeSnackbarAlert={removeSnackbarAlert}
          open
        />,
      );

      const handleOnCloseAlert = wrapper.find(Alert).invoke('onClose');
      const handleOnCloseSnackbar = wrapper.find(Snackbar).invoke('onClose');

      handleOnCloseAlert && handleOnCloseAlert({} as any);
      handleOnCloseSnackbar && handleOnCloseSnackbar({} as any, '');

      expect(removeSnackbarAlert).toBeCalledTimes(2);
      expect(removeSnackbarAlert).toBeCalledWith(snackbar1.id);
    });

    it('should not close when clicked away', () => {
      const removeSnackbarAlert = jest.fn();

      const wrapper = shallow(
        <SnackbarAlert
          id={snackbar1.id}
          message={snackbar1.message}
          severity={snackbar1.severity}
          removeSnackbarAlert={removeSnackbarAlert}
          open
        />,
      );

      const clickAwayListenerProps = wrapper.find(Snackbar).props()
        .ClickAwayListenerProps;
      const value = clickAwayListenerProps?.onClickAway?.({} as any);

      expect(value).toBeNull();
    });
  });

  describe('<SnackbarManager />', () => {
    it('should show a list of Snackbar messages', () => {
      (useSelector as jest.Mock).mockReturnValue({
        current: snackbar2.id,
        snackbars: [snackbar1, snackbar2],
      });

      const wrapper = shallow(<SnackbarManager />);

      const snackbars = wrapper.find(SnackbarAlert);

      expect(snackbars).toHaveLength(2);
    });

    it('should call removeSnackbar when removeSnackbarAlert is called', () => {
      (useSelector as jest.Mock).mockReturnValue({
        current: snackbar2.id,
        snackbars: [snackbar1, snackbar2],
      });

      const wrapper = shallow(<SnackbarManager />);

      const snackbarAlert = wrapper.find(SnackbarAlert).first();

      const removeSnackbarAlert = snackbarAlert.invoke('removeSnackbarAlert');

      removeSnackbarAlert('aaaa');

      expect(removeSnackbar).toBeCalledWith('aaaa');
    });

    it('should have an open prop if the snackbar is current', () => {
      (useSelector as jest.Mock).mockReturnValue({
        current: snackbar2.id,
        snackbars: [snackbar1, snackbar2],
      });

      const wrapper = shallow(<SnackbarManager />);

      const isSnackbar2Open = wrapper
        .find(SnackbarAlert)
        .last()
        .props().open;

      expect(isSnackbar2Open).toBeTruthy();
    });

    it('should not have an open prop if the snackbar is not current', () => {
      (useSelector as jest.Mock).mockReturnValue({
        current: snackbar2.id,
        snackbars: [snackbar1, snackbar2],
      });

      const wrapper = shallow(<SnackbarManager />);

      const isSnackbar1Open = wrapper
        .find(SnackbarAlert)
        .first()
        .props().open;

      expect(isSnackbar1Open).toBeFalsy();
    });
  });
});
