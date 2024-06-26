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


// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Routes for adding sets
app.get("/lego/addSet", async (req, res) => {
  try {
    const themes = await legoData.getAllThemes();
    res.render("addSet", { themes: themes });
  } catch (error) {
    res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${error}` });
  }
});

app.post("/lego/addSet", async (req, res) => {
  try {
    const setData = req.body;
    await legoData.addSet(setData);
    res.redirect("/lego/sets");
  } catch (error) {
    res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${error}` });
  }
});
// Route for rendering the editSet view
app.get("/lego/editSet/:num", async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.num);
    const themes = await legoData.getAllThemes();
    res.render("editSet", { themes: themes, set: set });
  } catch (error) {
    res.status(404).render("404", { message: error });
  }
});

// Route for processing the form submission for editing a set
app.post("/lego/editSet", async (req, res) => {
  try {
    const setNum = req.body.set_num;
    const setData = req.body;
    await legoData.editSet(setNum, setData);
    res.redirect("/lego/sets");
  } catch (error) {
    res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${error}` });
  }
});


app.get("/lego/deleteSet/:num", async (req, res) => {
  try {
    const setNum = req.params.num;
    await legoData.deleteSet(setNum);
    res.redirect("/lego/sets");
  } catch (error) {
    res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${error}` });
  }
});

// Route for handling 404 errors
app.use((req, res) => {
  res.status(404).render("404", { message: "I'm sorry, we're unable to find what you're looking for" });
});
