import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TournamentInfoToggleCard from '../components/TournamentInfoToggleCard';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';
import EditMissionsDrawer from './EditMissionsDrawer';

const useStyles = makeStyles(theme => ({
  listItemText: {
    margin: theme.spacing(0, 0),
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  listItemIcon: {
    minWidth: '32px',
  },
}));

const TournamentMissionCard: React.FC = () => {
  const classes = useStyles();
  const missions = useSelector((state: RootState) => state.tournament.missions);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleToggleDrawer = (): void => {
    setIsDrawerOpen(isOpen => !isOpen);
  };

  return (
    <>
      <EditMissionsDrawer
        missions={missions}
        isOpen={isDrawerOpen}
        closeDrawer={handleToggleDrawer}
      />
      <TournamentInfoToggleCard title="Missions" onEdit={handleToggleDrawer}>
        {() => (
          <List disablePadding>
            {missions.map(mission => (
              <ListItem key={mission} className={classes.listItem}>
                <ListItemIcon className={classes.listItemIcon}>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText className={classes.listItemText}>
                  {mission}
                </ListItemText>
              </ListItem>
            ))}
          </List>
        )}
      </TournamentInfoToggleCard>
    </>
  );
};

export default TournamentMissionCard;
