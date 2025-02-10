# Training Project with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start:dev` command

## Concepts that are implemented
- Database: Postgres
- TypeORM for database connection
- Service Repository pattern is followed
- Joi schema to validate params from API calls
- JWT to authenticate user
- Bullmq for queuing mechanism (to create notifications)
- Socket.IO for socket connection (to send notification through notification channel)
- NodeMailer and Sendgrid mailer to send emails
- CronJob to send email every day at midnight
- TypeORM extension and seeders are used to populate the database with initial data
- Postman for stub creation
- Jest for test cases



