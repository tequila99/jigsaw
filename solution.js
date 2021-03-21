function solvePuzzle(pieces) {
  const PUZZLE_SIZE = Math.ceil(Math.sqrt(pieces.length))

  const top = piece  => piece  ? piece.edges.top : null;
  const right = piece => piece  ? piece.edges.right : null;
  const bottom = piece => piece  ? piece.edges.bottom : null;
  const left = piece => piece  ? piece.edges.left : null;
  const edgeType = edge => edge ? edge.type : null;
  const edgeId = edge => edge ? edge.edgeTypeId : null;

  const compare = (fEdge, sEdge = null) =>
    fEdge && sEdge
      ? edgeId(fEdge) === edgeId(sEdge) && edgeType(fEdge) !== edgeType(sEdge)
      : fEdge === sEdge;

  const suitableEdge = edge => {
    if (!edge) return edge
    const newEdge = { ...edge }
    newEdge.type = edge.type === 'inside' ? 'outside' : 'inside'
    return newEdge
  }

  const rotateRight = p => ({ ...p, edges: { top: left(p), right: top(p), bottom: right(p), left: bottom(p)}});
  const rotateLeft = p => ({ ...p, edges: { top: right(p), right: bottom(p), bottom: left(p), left: top(p)}});
  const rotateFull = p => ({ ...p, edges: { top: bottom(p), right: left(p),bottom: top(p), left: right(p)}});
  const rotate = (piece, angle = 1) => {
      if (angle === 1 || angle === -3) return rotateRight(piece);
      if (angle === 2 || angle === -2) return rotateFull(piece);
      if (angle === 3 || angle === -1) return rotateLeft(piece);
      return piece;
    }
  const rotateFit = (piece, leftPiece = null, topPiece = null) =>
    [ rotate(piece,0), 
      rotate(piece,1), 
      rotate(piece,2), 
      rotate(piece,3) 
    ].find(el => compare(left(el), right(leftPiece)) && compare(top(el), bottom(topPiece)));

  const initPuzzle = puzzle => {
    const puzzleMap = new Map;
    puzzle.forEach(piece => {
      [ top(piece), right(piece), bottom(piece), left(piece) ].forEach(edge => {
        if (edge) {
          puzzleMap.set(JSON.stringify(suitableEdge(edge)), piece);
        }
      })
    });    
    return puzzleMap;
  }      

  const buildPuzzle = (puzzleMap, acc) => {    
    if (acc.length === pieces.length ) {      
      return acc
    }
    const row = Math.floor((acc.length) / PUZZLE_SIZE)
    const col = acc.length % PUZZLE_SIZE
    const topPiece = row ? acc[acc.length - PUZZLE_SIZE] : null
    const leftPiece = col ? acc[acc.length - 1] : null
    const topEdge = bottom(topPiece)
    const leftEdge = right(leftPiece)   
    const nextPiece = rotateFit(
      topPiece ? puzzleMap.get(JSON.stringify(topEdge)) : puzzleMap.get(JSON.stringify(leftEdge)),
      leftPiece,
      topPiece)
    return buildPuzzle(puzzleMap, [ ...acc, nextPiece ])
  }
  
  return buildPuzzle(initPuzzle(pieces), [ rotateFit(pieces[0]) ]).map(el => el.id)
}

// Не удаляйте эту строку
window.solvePuzzle = solvePuzzle;

