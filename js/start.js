const start = () => {
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
