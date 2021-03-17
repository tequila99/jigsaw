function solvePuzzle(pieces) {
  const mapOutside = new Map();
  const mapInside = new Map();

  const top = ({ edges: { top } }) => top;
  const right = ({ edges: { right } }) => right;
  const bottom = ({ edges: { bottom } }) => bottom;
  const left = ({ edges: { left } }) => left;

  const edgeType = ({ type = null }) => type;
  const edgeId = ({ edgeTypeId = null }) => edgeTypeId;

  const rotate = piece => ({
    ...piece,
    edges: {
      top: left(piece),
      right: top(piece),
      bottom: right(piece),
      left: bottom(piece),
    }
  });

  const compare = (fEdge, sEdge = null) =>
    sEdge
      ? edgeId(fEdge) === edgeId(sEdge) && edgeType(fEdge) !== edgeType(sEdge)
      : fEdge === sEdge;

  const nextRight = piece =>
    edgeType(right(piece)) === 'inside'
      ? mapOutside.get(edgeId(right(piece)))
      : mapInside.get(edgeId(right(piece)));

  const nextBottom = piece =>
    edgeType(bottom(piece)) === 'inside'
      ? mapOutside.get(edgeId(bottom(piece)))
      : mapInside.get(edgeId(bottom(piece)));

  const column = (piece) => {
    const result = [ piece ];
    let currentPiece = piece;
    while (!compare(bottom(currentPiece), null)) {
      const prevPiece = currentPiece;
      currentPiece = nextBottom(prevPiece);
      while (!compare(bottom(prevPiece), top(currentPiece))) {
        currentPiece = rotate(currentPiece);
      }
      result.push(currentPiece);
    }    
    return result;
  }

  const row = piece => {
    const result = [ piece ];
    let currentPiece = piece;
    while (!compare(right(currentPiece), null)) {
      const prevPiece = currentPiece;
      currentPiece = nextRight(prevPiece);
      while (!compare(right(prevPiece), left(currentPiece))) {
        currentPiece = rotate(currentPiece);
      }
      result.push(currentPiece);
    }
    return result;
  }

  const init = piecesAll => {
    piecesAll.forEach(piece => {
      [ top(piece), right(piece), bottom(piece), left(piece) ].forEach(
        edge => {
          if (edge) {
            if (edgeType(edge) === 'inside') mapInside.set(edgeId(edge), piece);
            if (edgeType(edge) === 'outside') mapOutside.set(edgeId(edge), piece);
          }
        }
      )
    })
  }

  let startPiece = pieces[0];
  init(pieces);
  while (!compare(top(startPiece), null) || !compare(left(startPiece), null)) {
    startPiece = rotate(startPiece);
  }

  return column(startPiece)
    .reduce((acc, piece) => [ ...acc, ...row(piece) ], [])
    .map(piece => piece.id);
}

// Не удаляйте эту строку
window.solvePuzzle = solvePuzzle;

