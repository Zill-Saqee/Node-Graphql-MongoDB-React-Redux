var authy = require("authy")("bMjyyNFKYMsOyjEQY5J9NUe8KC6S039f");
const Profiles = require("../../models/profiles");




let handleSendOtp = ({ email, phoneNo, countryCode }) => {
  return new Promise(function(resolve, reject) {
    try {
      authy.register_user(email, phoneNo, countryCode, async function(
        err,
        resp
      ) {
        if (!err) {
          let authy_id = resp.user.id;
          let res = await authy.request_sms(authy_id, function(smsErr, smsRes) {
            if (!smsErr) {
              let sendOtpResponse = {
                authy_id: authy_id,
                message: smsRes.message,
                status: smsRes.success,
                phone: smsRes.cellphone
              };

              resolve(sendOtpResponse);
            } else {
              console.log(smsErr);
              reject(smsErr);
            }
          });
        } else {
          console.log(err);
          reject(err);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

let handleAddUser = ({ name, email, password, otp, phone, authy_id }) => {
  return new Promise((resolve, reject) => {
    authy.verify(authy_id, (token = otp), async function(err, authRes) {
      if (err) {
        console.log("Error =======", err);
        reject(err);
      } else {
        try {
          let profile = await new Profiles({ name, email, password, phone }); // It returns new record according to data provided even without db connection?
          profile
            .save()
            .then(async res => {
              let { name, email, phone, _id } = res._doc;
              let user = { name, email, phone, _id };
              const token = await profile.generateAuthToken();
              user.token = token;
              console.log(user);
              resolve(user);
            })
            .catch(err => {
              reject(err);
            });
        } catch (error) {
          console.log(error);
          reject(error);
        }
      }
    });
  });
};

module.exports = {
  getUser: async ({ credentials: { email, password } }) => {
    try {
      const profile = await Profiles.findByCredentials(email, password);
      console.log("Profile ==", profile);
      const token = await profile.generateAuthToken();
      const publicData = await profile.sendPublicDataOnly();
      console.log(publicData);
      return { ...publicData, token };
    } catch (error) {
      throw error;
    }
  },
  sendOtp: ({ sendOtpInput: { email, phone } }) => {
    let countryCode = phone.substring(0, 2);
    let phoneNo = phone.substring(2, phone.length);
    return handleSendOtp({ email, phoneNo, countryCode })
      .then(res => res)
      .catch(err => {
        throw err;
      });
  },
  addUser: ({ eventInput }) => {
    return handleAddUser(eventInput)
      .then(res => res)
      .catch(err => {
        throw err;
      });
  }
};
