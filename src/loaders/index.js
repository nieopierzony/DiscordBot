'use strict';

const fs = require('node:fs');

module.exports = (client) => {
  try {
    const filesInDir = fs.readdirSync(__dirname).filter((el) => !isNaN(+el[0]));
    for (const fileName of filesInDir) require(`./${fileName}`)(client);
  } catch (err) {
    console.log(err);
  }
};
