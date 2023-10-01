const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert
const server = require('../server')
const mocha = require('mocha')
const { suite, test } = mocha
chai.use(chaiHttp)
const testPuzzle = require('../controllers/puzzle-strings').puzzlesAndSolutions

suite('Functional Tests', () => {
  suite('POST request to (/api/solve)', () => {
    test('Solve a puzzle with valid puzzle string', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle: testPuzzle[3][0] })
        .end((err, res) => {
          if (err) done(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.solution, testPuzzle[3][1])
          done()
        })
    })

    test('Solve a puzzle with missing puzzle string', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .end((err, res) => {
          if (err) done(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Required field missing')
          done()
        })
    })

    test('Solve a puzzle with invalid characters', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle: testPuzzle[3][0].replace('9', 's') })
        .end((err, res) => {
          if (err) done(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Invalid characters in puzzle')
          done()
        })
    })

    test('Solve a puzzle with incorrect length', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle: testPuzzle[3][0].replace('9', '') })
        .end((err, res) => {
          if (err) done(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
          done()
        })
    })

    test('Solve a puzzle that cannot be solved', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle: testPuzzle[3][0].replace('9', '1') })
        .end((err, res) => {
          if (err) console.log('this is it')
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Puzzle cannot be solved')
          done()
        })
    })
  })

  suite('POST request to (/api/check)', () => {
    test('Check a puzzle placement with all fields', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: testPuzzle[3][0], coordinate: 'a1', value: '4' })
        .end((err, res) => {
          if (err) done(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.valid, true)
          done()
        })
    })

    test('Check a puzzle placement with single placement conflict', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: testPuzzle[3][0], coordinate: 'a1', value: '9' })
        .end((err, res) => {
          if (err) done(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.valid, false)
          assert.equal(res.body.conflict.length, 1)
          done()
        })
    })

    test('Check a puzzle placement with multiple placement conflicts', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: testPuzzle[3][0], coordinate: 'a1', value: '5' })
        .end((err, res) => {
          if (err) done(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.valid, false)
          assert.equal(res.body.conflict.length, 2)
          done()
        })
    })

    test('Check a puzzle placement with all placement conflicts', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: testPuzzle[3][0], coordinate: 'b8', value: '3' })
        .end((err, res) => {
          if (err) done(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.valid, false)
          assert.equal(res.body.conflict.length, 3)
          done()
        })
    })

    test('Check a puzzle placement with missing required fields', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: testPuzzle[3][0], coordinate: 'b8' })
        .end((err, res) => {
          if (err) done(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Required field(s) missing')
          done()
        })
    })

    test('Check a puzzle placement with invalid characters', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: testPuzzle[3][0].replace('9', 's'), coordinate: 'a1', value: '4' })
        .end((err, res) => {
          if (err) done(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Invalid characters in puzzle')
          done()
        })
    })

    test('Check a puzzle placement with incorrect length', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: testPuzzle[3][0].replace('9', ''), coordinate: 'a1', value: '4' })
        .end((err, res) => {
          if (err) done(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
          done()
        })
    })

    test('Check a puzzle placement with invalid placement coordinate', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: testPuzzle[3][0], coordinate: 'sx', value: '4' })
        .end((err, res) => {
          if (err) done(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Invalid coordinate')
          done()
        })
    })

    test('Check a puzzle placement with invalid placement value', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({ puzzle: testPuzzle[3][0], coordinate: 'a1', value: 's' })
        .end((err, res) => {
          if (err) done(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.error, 'Invalid value')
          done()
        })
    })
  })
})
