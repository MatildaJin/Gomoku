/**
 * AI
 * @author MatildaJin
 */

function aiGo () {
  if (over) {
    return
  }
  let i = 7
  let j = 7
  let humanScore = []
  let aiScore = []
  let max = 0

  for (let x = 0; x < 15; x++) {
    humanScore[x] = []
    aiScore[x] = []
    for (let y = 0; y < 15; y++) {
      humanScore[x][y] = 0
      aiScore[x][y] = 0
    }
  }

  for (let x = 0; x < 15; x++) {
    for (let y = 0; y < 15; y++) {
      if (chessInfo[x][y] === 0) {
        for (let k = 0; k < count; k++) {
          if (wins[x][y][k]) {
            switch (whiteWin[k]) {
              case 1:
                humanScore[x][y] += 200
                break
              case 2:
                humanScore[x][y] += 400
                break
              case 3:
                humanScore[x][y] += 2000
                break
              case 4:
                humanScore[x][y] += 10000
                break
            }
            switch (darkWin[k]) {
              case 1:
                aiScore[x][y] += 220
                break
              case 2:
                aiScore[x][y] += 420
                break
              case 3:
                aiScore[x][y] += 2100
                break
              case 4:
                aiScore[x][y] += 20000
                break
            }
          }
        }
        if (humanScore[x][y] > max) {
          max = humanScore[x][y]
          i = x
          j = y
        } else if (humanScore[x][y] === max) {
          if (aiScore[x][y] > aiScore[i][j]) {
            i = x
            j = y
          }
        }
        if (aiScore[x][y] > max) {
          max = aiScore[x][y]
          i = x
          j = y
        } else if (aiScore[x][y] === max) {
          if (humanScore[x][y] > humanScore[i][j]) {
            i = x
            j = y
          }
        }
      }
    }
  }

  chessPieces.draw(i, j, currentPattern.turn)
  chessInfo[i][j] = currentPattern.turn
  checkWin(i, j, currentPattern.turn)

  if (!over) {
    currentPattern.turn = -currentPattern.turn
  }
}
