import React from 'react';
import { mount } from 'enzyme';
import TournamentInfoToggleCard from '../../components/TournamentInfoToggleCard';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

const Dummy: React.FC<{ onToggle: () => void; isEditMode: boolean }> = ({
  onToggle,
  isEditMode,
}) => {
  if (isEditMode) {
    return null;
  }

  return <button onClick={onToggle} id="test" />;
};

describe('<TournamentInfoToggleCard', () => {
  it('should hide the dummy component if the button is toggled', () => {
    const wrapper = mount(
      <TournamentInfoToggleCard title="title">
        {(isEditMode, toggle) => (
          <Dummy isEditMode={isEditMode} onToggle={toggle} />
        )}
      </TournamentInfoToggleCard>,
    );

    wrapper.find(Button).invoke('onClick')?.({} as any);

    const testButton = wrapper.find('#test');

    expect(testButton.exists()).toBeFalsy();

    wrapper.unmount();
  });

  it('should replace the edit button with a close button if toggleEditMode is called', () => {
    const wrapper = mount(
      <TournamentInfoToggleCard title="title" centered>
        {(isEditMode, toggle) => (
          <Dummy isEditMode={isEditMode} onToggle={toggle} />
        )}
      </TournamentInfoToggleCard>,
    );

    wrapper.find('#test').simulate('click');
    const editButton = wrapper.find(Button);
    const dummy = wrapper.find('#test');

    const iconButton = wrapper.find(IconButton);

    expect(iconButton.exists()).toBeTruthy();
    expect(editButton.exists()).toBeFalsy();
    expect(dummy.exists()).toBeFalsy();

    wrapper.unmount();
  });

  it('should call onEdit when the edit button is clicked if onEdit is provided', () => {
    const onEdit = jest.fn();

    const wrapper = mount(
      <TournamentInfoToggleCard title="title" centered onEdit={onEdit}>
        {(isEditMode, toggle) => (
          <Dummy isEditMode={isEditMode} onToggle={toggle} />
        )}
      </TournamentInfoToggleCard>,
    );

    wrapper.find(Button).invoke('onClick')?.({} as any);
    const editButton = wrapper.find(Button);
    const dummy = wrapper.find('#test');

    expect(onEdit).toBeCalled();
    expect(editButton.exists()).toBeTruthy();
    expect(dummy.exists()).toBeTruthy();

    wrapper.unmount();
  });
});
