import React from 'react';
import { shallow, mount } from 'enzyme';
import MissionInput, { MissionItem } from '../../components/MissionInput';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import { act } from 'react-dom/test-utils';
import { fireEvent, render } from '@testing-library/react';

describe('MissionInput', () => {
  describe('<MissionInput />', () => {
    it('should change the value when typing in the input', () => {
      const onChange = jest.fn();
      const value: string[] = [];
      const errorMessage = '';
      const label = 'Missions';
      const wrapper = shallow(
        <MissionInput
          onChange={onChange}
          value={value}
          errorMessage={errorMessage}
          label={label}
        />,
      );

      const handleChange = wrapper.find(TextField).invoke('onChange');
      handleChange?.({ target: { value: 'mission 1' } } as any);

      const input = wrapper.find(TextField).props().value;

      expect(input).toBe('mission 1');
    });

    it('should add a mission when the button is clicked', async () => {
      const onChange = jest.fn();
      const value: string[] = [];
      const errorMessage = '';
      const label = 'Missions';
      const { getByTestId } = render(
        <MissionInput
          onChange={onChange}
          value={value}
          errorMessage={errorMessage}
          label={label}
          data-testid="mission-input"
        />,
      );

      const missionInput = getByTestId('mission-input').querySelector('input');
      const addMissionButton = getByTestId('add-mission-button');

      await act(async () => {
        fireEvent.change(missionInput as Element, {
          target: { value: 'mission 1' },
        });
      });

      await act(async () => {
        fireEvent.click(addMissionButton as Element);
      });

      expect(onChange).toBeCalledWith(['mission 1']);
    });

    it('should add a mission when enter is pressed', async () => {
      const onChange = jest.fn();
      const value: string[] = [];
      const errorMessage = '';
      const label = 'Missions';
      const { getByTestId } = render(
        <MissionInput
          onChange={onChange}
          value={value}
          errorMessage={errorMessage}
          label={label}
          data-testid="mission-input"
        />,
      );

      const missionInput = getByTestId('mission-input').querySelector('input');

      await act(async () => {
        fireEvent.change(missionInput as Element, {
          target: { value: 'mission 1' },
        });
      });

      await act(async () => {
        fireEvent.keyDown(missionInput as Element, { key: 'Enter' });
      });

      expect(onChange).toBeCalledWith(['mission 1']);
    });

    it('should show an error if the input is invalid', async () => {
      const onChange = jest.fn();
      const value: string[] = [];
      const errorMessage = '';
      const label = 'Missions';
      const { getByTestId, debug } = render(
        <MissionInput
          onChange={onChange}
          value={value}
          errorMessage={errorMessage}
          label={label}
          data-testid="mission-input"
        />,
      );

      const addMissionButton = getByTestId('add-mission-button');

      await act(async () => {
        fireEvent.click(addMissionButton as Element);
      });

      expect(onChange).not.toBeCalled();
    });

    it('remove a mission when the remove icon is clicked', () => {
      const onChange = jest.fn();
      const value: string[] = ['mission 1'];
      const errorMessage = '';
      const label = 'Missions';
      const wrapper = shallow(
        <MissionInput
          onChange={onChange}
          value={value}
          errorMessage={errorMessage}
          label={label}
        />,
      );

      const handleRemoveMission = wrapper
        .find(MissionItem)
        .invoke('removeMission');
      handleRemoveMission('mission 1');

      expect(onChange).toBeCalledWith([]);
    });

    it('should pass the isLast prop to the last MissionItem', () => {
      const onChange = jest.fn();
      const value: string[] = ['mission 1', 'mission 2'];
      const errorMessage = '';
      const label = 'Missions';
      const wrapper = shallow(
        <MissionInput
          onChange={onChange}
          value={value}
          errorMessage={errorMessage}
          label={label}
        />,
      );

      const { isLast } = wrapper
        .find(MissionItem)
        .last()
        .props();

      expect(isLast).toBeTruthy();
    });
  });

  describe('<MissionItem />', () => {
    it('should call removeMission if the remove icon is clicked', () => {
      const removeMission = jest.fn();
      const isLast = false;
      const mission = 'mission 1';
      const wrapper = shallow(
        <MissionItem
          removeMission={removeMission}
          isLast={isLast}
          mission={mission}
        />,
      );

      const handleClick = wrapper.find(IconButton).invoke('onClick');
      handleClick?.({} as any);

      expect(removeMission).toBeCalledWith(mission);
    });

    it('should not show the divider if it is the last element', () => {
      const removeMission = jest.fn();
      const isLast = true;
      const mission = 'mission 1';
      const wrapper = shallow(
        <MissionItem
          removeMission={removeMission}
          isLast={isLast}
          mission={mission}
        />,
      );

      const divider = wrapper.find(Divider);

      expect(divider.exists()).toBeFalsy();
    });
  });
});
