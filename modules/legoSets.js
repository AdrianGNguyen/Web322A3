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

let sets = [];

function Initialize() {
  return new Promise((resolve, reject) => {
    sets = [];

    setData.forEach(set => {
      const themeMatch = themeData.find(theme => theme.id === set.themeId);
      if (themeMatch) {
        const newSet = {
          themeId: set.themeId,
          partNum: set.partNum,
          year: set.year,
          id: set.id,
          name: set.name,
          url: set.url,
          themeName: themeMatch.name
        };
        sets.push(newSet);
      }
    });

    if (sets.length > 0) {
      resolve("Resolved");
    } else {
      reject("Initialization failed");
    }
  });
}

function getAllSets() {
  return new Promise((resolve, reject) => {
  
    if (sets.length > 0) {
      resolve(sets);
    } else {
      reject("No sets available");
    }
  });
}

function getSetByNum(setNum) {
  return new Promise((resolve, reject) => {
    const foundSet = sets.find(set => set.id === setNum);
    if (foundSet) {
      resolve(foundSet);
    } else {
      reject("Unable to find id");
    }
  });
}

function getSetsByTheme(theme) {
  return new Promise((resolve, reject) => {
    const searchTheme = theme.toLowerCase();
    const foundSets = sets.filter(set => set.themeName.toLowerCase().includes(searchTheme));

    if (foundSets) {
      resolve(foundSets);
    } else {
      reject("Unable to find theme");
    }
  });
}

module.exports = {
  Initialize,
  getAllSets,
  getSetByNum,
  getSetsByTheme
};

//Initialize();
//getAllSets();

  