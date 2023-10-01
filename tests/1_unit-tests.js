const chai = require('chai')
const assert = chai.assert
const mocha = require('mocha')
const { suite, test } = mocha
const Solver = require('../controllers/sudoku-solver.js')
const solver = new Solver()

const testPuzzle = require('../controllers/puzzle-strings').puzzlesAndSolutions

suite('Unit Tests', () => {
  test('valid puzzle string of 81 characters', (done) => {
    const puzzle = testPuzzle[0][0]
    const notValid = solver.validate(puzzle)
    assert.equal(notValid, undefined)
    done()
  })

  test('puzzle string with invalid characters (not 1-9 or .)', (done) => {
    const puzzle = testPuzzle[0][0].replace('9', 'q')
    const notValid = solver.validate(puzzle)
    assert.equal(notValid.error, 'Invalid characters in puzzle')
    done()
  })

  test('puzzle string that is not 81 characters in length', (done) => {
    const puzzle = testPuzzle[0][0].replace('9', '')
    const notValid = solver.validate(puzzle)
    assert.equal(notValid.error, 'Expected puzzle to be 81 characters long')
    done()
  })

  test('valid row placement', (done) => {
    const testPuzzle2d = solver.transform2d(testPuzzle[2][0])
    const isRowOk = solver.checkRowPlacement(testPuzzle2d, '0', '0', '2')
    assert.isTrue(isRowOk)
    done()
  })

  test('invalid row placement', (done) => {
    const testPuzzle2d = solver.transform2d(testPuzzle[2][0])
    const isRowOk = solver.checkRowPlacement(testPuzzle2d, '0', '0', '8')
    assert.isFalse(isRowOk)
    done()
  })

  test('valid column placement', (done) => {
    const testPuzzle2d = solver.transform2d(testPuzzle[2][0])
    const isColOk = solver.checkColPlacement(testPuzzle2d, '0', '0', '1')
    assert.isTrue(isColOk)
    done()
  })

  test('invalid column placement', (done) => {
    const testPuzzle2d = solver.transform2d(testPuzzle[2][0])
    const isColOk = solver.checkColPlacement(testPuzzle2d, '0', '0', '6')
    assert.isFalse(isColOk)
    done()
  })

  test('valid region placement', (done) => {
    const testPuzzle2d = solver.transform2d(testPuzzle[2][0])
    const isRegOk = solver.checkRegionPlacement(testPuzzle2d, '0', '0', '3')
    assert.isTrue(isRegOk)
    done()
  })

  test('invalid region placement', (done) => {
    const testPuzzle2d = solver.transform2d(testPuzzle[2][0])
    const isRegOk = solver.checkRegionPlacement(testPuzzle2d, '0', '0', '5')
    assert.isFalse(isRegOk)
    done()
  })

  test('Valid puzzle strings pass the solver', (done) => {
    const testPuzzle2d = solver.transform2d(testPuzzle[2][0])
    const solution2d = solver.solve(testPuzzle2d)
    assert.isNotFalse(solution2d)
    done()
  })

  test('Invalid puzzle strings fail the solver', (done) => {
    const testPuzzle2d = solver.transform2d(testPuzzle[2][0].replace('8', '1'))
    const solution2d = solver.solve(testPuzzle2d)
    assert.isFalse(solution2d)
    done()
  })

  test('Solver returns the expected solution for an incomplete puzzle', (done) => {
    const testPuzzle2d = solver.transform2d(testPuzzle[2][0])
    const solution2d = solver.solve(testPuzzle2d)
    const solutionStr = solution2d.flat().join('')
    assert.equal(solutionStr, testPuzzle[2][1])
    done()
  })
})
