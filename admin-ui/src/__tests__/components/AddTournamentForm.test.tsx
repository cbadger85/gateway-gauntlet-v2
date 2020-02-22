import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import AddTournamentForm from '../../components/AddTournamentForm';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';

const organizer = {
  id: '1234',
  name: 'organizer',
};

describe('AddTournamentForm', () => {
  it('should call save when the form is submitted', async () => {
    const save = jest.fn();
    const closeForm = jest.fn();
    const clearErrorMessage = jest.fn();
    const { getByTestId, getByText } = render(
      <AddTournamentForm
        closeForm={closeForm}
        save={save}
        clearErrorMessage={clearErrorMessage}
        organizers={[organizer]}
      />,
    );

    const nameInput = getByTestId('tournament-name-input').querySelector(
      'input',
    );
    const missionInput = getByTestId('mission-input').querySelector('input');
    const addMissionButton = getByTestId('add-mission-button');
    const organizersButton = getByTestId('organizers-button');

    await act(async () => {
      fireEvent.change(nameInput as Element, {
        target: { value: 'tournament 1' },
      });
    });

    await act(async () => {
      fireEvent.change(missionInput as Element, {
        target: { value: 'mission 1' },
      });
    });

    await act(async () => {
      fireEvent.click(addMissionButton as Element);
    });

    await act(async () => {
      fireEvent.mouseDown(organizersButton as Element);
    });

    await act(async () => {
      const organizersOption = getByText('organizer');
      fireEvent.click(organizersOption as Element);
    });

    await act(async () => {
      fireEvent.submit(getByTestId('add-tournament-form') as Element);
    });

    expect(save).toBeCalled();
  });

  it('should not call save if the form is invalid', async () => {
    const save = jest.fn();
    const closeForm = jest.fn();
    const clearErrorMessage = jest.fn();
    const { getByTestId } = render(
      <AddTournamentForm
        closeForm={closeForm}
        save={save}
        clearErrorMessage={clearErrorMessage}
        organizers={[organizer]}
      />,
    );

    const lengthInput = getByTestId('tournament-length-input').querySelector(
      'input',
    );

    await act(async () => {
      fireEvent.change(lengthInput as Element, {
        target: { value: 'aaa' },
      });
    });

    await act(async () => {
      fireEvent.submit(getByTestId('add-tournament-form') as Element);
    });

    expect(save).not.toBeCalled();
  });

  it('should call closeForm when the cancel button is clicked', () => {
    const save = jest.fn();
    const closeForm = jest.fn();
    const clearErrorMessage = jest.fn();
    const wrapper = shallow(
      <AddTournamentForm
        closeForm={closeForm}
        save={save}
        clearErrorMessage={clearErrorMessage}
        organizers={[organizer]}
      />,
    );

    wrapper
      .find(Button)
      .findWhere(btn => btn.props()['data-testid'] === 'cancel-button')
      .invoke('onClick')?.();

    expect(closeForm).toBeCalledWith();
  });

  it('should show the alert if an error message is passed', () => {
    const save = jest.fn();
    const closeForm = jest.fn();
    const clearErrorMessage = jest.fn();
    const wrapper = shallow(
      <AddTournamentForm
        closeForm={closeForm}
        save={save}
        clearErrorMessage={clearErrorMessage}
        organizers={[organizer]}
        errorMessage="error"
      />,
    );

    const alert = wrapper.find(Alert);

    expect(alert.exists()).toBe(true);
  });

  it('should close the error message when the close icon is clicked', () => {
    const save = jest.fn();
    const closeForm = jest.fn();
    const clearErrorMessage = jest.fn();
    const wrapper = shallow(
      <AddTournamentForm
        closeForm={closeForm}
        save={save}
        clearErrorMessage={clearErrorMessage}
        organizers={[organizer]}
        errorMessage="error"
      />,
    );

    wrapper.find(Alert).invoke('onClose')?.({} as any);

    expect(clearErrorMessage).toBeCalled();
  });
});
