import React from 'react';
import { mount } from 'enzyme';
import TournamentInfoToggleCard from '../../components/TournamentInfoToggleCard';
import Button from '@material-ui/core/Button';

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

  it('should hide the edit button if toggleEditMode is called', () => {
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

    expect(editButton.exists()).toBeFalsy();
    expect(dummy.exists()).toBeFalsy();

    wrapper.unmount();
  });
});
