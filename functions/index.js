const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const nunjucks = require('nunjucks');

exports.sendEmailToStaff = functions.firestore
  .document('Reservations/{reservationID}')
  .onCreate((snap, context) => {
    const newValue = snap.data()
    console.log(newValue)
    console.log(context)

    const mailTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: functions.config().gmail.email,
        pass: functions.config().gmail.password
      } 
    })
    
    console.log('Function sendEmailToStaff starting...');
    nunjucks.configure({ autoescape: true });
    const payload = nunjucks.render('./templates/booking.html', newValue)
    console.log(payload)
    
    const mailOptions = {
      from: "Tom Claudio <dev.tomclaudio@gmail.com>",
      to: 'tom@etours.ph',
      subject: 'Test Email',
      text: "This is a test email",
      html: payload
    }

    try {
      mailTransport.sendMail(mailOptions)
      console.log("Email sent")
      return true;
    } catch (error) {
      console.log("Error:", error)
    }
  })
