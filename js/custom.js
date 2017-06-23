var SIZE_ROW = 20;
var SIZE_COL = 20;

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  return rand;
}

function Shake(matrix) {
  var currentCourse = { row: 1, col: 0 };
  var body = [{
    row: randomInteger(0, SIZE_ROW),
    col: randomInteger(0, SIZE_COL)
  }];

  matrix.fireCells(body);

  function move() {
    var head = body[0];

    console.log(head);
    var nextHead = getNextCoordinates(head, currentCourse);
    console.log(head);

    body.unshift(nextHead);
    matrix.fireCells([nextHead]);

    var tail = body.pop();
    matrix.cleanCells([tail]);
  }

  function getNextCoordinates(coordinates, currentCourse) {
    coordinates.test = 1;
    var newCoordinates = {
      row: coordinates.row + currentCourse.row,
      col: coordinates.col + currentCourse.col
    };


    if( newCoordinates.row < 0 ) {
      newCoordinates.row = SIZE_ROW - 1;
    }

    if( newCoordinates.row === SIZE_ROW ) {
      newCoordinates.row = 0;
    }

    if( newCoordinates.col < 0 ) {
      newCoordinates.col = SIZE_COL - 1;
    }

    if( newCoordinates.col === SIZE_COL ) {
      newCoordinates.col = 0;
    }

    return newCoordinates;
  }

  function setCourse(course) {
    var COURSE = {
      "ArrowUp": { row: -1, col: 0 },
      "ArrowDown": { row: 1, col: 0 },
      "ArrowRight": { row: 0, col: 1 },
      "ArrowLeft": { row: 0, col: -1 },
    };

    currentCourse = COURSE[course];
  }

  return {
    move: move,
    setCourse: setCourse
  }
}

function MATRIX($container, i, j) {
  $container.css({
    width: 40 * i + 50,
    height: 40 * j + 50,
  });

  for( var row = 0; row < i; row++ ) {
    for( var col = 0; col < j; col++ ) {
      $container.append("<div class='block' data-row='" + row + "' data-col='" + col + "'/>") //prepend
    }
  }

  function fireCells(coordinates) {
    for( var i = 0; i < coordinates.length; i++ ) {
      $('.block[data-row=' + coordinates[i].row + '][data-col=' + coordinates[i].col + ']')
        .addClass('blue');
    }
  }

  function cleanCells(coordinates) {
    for( var i = 0; i < coordinates.length; i++ ) {
      $('.block[data-row=' + coordinates[i].row + '][data-col=' + coordinates[i].col + ']')
        .removeClass('blue');
    }
  }

  return {
    cleanCells: cleanCells,
    fireCells: fireCells
  }
}

function start() {
  var matrix = MATRIX($('#matrix'), SIZE_COL, SIZE_ROW);
  var snake = Shake(matrix);


  $(window).keydown(function(e) {
    snake.setCourse(e.key);
  });

  setInterval(function() {
    snake.move();
  }, 300);
}

start();

