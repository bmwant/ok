import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Description from '@material-ui/icons/Description';
import { getPage } from '../Api';

// https://material-ui.com/components/material-icons/
export function Tree(props) {
  function handleClick(e, pageId) {
    e.preventDefault();
    props.changeSelected(pageId);
  }

  const items = props.items.map((page, i) =>
    <ListItem button key={i}>
      <ListItemIcon>
        <Description />
      </ListItemIcon>
      <ListItemText primary={page} onClick={(e) => handleClick(e, page)} />
    </ListItem>
  );
  return (
    <List>
      {items}
    </List>
  );
}
