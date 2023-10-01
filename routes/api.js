'use strict'

const SudokuSolver = require('../controllers/sudoku-solver.js')

module.exports = function (app) {
  const solver = new SudokuSolver()

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle
      const coordinate = req.body.coordinate
      const value = req.body.value

      if (!puzzle || !coordinate || !value) return res.json({ error: 'Required field(s) missing' })

      const notValid = solver.validate(puzzle)
      if (notValid) return res.json(notValid)

      if (coordinate.length !== 2 || coordinate[0].match(/[^a-iA-I]/) || coordinate[1].match(/[^1-9]/)) {
        return res.json({ error: 'Invalid coordinate' })
      }

      if (value.match(/[^1-9]/)) {
        return res.json({ error: 'Invalid value' })
      }

      let [row, column] = coordinate
      row = row.toLowerCase().charCodeAt(0) - 97
      column = parseInt(column) - 1

      const puzzle2d = solver.transform2d(puzzle)

      if (puzzle2d[row][column] === value) return res.json({ valid: true })

      const isRowOk = solver.checkRowPlacement(puzzle2d, row, column, value)
      const isColOk = solver.checkColPlacement(puzzle2d, row, column, value)
      const isRegOk = solver.checkRegionPlacement(puzzle2d, row, column, value)

      if (isRowOk && isColOk && isRegOk) {
        return res.json({ valid: true })
      } else {
        const conflict = []
        if (!isRowOk) conflict.push('row')
        if (!isColOk) conflict.push('column')
        if (!isRegOk) conflict.push('region')
        return res.json({ valid: false, conflict })
      }
    })

  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle

      const notValid = solver.validate(puzzle)
      if (notValid) return res.json(notValid)

      const puzzle2d = solver.transform2d(puzzle)
      const solution2d = solver.solve(puzzle2d)

      if (solution2d) {
        const solutionStr = solution2d.flat().join('')
        return res.json({ solution: solutionStr })
      } else {
        return res.json({ error: 'Puzzle cannot be solved' })
      }
    })
}
