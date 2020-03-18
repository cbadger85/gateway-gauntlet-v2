import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { putPrice } from '../controllers/gamesController';
import { addSnackbar } from '../store/alert/alertSlice';
import { loadTournament } from '../store/tournament/tournamentSlice';

const useStyles = makeStyles(theme => ({
  form: {
    width: '223px',
  },
  cancelButton: {
    marginRight: theme.spacing(1),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
  },
}));

const priceSchema = Yup.object().shape({
  price: Yup.number()
    .typeError('Price must be a number')
    .transform((current, initial) => (!initial ? 0 : current))
    .min(0, 'Price must be a positive number'),
});

export type UpdatePriceData = Yup.InferType<typeof priceSchema>;

const TournamentPriceCardEditMode: React.FC<TournamentPriceCardEditModeProps> = ({
  price,
  toggleEditMode,
}) => {
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm<UpdatePriceData>({
    mode: 'onBlur',
    validationSchema: priceSchema,
    defaultValues: {
      price,
    },
  });

  const dispatch = useDispatch();
  const { tournamentId } = useParams<{ tournamentId: string }>();

  const handleSave = async ({ price }: UpdatePriceData): Promise<void> => {
    putPrice(tournamentId, price * 100)
      .then(game => {
        toggleEditMode();
        dispatch(loadTournament(game));
        dispatch(addSnackbar('Price updated'));
      })
      .catch(() => {
        dispatch(addSnackbar('Failed to update price', 'error'));
      });
  };

  return (
    <form
      data-testid="price-card-edit-mode"
      onSubmit={handleSubmit(handleSave)}
      className={classes.form}
    >
      <div>
        <TextField
          fullWidth
          label="Price in USD"
          name="price"
          autoComplete="off"
          error={!!errors.price}
          helperText={errors.price ? errors.price.message : ''}
          data-testid="tournament-price-input"
          inputRef={register}
        />
      </div>
      <div className={classes.buttonContainer}>
        <Button
          className={classes.cancelButton}
          onClick={toggleEditMode}
          data-testid="cancel-button"
        >
          Cancel
        </Button>
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

export default TournamentPriceCardEditMode;

interface TournamentPriceCardEditModeProps {
  price?: number;
  toggleEditMode: () => void;
}
