var canvas = document.getElementById('myCanvas')
var ctx = canvas.getContext('2d')
var ballRadius = 10

class Ball {
  constructor () {
    this.x = canvas.width / 2
    this.y = canvas.height - 50
    this.dx = 2
    this.dy = -2
  }
}
var ballList = []
ballList[0] = new Ball()
var paddleHeight = 10
var paddleWidth = 75
var paddleOffsetBottom = 40
var paddleX = (canvas.width - paddleWidth) / 2
var rightPressed = false
var leftPressed = false
var brickColumnCount = 15
var brickRowCount = 15
var brickWidth = 115
var brickHeight = 20
var brickPadding = 5
var brickOffsetTop = 30
var brickOffsetLeft = 2.5
var score = 0
var colorlist = ['#dd3300', '#dd8500', '#ddda00', '#85dd00', '#28dd00', '#00dd60', '#00ddaa', '#00d2dd', '#009bdd', '#0060dd', '#000bdd', '#5800dd', '#a200dd', '#dd00d6', '#dd007d']
var bricks = []
for (var r = 0; r < brickRowCount; r++) {
  bricks[r] = []
  for (var c = 0; c < brickColumnCount; c++) {
    bricks[r][c] = { x: 0, y: 0, status: 1, health: brickRowCount - r, color: colorlist[r] }
  }
}

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)

function keyDownHandler (e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true
  }
}

function keyUpHandler (e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false
  }
}
function collisionDetection () {
  for (var c = 0; c < brickRowCount; c++) {
    for (var r = 0; r < brickColumnCount; r++) {
      var b = bricks[c][r]
      if (b.status === 1) {
        for (var k = 0; k < ballList.length; k++) {
          if (ballList[k].x > b.x && ballList[k].x < b.x + brickWidth && ballList[k].y - ballRadius > b.y && ballList[k].y - ballRadius < b.y + brickHeight) {
            ballList[k].dy = -ballList[k].dy
            b.health = b.health - 1
            b.color = LightenDarkenColor(b.color, -10)
            if (b.health === 0) {
              b.status = 0
            }
            score++
            if (score % 15 === 0) {
              ballList.push(new Ball())
            }
            if (score === brickColumnCount * (brickColumnCount - 1) * brickRowCount / 2) {
              alert('YOU WIN, CONGRATS!')
              document.location.reload()
              requestAnimationFrame(draw) // Needed for Chrome to end game
            }
          }
        }
      }
    }
  }
}

function drawBall () {
  for (var k = 0; k < ballList.length; k++) {
    ctx.beginPath()
    ctx.arc(ballList[k].x, ballList[k].y, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#0095DD'
    ctx.fill()
    ctx.closePath()
  }
}
function drawPaddle () {
  ctx.beginPath()
  ctx.rect(paddleX, canvas.height - paddleOffsetBottom, paddleWidth, paddleHeight)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}
function drawBricks () {
  for (var c = 0; c < brickRowCount; c++) {
    for (var r = 0; r < brickColumnCount; r++) {
      if (bricks[c][r].status === 1) {
        var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft
        var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop
        bricks[c][r].x = brickX
        bricks[c][r].y = brickY
        ctx.beginPath()
        ctx.rect(brickX, brickY, brickWidth, brickHeight)
        ctx.fillStyle = bricks[c][r].color
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}
function drawScore () {
  ctx.font = '16px Arial'
  ctx.fillStyle = '#0095DD'
  ctx.fillText('Score: ' + score, 8, 20)
}
function colorCanvas () {
  ctx.fillStyle = '#b8b9c1'
  ctx.fillRect(0, 0, 1800, 800)
}
function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  colorCanvas()
  drawBricks()
  drawBall()
  drawPaddle()
  drawScore()
  collisionDetection()

  for (var k = 0; k < ballList.length; k++) {
    if (ballList[k].x + ballList[k].dx >= canvas.width - ballRadius || ballList[k].x + ballList[k].dx <= ballRadius) {
      ballList[k].dx = -ballList[k].dx
    }
    if (ballList[k].y + ballList[k].dy <= ballRadius) {
      ballList[k].dy = -ballList[k].dy
    } else if (ballList[k].y + ballList[k].dy >= canvas.height - paddleOffsetBottom) {
      if (ballList[k].x >= paddleX && ballList[k].x <= paddleX + paddleWidth) {
        ballList[k].dy = -ballList[k].dy
      } else {
        ballList.splice(k, 1)
      }
    }
    try {
      ballList[k].x += ballList[k].dx
      ballList[k].y += ballList[k].dy
    } catch (err) {
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 15
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 15
  }

  if (ballList.length === 0) {
    alert('GAME OVER')
    document.location.reload()
    requestAnimationFrame(draw) // Needed for Chrome to end game
  }

  requestAnimationFrame(draw)
}

draw()
