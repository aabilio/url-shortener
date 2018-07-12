import makeShortUrlModel from '../../server/models/ShortUrl'
import makeLogUrlModel from '../../server/models/LogUrl'

describe('API Models', () => {
  let db
  let Sequelize

  beforeEach(() => {
    db = {
      define: jest.fn(),
      sync: jest.fn(),
    }
    Sequelize = jest.fn()
  })

  it('ShortUrl creation', async () => {
    makeShortUrlModel({ db, Sequelize })

    expect(db.define).toHaveBeenCalledTimes(1)
    expect(db.define).toHaveBeenCalledWith(
      'short-url',
      {
        id: expect.any(Object),
        path: expect.any(Object),
        destination: expect.any(Object),
        active: expect.any(Object),
      },
    )
  })

  it('LogUrl creation', async () => {
    makeLogUrlModel({ db, Sequelize })

    expect(db.define).toHaveBeenCalledTimes(1)
    expect(db.define).toHaveBeenCalledWith(
      'log-url',
      {
        id: expect.any(Object),
        referrer: expect.any(Object),
        ip: expect.any(Object),
      },
    )
  })
})
