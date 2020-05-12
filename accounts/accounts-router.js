const express = require("express");

const db = require("../data/dbConfig");

const router = express.Router();

router.get("/", (req, res) => {
  // get a list of posts from the database
  // select * from posts;
  db.select("*")
    .from("accounts")
    .then((accounts) => {
      res.status(200).json({ data: accounts });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error.message });
    });
});

router.get("/:id", (req, res) => {
  db("accounts")
    .where({ id: req.params.id })
    .first() // pick the first record from the array
    .then((newAcc) => {
      if (newAcc) {
        res.status(200).json({ data: newAcc });
      } else {
        res.status(404).json({ message: "No accounts by that ID" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error.message });
    });
});

router.post("/", (req, res) => {
  const accountDetails = req.body;

  if (isValidAccount(accountDetails)) {
    db("accounts")
      // there will be a warning in the console about .returnnin(), ignore it for SQLite
      .insert(accountDetails, "id")
      .then((ids) => {
        res.status(201).json({ data: ids });
      })
      .catch((error) => {
        // save the error to a log somewhere
        console.log(error);
        res.status(500).json({ message: error.message });
      });
  } else {
    res
      .status(400)
      .json({ message: "please provide name and budget for the account" });
  }
});

router.put("/:id", (req, res) => {
  const changeAccount = req.body;

  // validate the data
  db("accounts")
    .where({ id: req.params.id })
    .update(changeAccount)
    .then((count) => {
      // the count is the number of records updated
      // if the count is 0, it means, the record was not found
      if (count > 0) {
        res.status(200).json({ data: count });
      } else {
        res.status(404).json({ message: "account not found by that Id" });
      }
    })
    .catch((error) => {
      // save the error to a log somewhere
      console.log(error);
      res.status(500).json({ message: error.message });
    });
});

router.delete("/:id", (req, res) => {
  db("accounts")
    .where({ id: req.params.id })
    .del()
    .then((counter) => {
      // the count is the number of records updated
      // if the count is 0, it means, the record was not found
      if (counter > 0) {
        res.status(200).json({ data: counter });
      } else {
        res.status(404).json({ message: "account not found by that Id" });
      }
    })
    .catch((error) => {
      // save the error to a log somewhere
      console.log(error);
      res.status(500).json({ message: error.message });
    });
});

function isValidAccount(account) {
  return Boolean(account.name && account.budget);
}

module.exports = router;
