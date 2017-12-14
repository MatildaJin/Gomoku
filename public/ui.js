/**
 * UI
 * @author Matilda Jin
 */

const canvas = document.getElementById('j_gomoku')
const undoBtn = document.getElementById('j_undo')
const partnerBtn = document.getElementById('j_partner')
const ctx = canvas.getContext('2d')

let over = false
let undoInfo = true
let chessInfo = []                          //  记录棋盘信息
let lastStep = {}                           //  记录上一步信息

let whiteWin = []
let darkWin = []
let currentPattern = {
  _turn: 1,
  _withHuman: true,
  current: darkWin,
  next: whiteWin,
  msgBox: ['Dark pieces win!', 'white pieces win!'],
  msg: 'Dark pieces win!'
}
Object.defineProperties(currentPattern, {
  'turn': {
    get: function () { return this._turn },
    set: function (v) {
      this._turn = v
      this.current = v === 1 ? darkWin : whiteWin
      this.next = v === 1 ? whiteWin : darkWin
      this.msg = v === 1 ? this.msgBox[0] : this.msgBox[1]
    }
  },
  'withHuman': {
    get: function () { return this._withHuman },
    set: function (v) {
      this._withHuman = v
      this.msgBox = v === true ? ['Dark pieces win!', 'white pieces win!'] : ['You fail.', 'You win!']
    }
  }
})

const chessBoard = {
  sideLength: 30,
  lineColor: '#eFeFeF',
  background: '#8D5027',
  draw: () => {
    for (let i = 0; i < 15; i++) {
      ctx.strokeStyle = chessBoard.lineColor
      ctx.beginPath()
      ctx.moveTo(15 + i * chessBoard.sideLength, 15)
      ctx.lineTo(15 + i * chessBoard.sideLength, canvas.height - 15)
      ctx.closePath()
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(15, 15 + i * chessBoard.sideLength)
      ctx.lineTo(canvas.width - 15, 15 + i * chessBoard.sideLength)
      ctx.closePath()
      ctx.stroke()
    }
  },
  clear: () => {
    ctx.fillStyle = chessBoard.background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}

const chessPieces = {
  lightColor: {
    start: '#D1D1D1',
    end: '#F9F9F9'
  },
  darkColor: {
    start: '#0A0A0A',
    end: '#636766'
  },
  draw: (i, j, turn) => {
    ctx.beginPath()
    ctx.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI)
    ctx.closePath()
    let gradient = ctx.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0)
    if (turn === 1) {
      gradient.addColorStop(0, chessPieces.darkColor.start)
      gradient.addColorStop(1, chessPieces.darkColor.end)
    }
    if (turn === -1) {
      gradient.addColorStop(0, chessPieces.lightColor.start)
      gradient.addColorStop(1, chessPieces.lightColor.end)
    }
    ctx.fillStyle = gradient
    ctx.fill()
  }
}

function start () {
  for (let i = 0; i < 15; i++) {
    chessInfo[i] = []
    for (let j = 0; j < 15; j++) {
      chessInfo[i][j] = 0
    }
  }

  chessBoard.clear()
  chessBoard.draw()
  currentPattern.turn = 1
  over = false

  for (let i = 0; i < count; i++) {
    whiteWin[i] = 0
    darkWin[i] = 0
  }
  lastStep = { i: 0, j: 0, k: [] }

  if (!currentPattern.withHuman) {
    aiGo()
  }
}

function checkWin (i, j, turn) {
  for (let k = 0; k < count; k++) {
    if (wins[i][j][k]) {
      currentPattern.current[k] ++
      currentPattern.next[k] = 6
      lastStep.i = i
      lastStep.j = j
      lastStep.k.push(k)
      if (currentPattern.current[k] === 5) {
        alert(currentPattern.msg)
        over = true
      }
    }
  }
}

function undo () {
  if (!lastStep.i) return
  chessInfo[lastStep.i][lastStep.j] = undoInfo ? 0 : currentPattern.turn * -1
  chessBoard.clear()
  chessBoard.draw()
  chessInfo.forEach(function (item, indexI) {
    item.forEach(function (i, indexJ) {
      chessPieces.draw(indexI, indexJ, i)
    })
  })
  undoInfo ? undoBtn.classList.remove('undo') : undoBtn.classList.remove('cancel')
  undoInfo ? undoBtn.classList.add('cancel') : undoBtn.classList.add('undo')
  undoInfo = !undoInfo
}

function changeMode () {
  currentPattern.withHuman ? partnerBtn.classList.remove('partner-human') : partnerBtn.classList.remove('partner-ai')
  currentPattern.withHuman ? partnerBtn.classList.add('partner-ai') : partnerBtn.classList.add('partner-human')
  currentPattern.withHuman ? undoBtn.classList.add('hide') : undoBtn.classList.remove('hide')
  currentPattern.withHuman = !currentPattern.withHuman
  start()
}

start()

canvas.onclick = (e) => {
  if (over) {
    return
  }
  let x = e.offsetX
  let y = e.offsetY
  let i = Math.floor(x / 30)
  let j = Math.floor(y / 30)
  if (chessInfo[i][j] === 0) {
    chessPieces.draw(i, j, currentPattern.turn)
    chessInfo[i][j] = currentPattern.turn
    checkWin(i, j, currentPattern.turn)

    if (!over) {
      currentPattern.turn = -currentPattern.turn
      if (!currentPattern.withHuman) {
        aiGo()
      }
    }
  }
}
