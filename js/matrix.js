const MATRIX = ($container, row, col) => {
  $container.css({
    width: 40 * row + 50,
    height: 40 * col + 50,
  });

  for( let i = 0; i < row; i++ ) {
    for( let j = 0; j < col; j++ ) {
      $container.append(`<div class='block' data-row=${i} data-col=${j}/>`);
    }
  }

  const fireCells = (coordinates, type) => {
    for( let i = 0; i < coordinates.length; i++ ) {
      $(`.block[data-row=${coordinates[i].row}][data-col=${coordinates[i].col}]`)
        .addClass(type)
    }
  }

  const cleanCells = (coordinates) =>{
    for( let i = 0; i < coordinates.length; i++ ) {
      $(`.block[data-row=${coordinates[i].row}][data-col=${coordinates[i].col}]`)
        .removeClass('snake')
        .removeClass('food');
    }
  }

  const checkFood = (coordinate) =>{
    return $(`.block[data-row=${coordinate.row}][data-col=${coordinate.col}]`)
      .hasClass('food');
  }

  return { cleanCells, fireCells, checkFood }
}
