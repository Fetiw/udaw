const SIZE_ROW = 20;
const SIZE_COL = 20;

let randomInteger = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
}

let Snake = (matrix, food, row, col) => {
  const TYPE = 'snake';
  let currentCourse = { row: 1, col: 0 };
  let body = [{
    row: randomInteger(0, row),
    col: randomInteger(0, col)
  }];

  matrix.fireCells(body, TYPE);

  let move = () => {
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

  let getNextCoordinates = (coordinates, currentCourse) => {
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

  let setCourse = (course) => {
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

let MATRIX = ($container, row, col) => {
  $container.css({
    width: 40 * row + 50,
    height: 40 * col + 50,
  });

  for( let i = 0; i < row; i++ ) {
    for( let j = 0; j < col; j++ ) {
      $container.append(`<div class='block' data-row=${i} data-col=${j}/>`);
    }
  }

  let fireCells = (coordinates, type) => {
    for( let i = 0; i < coordinates.length; i++ ) {
      $(`.block[data-row=${coordinates[i].row}][data-col=${coordinates[i].col}]`)
        .addClass(type)
    }
  }

  let cleanCells = (coordinates) =>{
    for( let i = 0; i < coordinates.length; i++ ) {
      $(`.block[data-row=${coordinates[i].row}][data-col=${coordinates[i].col}]`)
        .removeClass('snake')
        .removeClass('food');
    }
  }

  let checkFood = (coordinate) =>{
    return $(`.block[data-row=${coordinate.row}][data-col=${coordinate.col}]`)
      .hasClass('food');
  }

  return { cleanCells, fireCells, checkFood }
}

let Food = (matrix, row, col) => {
  return function() {
    matrix.fireCells([{
      row: randomInteger(0, row),
      col: randomInteger(0, col)
    }], 'food');
  }
}

let start = () => {
  let matrix = MATRIX($('#matrix'), SIZE_COL, SIZE_ROW);
  let food = Food(matrix, SIZE_ROW, SIZE_COL);
  let snake = Snake(matrix, food, SIZE_ROW, SIZE_COL);

  food();


  $(window).keydown(function(e) {
    snake.setCourse(e.key);
  });

  setInterval(function() {
    snake.move();
  }, 100);
}

start();



