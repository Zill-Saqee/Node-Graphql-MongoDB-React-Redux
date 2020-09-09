var express = require("express");
var app = express();
const graphqlHttp = require("express-graphql").graphqlHTTP;
require("./mongoose/db");

const graphQlSchema = require("./graphQl/schema");
const graphQlResolvers = require("./graphQl/resolvers");

var bodyParser = require("body-parser");
var cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,METHODS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(2000);
  }
  next();
});

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);
var port = 5000;

app.listen(port, function() {
  console.log("Server listening at port %d", port);
});
