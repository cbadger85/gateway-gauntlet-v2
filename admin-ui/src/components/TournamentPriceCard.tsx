import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useSelector } from 'react-redux';
import TournamentInfoToggleCard from '../components/TournamentInfoToggleCard';
import { RootState } from '../store/rootReducer';
import TournamentPriceCardEditMode from './TournamentPriceCardEditMode';

const TournamentPriceCard: React.FC = () => {
  const price = useSelector((state: RootState) => state.tournament.price);

  return (
    <TournamentInfoToggleCard title="Price" centered>
      {(isEditMode, toggleEditMode) =>
        isEditMode ? (
          <TournamentPriceCardEditMode
            price={price / 100}
            toggleEditMode={toggleEditMode}
          />
        ) : (
          <Typography component="span" variant="h3">
            {(price / 100).toLocaleString(undefined, {
              style: 'currency',
              currency: 'USD',
            })}
          </Typography>
        )
      }
    </TournamentInfoToggleCard>
  );
};

export default TournamentPriceCard;
