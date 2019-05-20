# Personal Space Invaders

## Brief

Create a game using HTML, CSS, JavaScript & jQuery (optional)
The game should be technically challenging & have backend logic that was reasonably complex.
The code implemented should be "DRY" as possible, using Object Oriented Programming when possible.

## Timeframe
7 days

## Technologies used
JavaScript (ES6)
jQuery
HTML5 + HTML5 Audio
CSS
GitHub

## Game Instructions

![psimain](https://user-images.githubusercontent.com/29276064/57708402-2a97af80-7661-11e9-9863-9a8a4e46148d.png)

![psigame](https://user-images.githubusercontent.com/29276064/57709844-aabf1480-7663-11e9-827e-db9b24cd2545.png)

### Controls
Player movements: ← → keys
Player attack: [space bar]

## Game overview

This is a 2D, single-player game inspired by the classic arcade game, Space Invaders. The objective of Space Invaders is for the player to move a spaceship across a screen and shoot descending swarms of aliens. If the player has been hit by an enemy laser or if the enemy aliens reach the bottom of the screen, it's game over.

I created a simple wireframe on pen and paper. To keep a track of my progress, I managed my workflow with Trello.

I initialized the game by creating a gameboard in a for loop, which added divs with a classname of grid. An id was given to each grid so I could track the number of each created grid on the board.

~~~
for(let x = 0; x < 300; x++) {
    const grid = document.createElement('div')
    grid.classList.add('grid')
    grid.id = x
    board.appendChild(grid)
    gameboard.push(grid)
  }
~~~

The aliens were the first elements to be created, once the grid was on the map. A class constructor was created to initialize data for the aliens. The aliens were then created in an array and given starting indexes across the board.

~~~
class Alien {
   constructor(startingIndex) {
     this.startingIndex = startingIndex
     this.currentIndex = startingIndex
     this.currentMoves = 0
     this.isMovingRight = true
     this.isHit = false
     this.render()
   }
~~~

Next came the movement of the aliens which proved to be tricky at first. The idea of calling a move function on each alien was that when the game was given a set interval, the index of each alien would increase, creating the illusion of the aliens moving across the board.

They were each given a starting index, and would move right. There was a problem here where the aliens would keep on moving past the edge of the game board. Hence, their movement had to be defined by a function that calculated how many steps an alien would take.

As the game board was 20 grids wide, the alien closest to the end would then be moving 9 steps before reaching the edge. Hence, after moving 9 steps to the right, the index of the alien on the board would be updated by 20 so they would move downwards. They would then continue moving towards the left again 9 steps.

~~~
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
~~~

The first early look at the game at movement mechanics of the game can be viewed  here: https://codepen.io/RuLette/pen/ErrPoY

![psiearly](https://user-images.githubusercontent.com/29276064/57711301-5e290880-7666-11e9-89b6-38dbe09996fb.png)

The player's movement was easier to define, with the player given a starting index of 290 (near the bottom of the gameboard). A switch statement was written to save the player's movement to key 37 ← (left) , 39 → (right) and 32 (spacebar).

Next the enemy lasers were created by adding the index of 20 to each alien so the lasers would appear to be coming from each alien. The firing mechanics were generated randomly with Math.floor(Math.random() * 15).

~~~
enemyLaser() {
  const enemyLaserPosition = this.currentIndex + 20
  const shouldFire = Math.floor(Math.random() * 15)
  let enemyLaser
  if (!shouldFire) {
    enemyLaser = new Laser(enemyLaserPosition, 'down', 'enemyLaser')
    enemyLasers.push(enemyLaser)
  }
}
~~~

The collision mechanics were created by checking if the player laser and aliens have reached the same index. If there is a match then the alien object is removed from the alienArray, and its class name is removed from the div element. The same mechanics work for when the player is hit by the enemy alien's lasers as well.

The win conditions were met if the array of aliens were empty before the game had ended.

~~~

function checkIfWin(){
  if (aliens === undefined || aliens.length === 0) {
    excellentplay.play()
    gameIsPlaying = false
  }
}
~~~

When the main functionality of the game was made, a scoreboard was added. Audio and styling was added to the game last.

## Challenges

One of the most challenging aspects of creating this game was executing the shooting mechanism.  

~~~
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
~~~

There was a bug where enemy lasers would continue firing even after the game was over on the game over screen. After debugging for some time, I applied a filter on enemy lasers so that they could be removed from the game board after they had reached index 299.

~~~
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
~~~

## Future features

In future I hope to add these features to the game:

- Adding levels to the game and allowing new levels to be more difficult
- The player can have three lives or a health bar
- The logged in user can save their name for the high score
- Adding a high score feature to the game that displays the user who has reached the high score
