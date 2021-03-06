const { assert } = require('chai');

const Dredd = require('../../../src/dredd');
const { runDreddWithServer, createServer } = require('../helpers');

describe('Regression: Issue #152', () =>
  describe('Modify transaction object inside beforeAll combined with beforeEach helper', () => {
    let runtimeInfo;

    before((done) => {
      const app = createServer();
      app.get('/machines', (req, res) => res.json([{ type: 'bulldozer', name: 'willy' }]));

      const dredd = new Dredd({
        options: {
          path: './test/fixtures/single-get.apib',
          hookfiles: './test/fixtures/regression-152.coffee'
        }
      });

      runDreddWithServer(dredd, app, (...args) => {
        let err;
        // eslint-disable-next-line
        [err, runtimeInfo] = Array.from(args);
        done(err);
      });
    });

    it('should modify the transaction with hooks', () => assert.deepEqual(Object.keys(runtimeInfo.server.requests), ['/machines?api-key=23456']));
  })
);
