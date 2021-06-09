require('dotenv').config();
const app = require('./app');
const port = process.env.PORT || 5050;

app.listen(port, () => console.info(`app listening on port ${port}`));