import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import Description from '@material-ui/icons/Description';

// https://material-ui.com/components/material-icons/
export function Tree(props) {
  const items = props.items.map((page) =>
    <ListItem button>
      <ListItemIcon>
        <Description />
      </ListItemIcon>
      <ListItemText primary={page} />
    </ListItem>
  );
  return (
    <List>
      {items}
    </List>
  );
}
