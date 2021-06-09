//imports
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');

const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

const yup = require('yup');
const middlewares = require('./middlewares');
const gs = require('./utlis/googleSheetUtil');

const app = express();


//Static Files
app.use(express.static('public'));
app.use('/js', express.static(__dirname + 'public/js'));

//Set template engine
app.use(expressLayouts);
app.set('layout', '../views/layouts/app.ejs');
app.set("view engine", "ejs");

app.use(morgan('tiny'));
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(cors());



//form validations
const schema = yup.object().shape({
  firstName: yup.string().trim().min(3).required(),
  lastName: yup.string().trim().min(3).required(),
  email: yup.string().trim().email().required(),
  phoneNumber: yup
    .string()
    .trim()
    .min(8)
    .matches(/[0-9_-]/, 'invalid number ... please insert valid phone number')
    .required(),
  company: yup.string().trim().min(3).required(),
  position: yup.string().trim().min(3).required(),
  username: yup.string().trim().min(3).required(),
});

//Routes
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home page'
  });
});

app.post('/', async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      company,
      position,
      username
    } = req.body;

    const insertUser = {
      firstName,
      lastName,
      email,
      phoneNumber,
      company,
      position,
      username
    };
    await schema.validate(insertUser, {
      abortEarly: false
    });
    
    const record = [[firstName, lastName, email, phoneNumber, company, position, username]];
    const insertStatus = await gs.addNewRecord(record);
    
    if(insertStatus === 'OK') {
      res.json({
        message: 'successfully inserted !'
      });
    } else {
      const error = new Error('something wrong happened');
      res.status(422);
      throw error;
    } 
  } catch (error) {
    next(error);
  }
});


//middleware
app.use(middlewares.errorHandler);

module.exports = app;