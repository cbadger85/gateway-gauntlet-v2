import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import colors from '../colors';
import { removeOrganizer } from '../store/tournament/tournamentSlice';
import { Organizer } from '../types/Game';

const useStyles = makeStyles(theme => ({
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: colors.blueGray[2],
    },
  },
}));

const TournamentOrganizerTableRow: React.FC<TournamentOrganizerTableRowProps> = ({
  organizer,
  showDeleteButton,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { tournamentId } = useParams<{ tournamentId: string }>();

  const handleRemoveOrganizer = (): void => {
    dispatch(removeOrganizer(tournamentId, organizer.id));
  };

  return (
    <TableRow className={classes.tableRow}>
      <TableCell>{organizer.name}</TableCell>
      <TableCell>{organizer.email}</TableCell>
      <TableCell align="right">
        {showDeleteButton && (
          <IconButton size="small" onClick={handleRemoveOrganizer}>
            <DeleteIcon />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
};

export default TournamentOrganizerTableRow;

interface TournamentOrganizerTableRowProps {
  organizer: Organizer;
  showDeleteButton?: boolean;
}
