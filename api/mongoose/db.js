const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://zillsaqee:zillsaqee@profiles.ll4yy.mongodb.net/RomanProject?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      // useFindAndModify:false,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log("database connected"))
  .catch(err => console.log(err));
