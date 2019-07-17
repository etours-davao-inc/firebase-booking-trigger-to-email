const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const nunjucks = require('nunjucks');

exports.emailBookingRequestToStaff = functions.firestore
  .document(functions.config().db.collection)
  .onCreate((snapshot, context) => {
    const newBookingRequest = snapshot.data()

    console.log(newBookingRequest)

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
      html: payload
    }
    
    console.log('Service emailBookingRequestToStaff starting...');

    nunjucks.configure({ autoescape: true });

    console.log("Rendering booking information payload to template...")

    nunjucks.render('./templates/booking.html', newBookingRequest)
      .then((payload) => {
        console.log("Render Successful...")
        mailSettings.html = payload
        return true;
      })
      .catch(error => {
        console.log("Error rendering payload")
        return null;
      })

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
