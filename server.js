/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Gia Huy Nguyen Student ID: 134821222 Date: 2/17/2024
*
*  URL: https://good-teal-hermit-crab-ring.cyclic.app/
*
********************************************************************************/

const express = require("express");
const legoData = require("./modules/legoSets");
const path = require("path");

const app = express();
const port = 3000;

// Ensure the sets array is built before starting the server
legoData.Initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error("Initialization failed:", error);
  });

// Middleware to serve static files
//app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "src")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/lego/sets", (req, res) => {
  const theme = req.query.theme;
  if (theme) {
    legoData.getSetsByTheme(theme)
      .then(foundSets => {
        res.json(foundSets);
      })
      .catch(error => {
        res.status(404).send(error);
      });
  } else {
    legoData.getAllSets()
      .then(allSets => {
        res.json(allSets);
      })
      .catch(error => {
        res.status(500).send(error);
      });
  }
});

app.get("/lego/sets/:setNum", (req, res) => {
  const setNum = req.params.setNum;
  legoData.getSetByNum(setNum)
    .then(foundSet => {
      if (foundSet) {
        res.json(foundSet);
      } else {
        res.status(404).send("Lego set not found");
      }
    })
    .catch(error => {
      res.status(404).send(error);
    });
});

app.get("/lego/sets", (req, res) => {
  const theme = req.query.theme;
  if (theme) {
    legoData.getSetsByTheme(theme)
      .then(foundSets => {
        res.json(foundSets);
      })
      .catch(error => {
        res.status(404).send(error);
      });
  } else {
    // Handle case when no theme is provided
    res.status(400).send("Theme parameter is missing");
  }
});


// Route for handling 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});
