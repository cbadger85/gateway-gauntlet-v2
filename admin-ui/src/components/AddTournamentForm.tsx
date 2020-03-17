import DateFnsUtils from '@date-io/date-fns';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Alert from '@material-ui/lab/Alert';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import 'date-fns';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import MissionInput from './MissionInput';

const addTournamentSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required('Please enter a tournament name')
    .max(24, 'Tournament name must be less than 24 characters'),
  date: Yup.date().required('Date is required'),
  length: Yup.number()
    .typeError('Number of days must be a number')
    .transform((current, initial) => (!initial ? 1 : current))
    .integer('Number of days must be an integer')
    .positive('Number of days must be a positive number')
    .notRequired(),
  missions: Yup.array()
    .required('At least one mission is required')
    .ensure(),
  organizerIds: Yup.array()
    .required('At least one TO is required')
    .ensure(),
  price: Yup.number()
    .typeError('Price must be a number')
    .transform((current, initial) => (!initial ? 0 : current))
    .min(0, 'Price must be a positive number')
    .notRequired(),
});

export type AddTournamentFieldData = Yup.InferType<typeof addTournamentSchema>;

const useStyles = makeStyles(theme => ({
  cancelButton: {
    marginRight: theme.spacing(1),
  },
  badRequestAlert: {
    margin: theme.spacing(2, 0),
  },
  bottomMargin: {
    marginBottom: theme.spacing(1),
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 56px)',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
  },
}));

const AddTournamentForm: React.FC<AddTournamentFormProps> = ({
  closeForm,
  organizers,
  errorMessage,
  clearErrorMessage,
  save,
}) => {
  const classes = useStyles();
  const { register, handleSubmit, control, errors } = useForm<
    AddTournamentFieldData
  >({
    mode: 'onBlur',
    validationSchema: addTournamentSchema,
    defaultValues: {
      organizerIds: [],
      date: new Date(Date.now()),
      missions: [],
    },
  });

  const handleAddTournament = (game: AddTournamentFieldData): void => {
    const price = game.price ? game.price * 100 : 0;
    save({ ...game, price });
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleAddTournament)}
      data-testid="add-tournament-form"
      className={classes.formContainer}
    >
      <div>
        <TextField
          fullWidth
          label="Tournament Name"
          name="name"
          autoFocus
          autoComplete="off"
          required
          error={!!errors.name}
          helperText={errors.name ? errors.name.message : ''}
          data-testid="tournament-name-input"
          inputRef={register}
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Controller
            as={KeyboardDatePicker}
            fullWidth
            name="date"
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            control={control}
            id="tournament-date-picker"
            label="Tournament Date"
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            error={!!errors.date}
            helperText={errors.date ? errors.date.message : ''}
          />
        </MuiPickersUtilsProvider>
        <TextField
          className={classes.bottomMargin}
          fullWidth
          label="Length of Tournament (in days)"
          name="length"
          autoComplete="off"
          error={!!errors.length}
          helperText={errors.length ? errors.length.message : ''}
          data-testid="tournament-length-input"
          inputRef={register}
        />
        <TextField
          className={classes.bottomMargin}
          fullWidth
          label="Price of the tournament in USD"
          name="price"
          autoComplete="off"
          error={!!errors.price}
          helperText={errors.price ? errors.price.message : ''}
          data-testid="tournament-price-input"
          inputRef={register}
        />
        <FormControl required error={!!errors.organizerIds} fullWidth>
          <InputLabel id="organizer-multiselect">Organizers</InputLabel>
          <Controller
            as={Select}
            labelId="organizer-multiselect"
            name="organizerIds"
            label="Organizers"
            multiple
            control={control}
            SelectDisplayProps={{
              'data-testid': 'organizers-button',
            }}
          >
            {organizers.map(organizer => (
              <MenuItem
                key={organizer.id}
                value={organizer.id}
                data-testid={`${organizer.name}-option`}
              >
                {organizer.name}
              </MenuItem>
            ))}
          </Controller>
          <FormHelperText error={!!errors.organizerIds}>
            {errors.organizerIds ? errors.organizerIds.message : ''}
          </FormHelperText>
        </FormControl>
        <Controller
          as={MissionInput}
          name="missions"
          control={control}
          label="Missions"
          data-testid="mission-input"
          autoComplete="off"
          required
          fullWidth
          errorMessage={errors.missions ? errors.missions.message : ''}
        />
      </div>
      <Box flex="1">
        {errorMessage && (
          <Alert
            variant="outlined"
            severity="error"
            onClose={clearErrorMessage}
            className={classes.badRequestAlert}
          >
            {errorMessage}
          </Alert>
        )}
      </Box>
      <div className={classes.buttonContainer}>
        <Button
          className={classes.cancelButton}
          onClick={closeForm}
          data-testid="cancel-button"
        >
          Cancel
        </Button>
        <Button variant="outlined" color="primary" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default AddTournamentForm;

interface AddTournamentFormProps {
  save: (game: AddTournamentFieldData) => void;
  closeForm: () => void;
  organizers: { id: string; name: string }[];
  errorMessage?: string;
  clearErrorMessage: () => void;
}
