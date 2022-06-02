require('dotenv').config();
require('express-async-errors');
// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
// end extra security packages

const express = require('express');
const app = express();

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
// authentication
const authenticateUser = require('./middleware/authentication');

// connectDB
const connectDB = require('./db/connect');

// routers
  const authRouters = require('./routes/auth');
  const jobRouters = require('./routes/jobs');

app.use(express.json());
// extra packages
app.set(' trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, //limit each IP to 100 request per windowMs
}));
app.use(helmet())
app.use(cors())
app.use(xss())


// routes
app.use('/api/v1/auth', authRouters); //domian_name/api/v1/auth...
app.use('/api/v1/jobs', authenticateUser, jobRouters);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
