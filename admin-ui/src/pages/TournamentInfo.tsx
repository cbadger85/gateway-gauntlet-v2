import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';
import ToggleRegistrationCard from '../components/ToggleRegistrationCard';
import TournamentDateCard from '../components/TournamentDateCard';
import TournamentMissionCard from '../components/TournamentMissionCard';
import TournamentOrganizersCard from '../components/TournamentOrganizersCard';
import TournamentPriceCard from '../components/TournamentPriceCard';
const useStyles = makeStyles(theme => ({
  marginBottom: {
    marginBottom: theme.spacing(2),
  },
}));

const TournamentInfo: React.FC = () => {
  const classes = useStyles();

  return (
    <div>
      <Box className={classes.marginBottom}>
        <ToggleRegistrationCard />
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="stretch"
        minHeight="255px"
        className={classes.marginBottom}
      >
        <TournamentPriceCard />
        <TournamentDateCard />
        <TournamentMissionCard />
      </Box>
      <TournamentOrganizersCard />
    </div>
  );
};

export default TournamentInfo;
