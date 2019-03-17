$(() => {
  //1.0 GAME BOARD setup
  const board = document.querySelector('.board')
  const gameboard = []
  let gameIsPlaying = false
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

  const gridItems = document.querySelectorAll('.grid')

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
      let enemyLaser
      if (!shouldFire) {
        enemyLaser = new Laser(enemyLaserPosition, 'down', 'enemyLaser')
        enemyLasers.push(enemyLaser)
      }
    }

    render() {
      $(gameboard).eq(this.currentIndex).addClass('alien')
    }

    move() {
      $(gameboard).eq(this.currentIndex).removeClass('alien')
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

  const aliens = [new Alien(21), new Alien(23), new Alien(25), new Alien(27), new Alien(29), new Alien(42), new Alien(44), new Alien(46), new Alien(48), new Alien(61), new Alien(63), new Alien(65), new Alien(67), new Alien(69)]

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
      // remove out of bound lasers
      enemyLasers = enemyLasers.filter(l => l.index <= 299)
      lasers = lasers.filter(l => l.index >= 0)
      $(gameboard).eq(this.index).removeClass(this.type)
      if (this.direction === 'up') {
        this.index = this.index - 20
        this.render()
      } else {
        this.removeEnemyLaser()
        this.index = this.index + 20
        this.renderenemy()
      }
    }

    removeEnemyLaser() {
      $(gameboard).eq(this.index).removeClass('enemylaser')
    }

    renderenemy() {
      $(gameboard).eq(this.index).addClass('enemylaser')
    }

    render() {
      $(gameboard).eq(this.index).addClass(this.type)
    }
  }

  //4.0 GAMELOOP FUNCTIONS --------------------->

  function moveLasers() {
    lasers.forEach(laser => {
      laser.move()
    })
    enemyLasers.forEach(eLaser => {
      eLaser.move()
    })
  }

  function moveAliens() {
    aliens.forEach(alien => {
      alien.move()
    })
  }

  function checkIfLost(){
    aliens.forEach(alien => {
      if (alien.currentIndex === playerCurrentIndex){
        console.log('YOU HAVE LOST')
        gameIsPlaying = false
      }
    })
  }

  function enemyHit(){
    enemyLasers.forEach(eLaser => {
      if (eLaser.index === playerCurrentIndex){
        xplode.play()
        betterluck.play()
        console.log('YOU HAVE LOST')
        gameIsPlaying = false
      }
    })
  }

  function checkIfWin(){
    if (aliens === undefined || aliens.length === 0) {
      excellentplay.play()
      console.log('YOU WIN!')
      gameIsPlaying = false
    }
  }

  function checkForLaserHit() {
    lasers.forEach((laser, laserIndex) => {
      if (laser.index < 20) {
        $(gridItems[laser.index]).removeClass('laser')
        lasers.splice(laserIndex, 1)
      }
      aliens.forEach((alien, alienIndex) => {
        if (laser.index === alien.currentIndex){
          $(gridItems[laser.index]).removeClass('alien')
          $(gridItems[laser.index]).removeClass('laser')
          aliens.splice(alienIndex, 1)
          lasers.splice(laserIndex, 1)
          score += 1
          const $scoreboard = $('.scoreboard')
          $scoreboard.html(`Score: ${score}`)
        }
      })
    })
  }

  // 5.0 Timer Function ----------------->
  let score = 0
  let timerRunning = false
  let countdown = null
  let timeRemaining = 60
  let $timer = $('.timer')
  const $startButton = $('.startButton')
  $startButton.on('click', () => {
    startStopBtn()
    setInterval(gameLoop, 500)


    function gameLoop () {
      if(gameIsPlaying === true) {
        moveAliens()
        moveLasers()
        checkForLaserHit()
        checkIfLost()
        checkIfWin()
        enemyHit()

      } else {
        console.log('game over')
      }
    }
  })

  // 6.0 Start Button Function ------------>
  function startStopBtn() {
    score = 0
    shootaudio.play()
    invadersaudio.play()
    if(timerRunning) return false
    timerRunning = true
    gameIsPlaying = true
    const $front = $('.front')
    $front.css('display', 'none')
    const $board = $('.board')
    $board.css('visibility', 'visible')
    const $logo = $('.logo')

    countdown = setInterval(() => {
      timeRemaining = timeRemaining - 1
      console.log(timeRemaining)
      $timer.text(`${timeRemaining}`)
      if (gameIsPlaying === false) {
        $front.css('display', 'block')
        clearInterval(countdown)
        $board.css('visibility', 'hidden')
        const $imgalien = $('.imgalien')
        $imgalien.css('visibility', 'hidden')
        timerRunning = false
        $timer.css('display', 'none')
        const $rules = $('.rules')
        $rules.css('visibility', 'hidden')

        $logo.html(`Game over! Your score is ${score}.`)
        const $scoreboard = $('.scoreboard')
        $scoreboard.css('visibility', 'hidden')

        $startButton.html('Try again?')
        $startButton.on('click', () => {
          window.location.reload()
        })

      }
    }, 1000)
  }

  //7.0 PLAYER MOVEMENT --------->

  let playerCurrentIndex = 290
  const $player = $(gameboard[playerCurrentIndex]).addClass('player')
  const $gridItems = $('.grid')


  $(window).on('keydown', (e) => {
    switch(e.keyCode) {
      case 37:
      if (playerCurrentIndex <= 280) {
        return
      }
      $gridItems.removeClass('player')
      playerCurrentIndex--
      $(gameboard).eq(playerCurrentIndex).addClass('player')
      break
      case 39:
      if (playerCurrentIndex >= 299) {
        return
      }
      $gridItems.removeClass('player')
      playerCurrentIndex ++
      $(gameboard).eq(playerCurrentIndex).addClass('player')
      break
      case 32:
        const laserPosition = playerCurrentIndex - 20
        // only allow 1 laser per grid!
        if (lasers.map(l => l.index).indexOf(laserPosition) > 0) return
        const newLaser = new Laser(laserPosition, 'up', 'laser')
        lasers.push(newLaser)
        blast.play()
      break
    }
  })
})
