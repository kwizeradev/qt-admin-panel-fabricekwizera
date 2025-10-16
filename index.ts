import concurrently from 'concurrently';

concurrently([
  {
    name: 'backend',
    command: 'npm run dev',
    cwd: 'backend',
    prefixColor: 'blue',
  },
  {
    name: 'frontend',
    command: 'npm run dev',
    cwd: 'frontend',
    prefixColor: 'green',
  },
]);