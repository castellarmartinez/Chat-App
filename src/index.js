const express = require('express');
const path = require('path');

const app = express();
const port = 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

app.listen(port, () => {
   console.log(`App listening on port ${port}`);
});