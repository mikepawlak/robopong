import ai from './ai.js';


const text = {
  font: "Arial",
  size: 30
};

const paddle1_color = '#ea4335'; //red
const paddle2_color = '#4285f4'; //blue
const ball_color = '#34a853'; //green
const board_color = '#eef1f3'; //whitesmoke

let decision, decision1;

function createGameObject() {
  return {
    location: 0,
    velocity: 0
  }
}

class Helper {
  constructor (p) {
    this.paddle1 = createGameObject(),
    this.paddle2 = createGameObject(),
    this.ball = createGameObject(),
    this.gameActive = false,
    this.gameWon = false,
    this.watcher = p.height / 2 - 50; //watches P1 for movement
    this.score = {
      p1 : 0,
      p2 : 4
    }
  }

  handlePaddles(p) {
    //player 1 ctl
    //temp decision
    decision1 = ai.movementDecision(this.ball, this.paddle2);
    if (decision1 === 'up') {
      //move up
      this.paddle1.velocity -= 5;
    }
    else if (decision1 === 'down') {
      //move down
      this.paddle1.velocity += 5;
    }

    if (p.keyIsDown(87)) {
      //move up
      this.paddle1.velocity -= 5;
    }
    else if (p.keyIsDown(83)) {
      //move down
      this.paddle1.velocity += 5;
    }


    //player 2 ctl
    decision = ai.movementDecision(this.ball, this.paddle2);
    if (decision === 'up') {
      //move up
      this.paddle2.velocity -= 5;
    }
    else if (decision === 'down') {
      //move down
      this.paddle2.velocity += 5;
    }

    this.paddle1.location += this.paddle1.velocity;
    this.paddle2.location += this.paddle2.velocity;

    //movement decay
    this.paddle1.velocity *= 0.4;
    this.paddle2.velocity *= 0.4;



    //paddle p.constraints
    this.paddle1.location = p.constrain(this.paddle1.location, 0, p.height - 100);
    this.paddle2.location = p.constrain(this.paddle2.location, 0, p.height - 100);
  }

  handleBall(p) {
    //out of bounds
    if (this.ball.location.x < -20) { //out left
      this.score.p2++
      this.watcher = this.paddle1.location;
      this.gameActive = false;
      this.ball.velocity = p.createVector(0,0);
      this.ball.location= p.createVector(p.width / 2, p.height / 2);;
      return;
    }
    else if (this.ball.location.x > p.width + 2) {//out right
      this.score.p1++;
      this.watcher = this.paddle1.location;
      this.gameActive = false;
      this.ball.velocity = p.createVector(0,0);
      this.ball.location= p.createVector(p.width / 2, p.height / 2);
      return;
    }


    //top/bottom collision
    if (this.ball.location.y > p.height - 10 || this.ball.location.y < 10) {
      this.ball.velocity.y *= -1;
    }

    //paddle collision
    if (this.ball.location.x < 35 && this.ball.location.x > 10) {//on left
      if(this.ball.location.y > this.paddle1.location && this.ball.location.y < this.paddle1.location + 100) {
        this.ball.velocity.x *= -1.05;
        if (this.ball.location.y > this.paddle1.location && this.paddle1.location + 5) {//if on the top edge
          this.ball.velocity.y += 1;
        }
        else if (this.ball.location.y < this.paddle1.location + 100 && this.ball.location.y > this.paddle1.location + 95) {//if on the bottom edge
          this.ball.velocity.y -= 1;
        }
      }
    }
    else if (this.ball.location.x > p.width - 50 && this.ball.location.x < p.width - 30) {//on right
      if(this.ball.location.y > this.paddle2.location && this.ball.location.y < this.paddle2.location + 100) {
        this.ball.velocity.x *= -1.05;
        if (this.ball.location.y > this.paddle2.location && this.paddle2.location + 5) {//if on the top edge
          this.ball.velocity.y += 1;
        }
        else if (this.ball.location.y < this.paddle2.location + 100 && this.ball.location.y > this.paddle2.location + 95) {//if on the bottom edge
          this.ball.velocity.y -= 1;
        }
      }
    }

    this.ball.location.x += this.ball.velocity.x;
    this.ball.location.y += this.ball.velocity.y;

    if (this.gameActive) ai.getCoord(this.ball, this.paddle2);
  }

  monitorGame(p) {
    if (this.score.p1 > 4 || this.score.p2 > 4) {
      this.gameActive = false;
      this.gameWon = true;
    }

    if (!this.gameWon) {
      if (!this.gameActive) {
        if(this.paddle1.location != this.watcher) {
          this.ball.velocity = p.createVector((((p.random() > 0.5) ? 1:-1)*4), p.random(-1, 1));
          this.gameActive = true;
        } else {
          this.watcher = this.paddle1.location;
        }
      }
    } else {
      if (p.keyIsDown(32)) {
        this.gameWon = false;
        this.score = {
          p1: 0,
          p2: 0
        }
      }
    }
  }

  drawScoreboard(p) {
    p.fill('#ea4335'); //red
    p.text(this.score.p1, p.width / 2 - 20, 50);
    p.fill('#fbbc05'); //yellow
    p.text(" - ", p.width / 2, 50);
    p.fill('#4285f4'); //blue
    p.text(this.score.p2, p.width / 2 + 20, 50);

    if (this.gameWon) {
      let victor = (this.score.p1 > this.score.p2) ? "Player 1" : "Player 2";
      if (victor === "Player 1") {
        p.fill(paddle1_color);
      } else {
        p.fill(paddle2_color);
      }
      p.text(`${victor} Wins!`, p.width / 2, p.height - 80);
      p.textSize(15);
      p.text("(Press SPACEBAR to play again...)", p.width / 2, p.height - 50)
    }
  }

  createText(p) {
    p.textAlign(p.CENTER);
    p.textSize(text.size);
    p.textFont(text.font);
  }

  drawObjects(p) {
    p.noStroke();
    //draw paddles
    p.fill(paddle1_color);
    p.rect(20, this.paddle1.location, 5, 100);
    p.fill(paddle2_color);
    p.rect(p.width - 40, this.paddle2.location, 5, 100);

    //draw ball
    p.fill(ball_color);
    p.ellipse( this.ball.location.x, this.ball.location.y, 20, 20);
  }

  materializeBoard(p) {
    p.drawingContext.shadowOffsetX = 2;
    p.drawingContext.shadowOffsetY = 2;
    p.drawingContext.shadowBlur = 5;
    p.drawingContext.shadowColor = '#455A64'; //blue-grey-700

    p.background(board_color);
  }

}

export default Helper
