const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const firebase = require("./firebase.js");
require("dotenv").config();

const app = express();
app.use(express.static("public"));
app.use(express.json());
const buffer = crypto.randomBytes(32);
const secret_key = buffer.toString("hex");

app.use(
  session({
    secret: secret_key,
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  if (req.session && req.session.username) {
    req.session.destroy((error) => {
      if (error) {
        console.log("Error destroying session: " + error);
      }
    });
  }
  res.sendFile(__dirname + "/templates/login.html");
});

app.get("/home", (req, res) => {
  if (req.session.username != undefined) {
    res.sendFile(__dirname + "/templates/home.html");
  } else {
    res.redirect("/");
  }
});

app.post("/signup", (req, res) => {
  let response_sent = false;
  const { username, password } = req.body;
  const user_path = "users/";
  const user_ref = firebase.ref(firebase.db, user_path);

  firebase.onValue(
    user_ref,
    (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const db_username = childSnapshot.val().username;
        if (username == db_username) {
          if (!response_sent) {
            res.status(200).json(false);
            response_sent = true;
            return;
          }
        }
      });
      if (!response_sent) {
        new_entry = firebase.push(user_ref, {
          username: username,
          password: password,
        });
        req.session.key = new_entry.key;
        req.session.username = username;
        res.status(200).json(true);
        response_sent = true;
        return;
      }
    },
    {
      onlyOnce: true,
    }
  );
});

app.post("/login", (req, res) => {
  let response_sent = false;
  const { username, password } = req.body;
  const user_path = "users/";
  const user_ref = firebase.ref(firebase.db, user_path);

  firebase.onValue(
    user_ref,
    (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const db_username = childSnapshot.val().username;
        const db_password = childSnapshot.val().password;
        if (username === db_username && password === db_password) {
          if (!response_sent) {
            req.session.username = username;
            user_key = childSnapshot.key;
            req.session.key = user_key;
            res.status(200).json(true);
            response_sent = true;
            return;
          }
        }
      });
      if (!response_sent) {
        res.status(200).json(false);
        response_sent = true;
        return;
      }
    },
    {
      onlyOnce: true,
    }
  );
});

app.post("/remove", (req, res) => {
  let response_sent = false;
  let { college_query } = req.body;
  const user_key = req.session.key;
  const college_path = `users/${user_key}/colleges`;
  const college_ref = firebase.ref(firebase.db, college_path);

  firebase.onValue(
    college_ref,
    (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        db_college_name = childSnapshot.val().name;
        if (college_query.toLowerCase() === db_college_name.toLowerCase()) {
          const college_key = childSnapshot.key;
          const remove_path = `users/${req.session.key}/colleges/${college_key}`;
          const remove_ref = firebase.ref(firebase.db, remove_path);
          firebase.remove(remove_ref);
          if (!response_sent) {
            res.status(200).json(true);
            response_sent = true;
            return;
          }
        }
      });
      if (!response_sent) {
        res.status(200).json(false);
        response_sent = true;
        return;
      }
    },
    {
      onlyOnce: true,
    }
  );
});

app.post("/search", (req, res) => {
  let response_sent = false;
  const { college_query } = req.body;
  const college_query_encoded = encodeURIComponent(college_query);
  const api_key = process.env.SCORECARD_API_KEY;
  const api_url = `https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=${api_key}&school.name=${college_query_encoded}`;

  fetch(api_url)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((result) => {
        const api_college_name = result.latest.school.name.toLowerCase();
        if (api_college_name == college_query) {
          if (!response_sent) {
            const user_key = req.session.key;
            const college_path = `users/${user_key}/colleges`;
            const college_ref = firebase.ref(firebase.db, college_path);

            firebase.onValue(
              college_ref,
              (snapshot) => {
                let push_college_to_db = true;
                snapshot.forEach((childSnapshot) => {
                  const db_college_name = childSnapshot.val().name;
                  if (db_college_name.toLowerCase() === api_college_name) {
                    push_college_to_db = false;
                  }
                });

                if (push_college_to_db) {
                  const college_name = result.latest.school.name;
                  firebase.push(college_ref, {
                    name: college_name,
                  });
                }
              },
              {
                onlyOnce: true,
              }
            );
            if (!response_sent) {
              res.status(200).json(true);
              response_sent = true;
              return;
            }
          }
        }
      });
      if (!response_sent) {
        res.status(200).json(false);
        response_sent = true;
        return;
      }
    });
});

app.post("/data", (req, res) => {
  let response_sent = false;
  const { type } = req.body;
  const user_key = req.session.key;
  const college_path = `users/${user_key}/colleges`;
  const college_ref = firebase.ref(firebase.db, college_path);

  firebase.onValue(
    college_ref,
    (snapshot) => {
      const x = [];
      const y = [];
      snapshot.forEach((childSnapshot) => {
        db_college_name = childSnapshot.val().name;
        x.push(db_college_name);
      });

      fetch_data = async () => {
        for (const db_college_name of x) {
          const db_college_name_encoded = encodeURIComponent(db_college_name);
          const api_key = "pt9njTl5QPkpPjxHUaWacN6n48ZtmmibNyyJgTfg";
          const api_url = `https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=${api_key}&school.name=${db_college_name_encoded}`;
          const response = await fetch(api_url);
          const data = await response.json();

          data.results.forEach((result) => {
            const api_college_name = result.latest.school.name;
            if (api_college_name === db_college_name) {
              switch (type) {
                case "sat":
                  const sat_scores = result.latest.admissions.sat_scores.average.overall;
                  if (sat_scores === null) {
                    y.push(400);
                  } else {
                    y.push(sat_scores);
                  }
                  break;
                case "act":
                  const act_scores = result.latest.admissions.act_scores.midpoint.cumulative;
                  if (act_scores === null) {
                    y.push(0);
                  } else {
                    y.push(act_scores);
                  }
                  break;
                case "admission":
                  const admission_rate = result.latest.admissions.admission_rate.overall;
                  if (admission_rate === null) {
                    y.push(0);
                  } else {
                    y.push(admission_rate * 100);
                  }
                  break;
                case "graduation":
                  const graduation_rate = result.latest.completion.consumer_rate;
                  if (graduation_rate === null) {
                    y.push(0);
                  } else {
                    y.push(graduation_rate * 100);
                  }
                  break;
                case "debt":
                  const average_debt = result.latest.aid.median_debt.completers.overall;
                  if (average_debt === null) {
                    y.push(0);
                  } else {
                    y.push(average_debt);
                  }
                  break;
                case "tuition-in-state":
                  const in_state_cost = result.latest.cost.tuition.in_state;
                  if (in_state_cost === null) {
                    y.push(0);
                  } else {
                    y.push(in_state_cost);
                  }
                  break;
                case "tuition-out-state":
                  const out_of_state_cost = result.latest.cost.tuition.out_of_state;
                  if (out_of_state_cost === null) {
                    y.push(0);
                  } else {
                    y.push(out_of_state_cost);
                  }
                  break;
                case "earnings":
                  const average_earnings = result.latest.earnings["10_yrs_after_entry"].median;
                  if (average_earnings === null) {
                    y.push(0);
                  } else {
                    y.push(average_earnings);
                  }
                  break;
                case "population":
                  const population = result.latest.student.size;
                  if (population === null) {
                    y.push(0);
                  } else {
                    y.push(population);
                  }
                  break;
                default:
                  break;
              }
            }
          });
        }
      };

      fetch_data().then(() => {
        if (!response_sent) {
          switch (type) {
            case "sat":
              y.push(400, 1600);
              break;
            case "act":
              y.push(0, 36);
              break;
            case "admission":
              y.push(0, 100);
              break;
            case "graduation":
              y.push(0, 100);
              break;
            case "debt":
              y.push(0);
              break;
            case "tuition-in-state":
              y.push(0);
              break;
            case "tuition-out-state":
              y.push(0);
              break;
            case "earnings":
              y.push(0);
              break;
            case "population":
              y.push(0);
              break;
            default:
              break;
          }
          res.status(200).json({
            x: x,
            y: y,
          });
          response_sent = true;
        }
      });
    },
    {
      onlyOnce: true,
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
