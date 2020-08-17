/**
 * Created by bolorundurowb on 06/11/2019
 */

const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const requestIp = require('request-ip');
const bodyParser = require("body-parser");

const Config = require('./config/Config');
const Logger = require('./config/Logger');
const Routes = require('./routes');
const {handleError} = require('./utils/ErrorUtil');
const CronScheduler = require('./cron/CronScheduler');

const app = express();
const router = express.Router();

app.use(morgan('dev'));
app.use(cors());
app.use(requestIp.mw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// set up cron cron
CronScheduler.startJobs();

app.use('/api/', Routes(router));
app.use((err, req, res, next) => {
  handleError(err, res);
});
app.listen(Config.port, () => Logger.log(`Server started on ${Config.port}`));

// extend the array
Array.prototype.remove = function (value) {
  if (this.indexOf(value) !== -1) {
    this.splice(this.indexOf(value), 1);
  }
};
