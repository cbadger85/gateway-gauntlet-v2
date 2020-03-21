import Drawer from '@material-ui/core/Drawer';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import EditMissionsForm from './EditMissionsForm';
import { putMissions } from '../controllers/gamesController';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { loadTournament } from '../store/tournament/tournamentSlice';
import { addSnackbar } from '../store/alert/alertSlice';

const useStyles = makeStyles(theme => ({
  bottomMargin: {
    marginBottom: theme.spacing(3),
  },
  addUserDrawer: {
    padding: theme.spacing(2, 3),
    height: 'inherit',
    width: '400px',
  },
}));

const EditMissionsDrawer: React.FC<EditMissionsDrawerProps> = ({
  isOpen,
  missions,
  closeDrawer,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { tournamentId } = useParams<{ tournamentId: string }>();

  const handleSave = async (missions: string[]): Promise<void> => {
    putMissions(tournamentId, missions)
      .then(game => {
        closeDrawer();
        dispatch(loadTournament(game));
        dispatch(addSnackbar('Date updated'));
      })
      .catch(() => {
        dispatch(addSnackbar('Failed to update date', 'error'));
      });
  };

  return (
    <Drawer open={isOpen} anchor="right">
      <div className={classes.addUserDrawer}>
        <Typography
          variant="h5"
          component="h2"
          className={classes.bottomMargin}
        >
          Add Tournament
        </Typography>
        <EditMissionsForm
          onSave={handleSave}
          missions={missions}
          closeDrawer={closeDrawer}
        />
      </div>
    </Drawer>
  );
};

export default EditMissionsDrawer;

interface EditMissionsDrawerProps {
  isOpen?: boolean;
  closeDrawer: () => void;
  missions: string[];
}
