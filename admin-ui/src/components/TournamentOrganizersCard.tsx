import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';
import AddOrganizerSelect from './AddOrganizerSelect';
import TournamentOrganizerTableRow from './TournamentOrganizerTableRow';

const TournamentOrganizersCard: React.FC = () => {
  const organizers = useSelector(
    (state: RootState) => state.tournament.organizers,
  );

  return (
    <Card>
      <CardHeader title="Organizers" />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {organizers.map(organizer => (
                <TournamentOrganizerTableRow
                  key={organizer.id}
                  organizer={organizer}
                  showDeleteButton={organizers.length > 1}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <AddOrganizerSelect addedOrganizers={organizers} />
      </CardContent>
    </Card>
  );
};

export default TournamentOrganizersCard;
