import { AppDataSource } from '../data-source'; 
import { redisConnection } from "../config/redis-connection";

export default async () => {
  console.log('Tearing down the test environment...');

  await AppDataSource.destroy()
    .then(() => {
      console.log('Database connection closed!');
    })
    .catch((error) => {
      console.error('Error during DataSource teardown', error);
    });
    
  await redisConnection.quit()
    .then(() => {
      console.log('Redis connection closed');
    })
    .catch((error) => {
      console.error('Error during Redis connection teardown', error);
    });
  console.log('Test environment teardown completed.');
};
