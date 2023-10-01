class SudokuSolver {
  validate (puzzleString) {
    if (!puzzleString) return { error: 'Required field missing' }
    if (puzzleString.length !== 81) return { error: 'Expected puzzle to be 81 characters long' }
    if (puzzleString.match(/[^\d.]/)) return { error: 'Invalid characters in puzzle' }
  }

  transform2d (puzzleString) {
    const puzzle2d = []
    let temp = []
    for (let i = 1; i < puzzleString.length + 1; i++) {
      temp.push(puzzleString[i - 1])
      if (i % 9 === 0) {
        puzzle2d.push(temp)
        temp = []
      }
    }
    return puzzle2d
  }

  checkRowPlacement (puzzle2d, row, column, value) {
    for (let c = 0; c < puzzle2d.length; c++) {
      if (puzzle2d[row][c] === String(value)) {
        return false
      }
    }

    return true
  };

  checkColPlacement (puzzle2d, row, column, value) {
    for (let r = 0; r < puzzle2d.length; r++) {
      if (puzzle2d[r][column] === String(value)) {
        return false
      }
    }

    return true
  };

  checkRegionPlacement (puzzle2d, row, column, value) {
    const sqrt = Math.floor(Math.sqrt(puzzle2d.length))
    const boxRowStart = row - row % sqrt
    const boxColStart = column - column % sqrt

    for (let r = boxRowStart; r < boxRowStart + sqrt; r++) {
      for (let c = boxColStart; c < boxColStart + sqrt; c++) {
        if (puzzle2d[r][c] === String(value)) {
          return false
        }
      }
    }

    return true
  };

  isSafe (puzzle2d, row, col, value) {
    const isRowOk = this.checkRowPlacement(puzzle2d, row, col, value)
    const isColOk = this.checkColPlacement(puzzle2d, row, col, value)
    const isRegOk = this.checkRegionPlacement(puzzle2d, row, col, value)

    if (isRowOk && isColOk && isRegOk) {
      return true
    } else {
      return false
    }
  }

  solve (puzzle2d) {
    const n = 9
    let row = -1
    let col = -1
    let isEmpty = true

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (puzzle2d[i][j] === '.') {
          row = i
          col = j

          isEmpty = false
          break
        }
      }
      if (!isEmpty) {
        break
      }
    }

    if (isEmpty) {
      return true
    }

    for (let num = 1; num <= n; num++) {
      if (this.isSafe(puzzle2d, row, col, num)) {
        puzzle2d[row][col] = String(num)
        if (this.solve(puzzle2d)) {
          return puzzle2d
        } else {
          puzzle2d[row][col] = '.'
        }
      }
    }
    return false
  };
}

module.exports = SudokuSolver
