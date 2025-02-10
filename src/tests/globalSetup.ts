import { AppDataSource } from '../data-source';

export default async () => {
  console.log('Setting up the test environment...');
  
  await AppDataSource.initialize()
    .then(() => {
      console.log('Database connected successfully!');
    })
    .catch((error) => {
      console.error('Error during DataSource initialization', error);
      process.exit(1); // Exit with error if database connection fails
    });

  console.log('Test environment setup completed.');
};
