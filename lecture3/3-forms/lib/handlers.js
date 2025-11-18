// note, package.json has "type": "module" to enable ES modules, so we don't need to use .mjs extension
export var api = {}

export const home = (req, res) => res.render('home')

// **** these handlers are for browser-submitted forms
export const newsletterSignup = (req, res) => {
  // we will learn about CSRF later...for now, we just
  // provide a dummy value
  res.render('newsletter-signup', { csrf: 'CSRF token goes here' })
}
export const newsletterSignupProcess = (req, res) => {
  console.log('CSRF token (from hidden form field): ' + req.body._csrf)
  console.log('Name (from visible form field): ' + req.body.name)
  console.log('Email (from visible form field): ' + req.body.email)
  res.redirect(303, '/newsletter-signup/thank-you')
}
export const newsletterSignupThankYou = (req, res) => res.render('newsletter-signup-thank-you')
// **** end browser-submitted form handlers



// **** these handlers are for fetch/JSON form handlers
export const newsletter = (req, res) => {
  // we will learn about CSRF later...for now, we just
  // provide a dummy value
  res.render('newsletter', { csrf: 'CSRF token goes here' })
}

api.newsletterSignup = (req, res) => {
  console.log('CSRF token (from hidden form field): ' + req.body._csrf)
  console.log('Name (from visible form field): ' + req.body.name)
  console.log('Email (from visible form field): ' + req.body.email)
  res.send({ result: 'success' })
}
// **** end fetch/JSON form handlers

export const notFound = (req, res) => res.render('404')

// Express recognizes the error handler by way of its four
// argumetns, so we have to disable ESLint's no-unused-vars rule
/* eslint-disable no-unused-vars */
export const serverError = (err, req, res, next) => res.render('500')
/* eslint-enable no-unused-vars */

export default { api, home, newsletterSignup, newsletterSignupProcess, newsletterSignupThankYou, newsletter, notFound, serverError }