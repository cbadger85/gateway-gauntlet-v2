import DateFnsUtils from '@date-io/date-fns';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { putDate } from '../controllers/gamesController';
import { addSnackbar } from '../store/alert/alertSlice';
import { loadTournament } from '../store/tournament/tournamentSlice';

const editDateSchema = Yup.object().shape({
  date: Yup.date().required('Date is required'),
  length: Yup.number()
    .typeError('Number of days must be a number')
    .transform((current, initial) => (!initial ? 1 : current))
    .integer('Number of days must be an integer')
    .positive('Number of days must be a positive number')
    .notRequired(),
});

const useStyles = makeStyles(theme => ({
  form: {
    width: '223px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  topMargin: {
    marginTop: theme.spacing(1),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
  },
}));

export type EditDateFieldData = Yup.InferType<typeof editDateSchema>;

const TournamentDateCardEditMode: React.FC<TournamentDateCardEditModeProps> = ({
  toggleEditMode,
  date,
  length,
}) => {
  const classes = useStyles();
  const { register, handleSubmit, control, errors } = useForm<
    EditDateFieldData
  >({
    mode: 'onBlur',
    validationSchema: editDateSchema,
    defaultValues: {
      date: new Date(date),
      length,
    },
  });

  const dispatch = useDispatch();
  const { tournamentId } = useParams<{ tournamentId: string }>();

  const handleSave = async ({
    date,
    length,
  }: EditDateFieldData): Promise<void> => {
    putDate(tournamentId, date, length)
      .then(game => {
        toggleEditMode();
        dispatch(loadTournament(game));
        dispatch(addSnackbar('Date updated'));
      })
      .catch(() => {
        dispatch(addSnackbar('Failed to update date', 'error'));
      });
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleSave)}
      data-testid="edit-date-form"
      className={classes.form}
    >
      <div className={classes.inputContainer}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Controller
            as={KeyboardDatePicker}
            autoFocus
            fullWidth
            name="date"
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            control={control}
            id="update-date-picker"
            label="Tournament Date"
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            error={!!errors.date}
            helperText={errors.date ? errors.date.message : ''}
          />
          <TextField
            className={classes.topMargin}
            fullWidth
            label="Length (in days)"
            name="length"
            autoComplete="off"
            error={!!errors.length}
            helperText={errors.length ? errors.length.message : ''}
            data-testid="update-length-input"
            inputRef={register}
          />
        </MuiPickersUtilsProvider>
      </div>

      <div className={classes.buttonContainer}>
        <Button
          variant="outlined"
          color="primary"
          type="submit"
          data-testid="save-button"
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default TournamentDateCardEditMode;

interface TournamentDateCardEditModeProps {
  toggleEditMode: () => void;
  date: string;
  length: number;
}
