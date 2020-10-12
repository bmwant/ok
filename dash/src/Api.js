import React from 'react';

export async function getIndex() {
  return '## Index page';
}

export async function getPages() {
  return [
    'One',
    'Two',
    'Three'
  ]
}
