const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const nunjucks = require('nunjucks');

exports.sendEmailToStaff = functions.firestore
  .document(functions.config().db.collection)
  .onCreate((snapshot, context) => {
    const newBookingRequest = snapshot.data()
    console.log(newBookingRequest)
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
    const payload = nunjucks.render('./templates/booking.html', newV)
    
    const mailOptions = {
      from: `Tom Claudio <${functions.config().gmail.email}>`,
      to: functions.config().staff.email,
      subject: `Booking request for ${newBookingRequest.info.code}`,
      text: `Booking request for ${newBookingRequest.info.code}`,
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
