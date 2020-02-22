import React, { useState, useEffect, useRef } from 'react';
import { TextFieldProps } from '@material-ui/core/TextField/TextField';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import * as Yup from 'yup';
import makeStyles from '@material-ui/core/styles/makeStyles';
import InputLabel from '@material-ui/core/InputLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import colors from '../colors';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    borderRadius: '5px',
  },
  containerBorder: {
    border: `1px solid ${theme.palette.primary.main}`,
  },
  containerBorderError: {
    border: `1px solid ${theme.palette.error.dark}`,
  },
  missionsLabelContainer: {
    marginTop: -theme.spacing(2),
  },
  missionLabel: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
  missionLabelColor: {
    color: 'inherit',
  },
  missionLabelErrorColor: {
    color: theme.palette.error.dark,
  },
  placeholder: {
    fontStyle: 'italic',
    fontSize: theme.typography.body1.fontSize,
    color: theme.palette.grey[400],
  },
  missionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: theme.typography.body1.fontSize,
    '&:hover': {
      backgroundColor: colors.blueGray[2],
    },
  },
  missionInput: {
    marginTop: theme.spacing(1),
  },
  buttonContainer: {
    textAlign: 'right',
  },
  addButton: {
    marginTop: theme.spacing(4),
  },
}));

const missionSchema = Yup.string()
  .trim()
  .required('Mission name is required');

export type missionFieldData = Yup.InferType<typeof missionSchema>;

export const MissionItem: React.FC<MissionItemProps> = ({
  removeMission,
  isLast,
  mission,
}) => {
  const classes = useStyles();

  const handleRemoveMission = (): void => {
    removeMission(mission);
  };

  return (
    <div>
      <p className={classes.missionContainer}>
        <p>{mission}</p>
        <IconButton size="small" onClick={handleRemoveMission}>
          <DeleteIcon />
        </IconButton>
      </p>
      {!isLast && <Divider />}
    </div>
  );
};

interface MissionItemProps {
  mission: string;
  removeMission: (mission: string) => void;
  isLast?: boolean;
}

const MissionInput: React.FC<MissionInputProps> = ({
  onChange,
  value,
  errorMessage,
  label,
  ...props
}) => {
  const classes = useStyles();
  const [inputText, setInputText] = useState('');
  const [missionErrorMessage, setMissionErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMissionErrorMessage(errorMessage);
  }, [errorMessage]);

  const handleMissionSubmit = async (): Promise<void> => {
    missionSchema
      .validate(inputText)
      .then(() => {
        onChange([...value, inputText]);
        setInputText('');
      })
      .catch((e: Yup.ValidationError) => {
        const [error] = e.errors;
        setMissionErrorMessage(error);
      });
  };

  const handleRemoveMission = (removedMission: string): void => {
    const updatedMissions = value.filter(mission => mission !== removedMission);

    onChange(updatedMissions);
  };

  const handleEnterDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleMissionSubmit();
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ): void => {
    const isValid = missionSchema.isValidSync(e.target.value);
    isValid && setMissionErrorMessage('');
    setInputText(e.target.value);
  };

  const focusInput = (): void => {
    inputRef.current?.focus();
  };

  return (
    <div
      className={`${classes.container} ${
        errorMessage ? classes.containerBorderError : classes.containerBorder
      }`}
      onClick={focusInput}
    >
      <InputLabel className={classes.missionsLabelContainer}>
        <span
          className={`${classes.missionLabel} ${
            errorMessage
              ? classes.missionLabelErrorColor
              : classes.missionLabelColor
          }`}
        >
          Missions*
        </span>
      </InputLabel>
      <div>
        {value.length ? (
          value.map((mission, i) => (
            <MissionItem
              key={mission}
              mission={mission}
              isLast={i === value.length - 1}
              removeMission={handleRemoveMission}
            />
          ))
        ) : (
          <p className={classes.placeholder}>
            (No missions have been added yet)
          </p>
        )}
      </div>
      <TextField
        {...props}
        label="Mission Name"
        name="mission"
        error={!!missionErrorMessage}
        onChange={handleChange}
        value={inputText}
        helperText={missionErrorMessage}
        onKeyDown={handleEnterDown}
        className={classes.missionInput}
        inputRef={inputRef}
      />
      <div className={classes.buttonContainer}>
        <Button
          onClick={handleMissionSubmit}
          className={classes.addButton}
          data-testid="add-mission-button"
        >
          Add Mission
        </Button>
      </div>
    </div>
  );
};

export default MissionInput;

type MissionInputProps = TextFieldProps & {
  onChange: (missions: string[]) => void;
  value: string[];
  errorMessage: string;
};
