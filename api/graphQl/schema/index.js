const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type User {
  _id : ID!
  name : String!
  email : String!
  phone : String!
  token : String!
}
input AddUserInput {
  name : String!
  email : String!
  phone : String!
  password : String!
  authy_id : Int!
  otp : Int!
}

input SendOtpInput {
  email : String!
  phone : String!
}
type SendOtpRes {
  authy_id : Int
  message : String
  status : Boolean
  phone : String
}

input GetUserInput {
    email : String!
    password : String!
}

type RootQuery {
   getUser(credentials:GetUserInput) : User!
}
type RootMutation {
   addUser(eventInput:AddUserInput) : User!
   sendOtp(sendOtpInput:SendOtpInput) : SendOtpRes
}
 schema {
   query : RootQuery
   mutation : RootMutation
 }
`);
