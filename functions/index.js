const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const nunjucks = require('nunjucks');

exports.emailBookingRequestToStaff = functions.firestore
  .document(functions.config().db.collection)
  .onCreate((snapshot, context) => {
    const newBookingRequest = snapshot.data()

    console.log(newBookingRequest)

    const type = newBookingRequest.package.type
    console.log(`Booking request is for ${type}.`)
    if (type === "multiday") {
      const template = "multiday.html"
      
    } else {
      const template = "daytour.html"
    }
    console.log(`Template to use is ${template}...`)

    const mailTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: functions.config().gmail.email,
        pass: functions.config().gmail.password
      } 
    })

    const mailSettings = {
      from: `Tom Claudio <${functions.config().gmail.email}>`,
      to: functions.config().staff.email,
      subject: `Booking request for ${newBookingRequest.package.code}`,
      text: `Booking request for ${newBookingRequest.package.code}`,
    }
    
    console.log('Service emailBookingRequestToStaff starting...');

    nunjucks.configure({ autoescape: true });

    console.log("Rendering booking information payload to template...")
    
    const payload = nunjucks.render(`./templates/${template}`, newBookingRequest);

    mailSettings.html = payload;

    console.log(`Sending booking request to ${functions.config().staff.email}...`)

    mailTransport.sendMail(mailSettings)
      .then(() => {
        console.log("Email succesfully sent");
        return true;

      })
      .catch (error => {
        console.log("Error sending mail", error)
        return null;
      }) 
  })
