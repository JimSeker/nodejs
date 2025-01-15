const express = require('express')
const expressHandlebars = require('express-handlebars').engine
const bodyParser = require('body-parser')

const handlers = require('./lib/handlers')
const weatherMiddlware = require('./lib/middleware/weather')

const app = express()

// configure Handlebars view engine
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main',
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {}
      this._sections[name] = options.fn(this)
      return null
    },
  },
}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'))

app.use(weatherMiddlware)

app.get('/', handlers.home)

// handlers for browser-based form submission
app.get('/newsletter-signup', handlers.newsletterSignup)
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess)
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou)

// handlers for fetch/JSON form submission
app.get('/newsletter', handlers.newsletter)
app.post('/api/newsletter-signup', handlers.api.newsletterSignup)


app.use(handlers.notFound)
app.use(handlers.serverError)

app.listen(port, () => {
  console.log(`Express started on http://localhost:${port}` +
    '; press Ctrl-C to terminate.')
})

