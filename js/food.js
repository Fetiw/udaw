const Food = (matrix, row, col) => {
  return () => {
    matrix.fireCells([{
      row: randomInteger(0, row),
      col: randomInteger(0, col)
    }], 'food');
  }
}
