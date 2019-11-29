/**
 * Created by bolorundurowb on 06/11/2019
 */

const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require("body-parser");

const Config = require('./config/Config');
const Logger = require('./config/Logger');
const Routes = require('./routes');
const { handleError } = require('./utils/ErrorUtil');

const app = express();
const router = express.Router();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/api/', Routes(router));
app.use((err, req, res, next) => {
  handleError(err, res);
});
app.listen(Config.port, () => Logger.log(`Server started on ${Config.port}`));
