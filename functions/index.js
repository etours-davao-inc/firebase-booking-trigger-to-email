const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const nunjucks = require('nunjucks');

exports.emailBookingRequestToStaff = functions.firestore
  .document(functions.config().db.collection)
  .onCreate((snapshot, context) => {
    var bookingData = snapshot.data()
    console.log(`Booking request is for ${bookingData.package.type}...`, bookingData)

    bookingData = convertTimeStampToJSDate(bookingData);
    let emailTemplate = determineEmailTemplate(bookingData);
    let payload = renderEmailPayload(bookingData, emailTemplate);
    const mailTransport = prepareMailTransport();
    const mailSettings = prepareMailSettings(bookingData, payload);

    sendEmail(mailTransport, mailSettings);
  })

const convertTimeStampToJSDate = function (bookingData) {
  console.log(`Converting Timestamp Objects to JS Dates...`)
  bookingData.input.inquiryDate = bookingData.input.inquiryDate.toDate();

  if (bookingData.package.type === "multiday") {
    bookingData.input.tourDates.from = bookingData.input.tourDates.from.toDate()
    bookingData.input.tourDates.to = bookingData.input.tourDates.to.toDate()

  } else {
    bookingData.input.tourDate = bookingData.input.tourDate.toDate();
  }
  return bookingData;
}

const determineEmailTemplate = function (bookingData) {
  let template;
  if (bookingData.package.type === "multiday") {
    template = "multiday.html"
  } else {
    template = "daytour.html"
  }
  console.log(`Template to use is ${template}...`)
  return `./templates/${template}`
}

const renderEmailPayload = function (bookingData, emailTemplate) {
  nunjucks.configure({ autoescape: true });
  console.log("Rendering booking data to email template...")
  return nunjucks.render(emailTemplate, bookingData);
}

const prepareMailTransport = function () {
  console.log("Preparing mail transport...")
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: functions.config().gmail.email,
      pass: functions.config().gmail.password
    }
  })
}

const prepareMailSettings = function (bookingData, payload) {
  console.log("Preparing mail settings...")
  return {
    from: `Tom Claudio <${functions.config().gmail.email}>`,
    to: functions.config().staff.email,
    subject: `Booking request for ${bookingData.package.code}`,
    text: `Booking request for ${bookingData.package.code}`,
    html: payload
  }
}

const sendEmail = function (mailTransport, mailSettings) {
  console.log(`Sending booking request to ${functions.config().staff.email}...`)
  mailTransport.sendMail(mailSettings)
    .then(() => {
      console.log("Email succesfully sent");
      return true;

    })
    .catch(error => {
      console.log("Error sending mail", error)
      return null;
    })
}
