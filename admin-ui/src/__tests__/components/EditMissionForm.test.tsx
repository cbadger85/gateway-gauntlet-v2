import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import Button from '@material-ui/core/Button';
import EditMissionsForm from '../../components/EditMissionsForm';

describe('<EditMissionForm />', () => {
  it('should call onSave when the form is submitted', async () => {
    const missions = ['mission 1'];
    const onSave = jest.fn();
    const closeDrawer = jest.fn();

    const { getByTestId } = render(
      <EditMissionsForm
        missions={missions}
        onSave={onSave}
        closeDrawer={closeDrawer}
      />,
    );

    const missionInput = getByTestId('mission-input').querySelector('input');
    const addMissionButton = getByTestId('add-mission-button');

    await act(async () => {
      fireEvent.change(missionInput as Element, {
        target: { value: 'mission 2' },
      });
    });

    await act(async () => {
      fireEvent.click(addMissionButton as Element);
    });

    await act(async () => {
      fireEvent.submit(getByTestId('edit-missions-form') as Element);
    });

    expect(onSave).toBeCalledWith(['mission 1', 'mission 2']);
  });

  it('should not call onSave when the form is invalid', async () => {
    const missions: string[] = [];
    const onSave = jest.fn();
    const closeDrawer = jest.fn();

    const { getByTestId } = render(
      <EditMissionsForm
        missions={missions}
        onSave={onSave}
        closeDrawer={closeDrawer}
      />,
    );

    const addMissionButton = getByTestId('add-mission-button');

    await act(async () => {
      fireEvent.click(addMissionButton as Element);
    });

    await act(async () => {
      fireEvent.submit(getByTestId('edit-missions-form') as Element);
    });

    expect(onSave).not.toBeCalled();
  });

  it('should call closeDrawer when the cancel button is clicked', async () => {
    const missions = ['mission 1'];
    const onSave = jest.fn();
    const closeDrawer = jest.fn();

    const { getByText } = render(
      <EditMissionsForm
        missions={missions}
        onSave={onSave}
        closeDrawer={closeDrawer}
      />,
    );

    const cancelButton = getByText('Cancel');

    await act(async () => {
      fireEvent.click(cancelButton as Element);
    });

    expect(closeDrawer).toBeCalled();
  });
});
