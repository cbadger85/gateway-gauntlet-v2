import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';
import { Link } from 'react-router-dom';
import colors from '../colors';

const useStyles = makeStyles(theme => ({
  navLinkContainer: {
    position: 'relative',
  },
  navLinkMarginRight: {
    marginRight: theme.spacing(6),
  },
  navLinkMarginBotton: {
    marginBottom: theme.spacing(6),
  },
  activeNavLink: {
    backgroundColor: colors.pink[5],
    height: '5px',
    position: 'absolute',
    bottom: -8,
    width: '100%',
  },
}));

const NavLink: React.FC<{
  isActive?: boolean;
  to: string;
  horizontal?: boolean;
}> = ({ to, isActive, horizontal, children }) => {
  const classes = useStyles();

  return (
    <div
      className={`${classes.navLinkContainer} ${
        horizontal ? classes.navLinkMarginRight : classes.navLinkMarginBotton
      }`}
    >
      <Button component={Link} to={to}>
        {children}
      </Button>
      {isActive && (
        <div className={classes.activeNavLink} data-testid="active-indicator" />
      )}
    </div>
  );
};

export default NavLink;
