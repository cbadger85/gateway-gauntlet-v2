import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles(theme => ({
  marginBottom: {
    marginBottom: theme.spacing(2),
  },
  card: {
    width: '255px',
  },
  centeredCardContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginTop: -theme.spacing(8),
  },
}));

const TournamentInfoToggleCard: React.FC<TournamentInfoToggleCardProps> = ({
  centered,
  title,
  onEdit,
  children,
}) => {
  const classes = useStyles();
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = (): void => {
    setIsEditMode(isEdit => !isEdit);
  };

  return (
    <Card className={classes.card}>
      <CardHeader
        title={
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <span>{title}</span>
            {isEditMode ? (
              <IconButton onClick={toggleEditMode} size="small">
                <CancelIcon />
              </IconButton>
            ) : (
              <Button
                color="primary"
                variant="outlined"
                size="small"
                onClick={onEdit || toggleEditMode}
              >
                Edit
              </Button>
            )}
          </Box>
        }
      />
      <CardContent className={centered ? classes.centeredCardContent : ''}>
        {children(isEditMode, toggleEditMode)}
      </CardContent>
    </Card>
  );
};

export default TournamentInfoToggleCard;

interface TournamentInfoToggleCardProps {
  centered?: boolean;
  title: string;
  children: (isEditMode: boolean, toggle: () => void) => React.ReactNode;
  onEdit?: () => void;
}
