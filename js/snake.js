const Snake = (matrix, food, row, col) => {
  const TYPE = 'snake';
  let currentCourse = { row: 1, col: 0 };
  let body = [{
    row: randomInteger(0, row),
    col: randomInteger(0, col)
  }];

  matrix.fireCells(body, TYPE);

  const move = () => {
    let head = body[0];
    let nextHead = getNextCoordinates(head, currentCourse);

    body.unshift(nextHead);
    matrix.fireCells([nextHead], TYPE);

    if( !matrix.checkFood(nextHead) ) {
      let tail = body.pop();
      matrix.cleanCells([tail]);
    }
    else {
      food();
    }
  }

  const getNextCoordinates = (coordinates, currentCourse) => {
    let newCoordinates = {
      row: coordinates.row + currentCourse.row,
      col: coordinates.col + currentCourse.col
    };

    if( newCoordinates.row < 0 ) {
      newCoordinates.row = row - 1;
    }

    if( newCoordinates.row === row ) {
      newCoordinates.row = 0;
    }

    if( newCoordinates.col < 0 ) {
      newCoordinates.col = col - 1;
    }

    if( newCoordinates.col === col ) {
      newCoordinates.col = 0;
    }

    return newCoordinates;
  }

  const setCourse = (course) => {
    const COURSE = {
      "ArrowUp": { row: -1, col: 0 },
      "ArrowDown": { row: 1, col: 0 },
      "ArrowRight": { row: 0, col: 1 },
      "ArrowLeft": { row: 0, col: -1 },
    };

    currentCourse = COURSE[course];
  }

  return { move, setCourse }
}
