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

app.set('view engine', 'ejs');

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
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.render("home", { page: '/' });
});

app.get("/about", (req, res) => {
  res.render("about", { page: '/about' });
});

app.get("/lego/sets", (req, res) => {
  const theme = req.query.theme;
  if (theme) {
    legoData.getSetsByTheme(theme)
      .then(foundSets => {
        // Render the "sets.ejs" view with the Lego sets data
        res.render("sets", { sets: foundSets, page: '/lego/sets' });
      })
      .catch(error => {
        res.status(404).send(error);
      });
  } else {
    legoData.getAllSets()
      .then(allSets => {
        // Render the "sets.ejs" view with all Lego sets data
        res.render("sets", { sets: allSets, page: '/lego/sets' });
      })
      .catch(error => {
        res.status(500).send(error);
      });
  }
});

app.get("/lego/sets/:setNum", async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.setNum);
    if (set) {
      res.render("set", { set: set, page: '' });
    } else {
      res.status(404).render("404", { message: "Set not found" });
    }
  } catch (error) {
    res.status(404).render("404", { message: error });
  }
});

// Route for handling 404 errors
app.use((req, res) => {
  res.status(404).render("404", { message: "I'm sorry, we're unable to find what you're looking for" });
});
