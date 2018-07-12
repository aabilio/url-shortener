/* eslint-disable no-console */
const next = require('next')
const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')

const makeServer = require('./server')
const makeDatabase = require('./server/db').default
const makeModels = require('./server/models').default
const makeUtils = require('./server/utils').default
const makeControllers = require('./server/controllers').default

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const DATABASE_TYPE = process.env.DATABASE_TYPE || 'mysql'
const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost'
const DATABASE_NAME = process.env.DATABASE_NAME || 'url_shortener'
const DATABASE_USER = process.env.DATABASE_USER || 'root'
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || 'root'
const SERVER_PORT = process.env.SERVER_PORT || 8000

const initServer = () => {
  // Create server dependeces
  const database = makeDatabase({ Sequelize, log: console.log })
  const db = database(DATABASE_HOST, DATABASE_TYPE, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD)
  const models = makeModels({ db, Sequelize })
  const utils = makeUtils({ models })
  const controllers = makeControllers({ utils })
  // Start server
  const server = makeServer({
    express,
    bodyParser,
    handle,
    controllers,
    log: console.log,
  })
  server(SERVER_PORT)
}

const appErrorHandler = (ex) => {
  console.error(ex.stack)
  process.exit(1)
}

app.prepare()
  .then(initServer)
  .catch(appErrorHandler)

module.exports = app
