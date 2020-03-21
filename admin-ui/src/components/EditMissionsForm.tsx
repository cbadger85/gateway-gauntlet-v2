import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import MissionInput from './MissionInput';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';

const editMissionsSchema = Yup.object().shape({
  missions: Yup.array()
    .required('At least one mission is required')
    .ensure(),
});

export type EditMissionsFieldSchema = Yup.InferType<typeof editMissionsSchema>;

const useStyles = makeStyles(theme => ({
  cancelButton: {
    marginRight: theme.spacing(1),
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

const EditMissionsForm: React.FC<EditMissionFormProps> = ({
  missions,
  onSave,
  closeDrawer,
}) => {
  const classes = useStyles();
  const { handleSubmit, control, errors } = useForm<EditMissionsFieldSchema>({
    mode: 'onBlur',
    validationSchema: editMissionsSchema,
    defaultValues: {
      missions,
    },
  });

  const handleSave = ({ missions }: EditMissionsFieldSchema): void => {
    onSave(missions as string[]);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleSave)}
      data-testid="edit-missions-form"
      className={classes.formContainer}
    >
      <div>
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
      <div className={classes.buttonContainer}>
        <Button
          className={classes.cancelButton}
          onClick={closeDrawer}
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

export default EditMissionsForm;

interface EditMissionFormProps {
  missions: string[];
  onSave: (missions: string[]) => void;
  closeDrawer: () => void;
}
