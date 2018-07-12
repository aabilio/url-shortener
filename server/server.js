const makeServer = ({
  express, bodyParser, handle, controllers, log,
}) => (port) => {
  const server = express()
  server.use(bodyParser.json())

  /** API */
  server.get('/api/v1/destination/valid', controllers.validateDestinationController)
  server.post('/api/v1/url', controllers.shortController)
  server.get('/api/v1/url/:path', controllers.infoController)
  server.get('/api/v1/url/:path/stats', controllers.statsController)
  server.get('/api/v1/url/:path/history', controllers.historyController)
  server.get('/api/v1/urls', controllers.lastShortUrlsController)

  /** Gateway */
  server.get('/:path', controllers.gatewayController)

  /** Next app: ex.: url shortener tool on / */
  server.get('*', (req, res) => handle(req, res))

  server.listen(port, (err) => {
    if (err) throw err
    log(`> Ready on http://localhost:${port}`)
  })
}

export default makeServer
