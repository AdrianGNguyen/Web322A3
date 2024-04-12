/********************************************************************************
*  WEB322 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Gia Huy Nguyen Student ID: 134821222 Date: 2/17/2024
*
********************************************************************************/

const setData = require("../data/setData");
const themeData = require("../data/themeData");
require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  database: 'lego',
  username: 'SenecaDB_owner', 
  password: '8GVzI7MFlNfJ', 
  host: 'ep-solitary-credit-a55en1ba.us-east-2.aws.neon.tech', 
  port: 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});
const Theme = sequelize.define('Theme', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING
}, { timestamps: false });

const Set = sequelize.define('Set', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: Sequelize.STRING,
  year: Sequelize.INTEGER,
  numParts: Sequelize.INTEGER,
  themeId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Themes',
      key: 'id'
    }
  },
  url: Sequelize.STRING
}, { timestamps: false });

Set.belongsTo(Theme, {foreignKey: 'themeId'});
Theme.hasMany(Set, {foreignKey: 'themeId'});

function Initialize() {
  return sequelize.sync().then(() => {
    console.log("Database and tables have been synced.");

    return Theme.count().then(themesCount => {
      if (themesCount === 0) {
        return Theme.bulkCreate(themeData).then(() => {
          console.log("Themes initialized in database.");
        });
      }
    }).then(() => {
      return Set.count().then(setsCount => {
        if (setsCount === 0) {
          const validSetData = setData.map(set => {
            const yearInt = parseInt(set.year, 10);
            if (isNaN(yearInt)) {
              return null;
            }
            return { ...set, year: yearInt };
          }).filter(set => set !== null && themeData.some(theme => theme.id === set.themeId));

          return Set.bulkCreate(validSetData).then(() => {
            console.log("Sets initialized in database.");
          });
        }
      });
    });
  }).catch(error => {
    console.error("An error occurred while syncing the database:", error);
    throw error;
  });
}

function getAllSets() {
  return Set.findAll({
    include: [{ model: Theme }]
  }).then(sets => {
    if (!sets.length) throw new Error("No sets available");
    return sets;
  }).catch(error => {
    throw error;
  });
}

function getSetByNum(setNum) {
  return Set.findOne({
    where: { id: setNum },
    include: [{ model: Theme }]
  }).then(set => {
    if (!set) throw new Error("Unable to find requested set");
    return set;
  }).catch(error => {
    throw error;
  });
}

function getSetsByTheme(theme) {
  return Set.findAll({
    include: [{
      model: Theme,
      where: {
        name: {
          [Sequelize.Op.iLike]: `%${theme}%`
        }
      }
    }]
  }).then(sets => {
    if (!sets.length) throw new Error("Unable to find requested sets");
    return sets;
  }).catch(error => {
    throw error;
  });
}

function getAllThemes() {
  return Theme.findAll().then(themes => {
    if (!themes.length) throw new Error("No themes available");
    return themes;
  }).catch(error => {
    throw error;
  });
}
function editSet(setNum, setData) {
  return Set.update(setData, {
    where: {
      id: setNum
    }
  }).then(() => {
    console.log("Set updated successfully");
  }).catch(error => {
    console.error("Error updating set:", error);
    throw error;
  });
}
function deleteSet(setNum) {
  return Set.destroy({ where: { id: setNum } })
    .then(() => {
      console.log(`Set ${setNum} deleted successfully.`);
    })
    .catch(error => {
      throw error;
    });
}
module.exports = {
  Initialize,
  getAllSets,
  getSetByNum,
  getSetsByTheme,
  getAllThemes,
  editSet,
  deleteSet
};