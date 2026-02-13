$(() => {
  //1.0 GAME BOARD setup
  const board = document.querySelector('.board')
  const gameboard = []
  let gameIsPlaying = false
  let animationFrameId = null
  let gameLoopInterval = null
  const blast = new Audio('sounds/blast.wav')
  const xplode = new Audio('sounds/explosion.wav')
  const excellentplay = new Audio('sounds/excellentplay.wav')
  const betterluck = new Audio('sounds/betterluck.wav')
  const shootaudio = new Audio('sounds/shoot.wav')
  const invadersaudio = new Audio('sounds/invaders.mp3')
  // play the glorious music forever
  invadersaudio.loop = true

  for(let x = 0; x < 300; x++) {
    const grid = document.createElement('div')
    grid.classList.add('grid')
    grid.id = x
    board.appendChild(grid)
    gameboard.push(grid)
  }

  const $timer = $('.timer')
  const $startButton = $('.startButton')
  const $front = $('.front')
  const $board = $('.board')
  const $logo = $('.logo')
  const $scoreboard = $('.scoreboard')
  const $rules = $('.rules')

  //2.0 ALIEN SPAWN DIV ------------>
  let enemyLasers = []

  class Alien {
    constructor(startingIndex) {
      this.startingIndex = startingIndex
      this.currentIndex = startingIndex
      this.currentMoves = 0
      this.isMovingRight = true
      this.isHit = false
      this.render()
    }

    enemyLaser() {
      const enemyLaserPosition = this.currentIndex + 20
      const shouldFire = Math.floor(Math.random() * 15)
      if (!shouldFire) {
        const enemyLaser = new Laser(enemyLaserPosition, 'down', 'enemyLaser')
        enemyLasers.push(enemyLaser)
      }
    }

    render() {
      gameboard[this.currentIndex].classList.add('alien')
    }

    move() {
      gameboard[this.currentIndex].classList.remove('alien')
      if (this.currentMoves < 9) {
        this.currentMoves++
        this.enemyLaser()
        if(this.isMovingRight) {
          this.currentIndex++
        } else {
          this.currentIndex--
        }
      } else {
        this.currentIndex += 20
        this.currentMoves = 0
        this.isMovingRight = !this.isMovingRight
      }
      this.render()
    }
  }

  let aliens = [new Alien(21), new Alien(23), new Alien(25), new Alien(27), new Alien(29), new Alien(42), new Alien(44), new Alien(46), new Alien(48), new Alien(61), new Alien(63), new Alien(65), new Alien(67), new Alien(69)]

  //3.0 PLAYER LASERS --------------------->

  let lasers = []

  class Laser {
    constructor (index, direction, type) {
      this.index = index
      this.direction = direction
      this.type = type
      this.checkType()
    }

    checkType() {
      if(this.type === 'enemyLaser') {
        this.renderenemy()
      } else {
        this.render()
      }
    }

    move() {
      gameboard[this.index].classList.remove(this.type)
      if (this.direction === 'up') {
        this.index = this.index - 20
        if (this.index >= 0) {
          this.render()
        }
      } else {
        gameboard[this.index].classList.remove('enemylaser')
        this.index = this.index + 20
        if (this.index <= 299) {
          this.renderenemy()
        }
      }
    }

    renderenemy() {
      gameboard[this.index].classList.add('enemylaser')
    }

    render() {
      gameboard[this.index].classList.add(this.type)
    }
  }

  //4.0 GAMELOOP FUNCTIONS --------------------->

  function moveLasers() {
    const validLasers = []
    const validEnemyLasers = []
    
    lasers.forEach(laser => {
      const oldIndex = laser.index
      laser.move()
      if (laser.index >= 0) {
        validLasers.push(laser)
      } else {
        if (oldIndex >= 0 && oldIndex < 300) {
          gameboard[oldIndex].classList.remove('laser')
        }
      }
    })
    
    enemyLasers.forEach(eLaser => {
      const oldIndex = eLaser.index
      eLaser.move()
      if (eLaser.index <= 299) {
        validEnemyLasers.push(eLaser)
      } else {
        if (oldIndex >= 0 && oldIndex < 300) {
          gameboard[oldIndex].classList.remove('enemylaser')
        }
      }
    })
    
    lasers = validLasers
    enemyLasers = validEnemyLasers
  }

  function moveAliens() {
    aliens.forEach(alien => {
      alien.move()
    })
  }

  function checkIfLost(){
    for (let i = 0; i < aliens.length; i++) {
      if (aliens[i].currentIndex === playerCurrentIndex){
        console.log('YOU HAVE LOST')
        gameIsPlaying = false
        return
      }
    }
  }

  function enemyHit(){
    for (let i = 0; i < enemyLasers.length; i++) {
      if (enemyLasers[i].index === playerCurrentIndex){
        xplode.play()
        betterluck.play()
        console.log('YOU HAVE LOST')
        gameIsPlaying = false
        return
      }
    }
  }

  function checkIfWin(){
    if (aliens.length === 0) {
      excellentplay.play()
      console.log('YOU WIN!')
      gameIsPlaying = false
    }
  }

  function checkForLaserHit() {
    for (let laserIndex = lasers.length - 1; laserIndex >= 0; laserIndex--) {
      const laser = lasers[laserIndex]
      
      if (laser.index < 20) {
        gameboard[laser.index].classList.remove('laser')
        lasers.splice(laserIndex, 1)
        continue
      }
      
      for (let alienIndex = aliens.length - 1; alienIndex >= 0; alienIndex--) {
        const alien = aliens[alienIndex]
        if (laser.index === alien.currentIndex){
          gameboard[laser.index].classList.remove('alien')
          gameboard[laser.index].classList.remove('laser')
          aliens.splice(alienIndex, 1)
          lasers.splice(laserIndex, 1)
          score += 1
          $scoreboard.text(`Score: ${score}`)
          break
        }
      }
    }
  }

  // 5.0 Timer Function ----------------->
  let score = 0
  let timerRunning = false
  let countdown = null
  let timeRemaining = 60
  let lastMoveTime = 0
  const MOVE_INTERVAL = 500

  function gameLoop(timestamp) {
    if (!gameIsPlaying) {
      return
    }

    if (timestamp - lastMoveTime >= MOVE_INTERVAL) {
      moveAliens()
      moveLasers()
      checkForLaserHit()
      checkIfLost()
      checkIfWin()
      enemyHit()
      lastMoveTime = timestamp
    }

    animationFrameId = requestAnimationFrame(gameLoop)
  }

  $startButton.on('click', () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    if (gameLoopInterval) {
      clearInterval(gameLoopInterval)
    }
    
    startStopBtn()
    lastMoveTime = performance.now()
    animationFrameId = requestAnimationFrame(gameLoop)
  })

  // 6.0 Start Button Function ------------>
  function startStopBtn() {
    score = 0
    shootaudio.play()
    invadersaudio.play()
    if(timerRunning) return false
    timerRunning = true
    gameIsPlaying = true
    timeRemaining = 60
    
    $front.css('display', 'none')
    $board.css('visibility', 'visible')

    if (countdown) {
      clearInterval(countdown)
    }

    countdown = setInterval(() => {
      timeRemaining = timeRemaining - 1
      $timer.text(`${timeRemaining}`)
      if (gameIsPlaying === false) {
        $front.css('display', 'block')
        clearInterval(countdown)
        $board.css('visibility', 'hidden')
        timerRunning = false
        $timer.css('display', 'none')
        $rules.css('visibility', 'hidden')

        $logo.html(`Game over! Your score is ${score}.`)
        $scoreboard.css('visibility', 'hidden')

        $startButton.html('Try again?')
        $startButton.off('click').on('click', () => {
          window.location.reload()
        })
      }
    }, 1000)
  }

  //7.0 PLAYER MOVEMENT --------->

  let playerCurrentIndex = 290
  let previousPlayerIndex = 290
  gameboard[playerCurrentIndex].classList.add('player')

  $(window).on('keydown', (e) => {
    if (!gameIsPlaying) return
    
    switch(e.keyCode) {
      case 37:
        if (playerCurrentIndex <= 280) {
          return
        }
        gameboard[previousPlayerIndex].classList.remove('player')
        playerCurrentIndex--
        previousPlayerIndex = playerCurrentIndex
        gameboard[playerCurrentIndex].classList.add('player')
        break
      case 39:
        if (playerCurrentIndex >= 299) {
          return
        }
        gameboard[previousPlayerIndex].classList.remove('player')
        playerCurrentIndex++
        previousPlayerIndex = playerCurrentIndex
        gameboard[playerCurrentIndex].classList.add('player')
        break
      case 32:
        const laserPosition = playerCurrentIndex - 20
        // only allow 1 laser per grid!
        const laserExists = lasers.some(l => l.index === laserPosition)
        if (!laserExists && laserPosition >= 0) {
          const newLaser = new Laser(laserPosition, 'up', 'laser')
          lasers.push(newLaser)
          blast.play()
        }
        break
    }
  })
})
