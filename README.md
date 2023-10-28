
# Mailing App

Nest js backedup mailing service that lets user send emails transparently in optimized manner in no time.


## Prerequisites
Please make sure you have all these installed on your system before running application.
- **NodeJs**: NodeJs version 16.15.1 or greater.
- **Redis**: Redis Caching Database.
- **Postgres**: Postgres Database Server.
- **.env**: Check .env.example from root folder and setup your .env file accordingly.



## Install Dependencies
To install the dependencies of the application copy and paste the following command in your terminal:
```javascript
npm install
```
This command will install all the required dependencies of your appliaction.
## Running the app
For running the application copy and paste the following command in terminal: 

```javascript
npm run start:dev
```
Once the server is up , you can check it by hitting api end points given below at the end.
## Testing
Testing structure has been setup using nest built in testing module with jest and supertest .
To run and get test results copy and paste following command in your terminal:

```javascript
npm run test
```
## App Architecture

Application architecture contains 4 main components :

- **NestJs Server**: For serving apis to user nest js server has been setup with apis for sending email and to get list of emails.

- **Redis Cache Db**: Redis has been ustilised to process the email sending as it holds the queue that is responsible for taking email job as input and to process that job one at a time.

- **Bull Module**: Bull module has been utilised to process the email sending as an asynchronous task in background apart from request response cycle of user to make sure user got no delay in response to the request. It pushes each email request into the queue which lies in redis from where it goes to the queue processor and email sending is done.

- **Postgres Database**: Postgres database is utlised to store the email requests coming from users along with their statuses accordingly. Request is stored in db during processing and once email is sent to given email the status of request in db gets updated in db.
## API Reference

#### Send Email

```http
  POST /api/mailer/send_mail
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Name of user |
| `email` | `string` | **Required**. Valid email of user |

#### Get Email Requests List

```http
  GET /api/mailer/mail_requests
```


