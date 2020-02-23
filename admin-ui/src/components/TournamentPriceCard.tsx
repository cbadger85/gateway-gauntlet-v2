import React from 'react';
import TournamentInfoToggleCard from '../components/TournamentInfoToggleCard';
import Typography from '@material-ui/core/Typography';
import { RootState } from '../store/rootReducer';
import { useSelector } from 'react-redux';

const TournamentPriceCard: React.FC = () => {
  const price = useSelector((state: RootState) => state.tournament.price);
  return (
    <TournamentInfoToggleCard title="Price" centered>
      {() => (
        <Typography component="span" variant="h3">
          {(price / 100).toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
          })}
        </Typography>
      )}
    </TournamentInfoToggleCard>
  );
};

export default TournamentPriceCard;
