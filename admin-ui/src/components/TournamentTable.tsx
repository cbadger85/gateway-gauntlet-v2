import Paper from '@material-ui/core/Paper';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { addDays, format } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';
import colors from '../colors';
import routesConfig from '../routesConfig';
import { Game } from '../types/Game';

const StyledTableCell = withStyles(theme =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
      padding: 0,
    },
  }),
)(TableCell);

const StyledTableRow = withStyles(theme =>
  createStyles({
    root: {
      '&:nth-of-type(even)': {
        backgroundColor: theme.palette.background.default,
      },
    },
  }),
)(TableRow);

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 700,
  },
  row: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: colors.blueGray[2],
    },
  },
  linkContainer: {
    padding: theme.spacing(2),
  },
  link: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
    textTransform: 'capitalize',
  },
  missionCell: {
    maxWidth: 300,
  },
}));

export const formatMissions = (missions: string[]): string =>
  missions
    .map((mission, i) => (i === missions.length - 1 ? mission : `${mission},`))
    .join(' ');

export const formatDate = (date: Date, length: number): string =>
  length === 1
    ? format(date, 'MMM do, yyyy')
    : `${format(date, 'MMM do')} - ${
        date.getMonth() === addDays(date, length - 1).getMonth()
          ? format(addDays(date, length - 1), 'do, yyyy')
          : format(addDays(date, length - 1), 'MMM do, yyyy')
      }`;

const TableCellLink: React.FC<TableCellLinkProps> = ({
  to,
  children,
  ...props
}) => {
  const classes = useStyles();

  return (
    <StyledTableCell {...props}>
      <Link to={to} className={classes.link}>
        <div className={classes.linkContainer}>{children}</div>
      </Link>
    </StyledTableCell>
  );
};

interface TableCellLinkProps extends TableCellProps {
  to: string;
}

const TournamentTable: React.FC<TournamentTableProps> = ({ tournaments }) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="left">Date</StyledTableCell>
            <StyledTableCell align="right" className={classes.missionCell}>
              Missions
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tournaments.map(tournament => (
            <StyledTableRow key={tournament.id} className={classes.row}>
              <TableCellLink
                to={
                  routesConfig({ tournamentId: tournament.id }).tournamentPage
                    .path
                }
                component="th"
                scope="row"
              >
                {tournament.name}
              </TableCellLink>
              <TableCellLink
                to={
                  routesConfig({ tournamentId: tournament.id }).tournamentPage
                    .path
                }
                component="th"
                scope="row"
              >
                {formatDate(new Date(tournament.date), tournament.length)}
              </TableCellLink>
              <TableCellLink
                to={
                  routesConfig({ tournamentId: tournament.id }).tournamentPage
                    .path
                }
                align="right"
                component="th"
                scope="row"
              >
                {formatMissions(tournament.missions)}
              </TableCellLink>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TournamentTable;

interface TournamentTableProps {
  tournaments: Game[];
}
