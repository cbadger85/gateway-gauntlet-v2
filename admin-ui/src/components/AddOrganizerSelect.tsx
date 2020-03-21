import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrganizerList } from '../store/organizer/organizerSlice';
import { RootState } from '../store/rootReducer';
import { Organizer } from '../types/Game';
import { useParams } from 'react-router-dom';
import { addOrganizer } from '../store/tournament/tournamentSlice';

const useStyles = makeStyles(theme => ({
  marginTop: {
    marginTop: theme.spacing(2),
  },
}));

const AddOrganizerSelect: React.FC<AddOrganizerSelectProps> = ({
  addedOrganizers,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const organizers = useSelector((state: RootState) => state.organizers);

  const { tournamentId } = useParams<{ tournamentId: string }>();

  const organizerOptions = organizers.filter(
    organizer =>
      !addedOrganizers.find(
        addedOrganizer => addedOrganizer.id === organizer.id,
      ),
  );

  useEffect(() => {
    if (!organizers.length) {
      dispatch(getOrganizerList());
    }
  }, [dispatch, organizers]);

  const handleAddOrganizer = (
    e: React.ChangeEvent<{ value: unknown }>,
  ): void => {
    dispatch(addOrganizer(tournamentId, e.target.value as string));
  };

  if (!organizerOptions.length) {
    return null;
  }

  return (
    <FormControl fullWidth className={classes.marginTop}>
      <InputLabel id="add-organizer-select">Add Organizer</InputLabel>
      <Select
        labelId="add-organizer-select"
        onChange={handleAddOrganizer}
        value=""
      >
        {organizerOptions.map(organizer => (
          <MenuItem key={organizer.id} value={organizer.id}>
            {organizer.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AddOrganizerSelect;

interface AddOrganizerSelectProps {
  addedOrganizers: Organizer[];
}
