import Helper from './pong.js';







const sketch = (p) => {

  let pongHelper = new Helper(p);

  p.setup = function () {
    p.createCanvas(p.windowHeight - 4, p.windowWidth - 4);
    pongHelper.paddle1.location = pongHelper.paddle2.location = p.height / 2 - 50;
    pongHelper.paddle1.velociy = pongHelper.paddle2.velocity = 0;

    pongHelper.ball.velocity = p.createVector(0,0);
    pongHelper.ball.location= p.createVector(p.width / 2, p.height / 2);

    pongHelper.createText(p);
  }

  p.draw = function () {

    pongHelper.monitorGame(p);

    pongHelper.materializeBoard(p);
    pongHelper.drawObjects(p);
    pongHelper.drawScoreboard(p);

    //handle movement
    pongHelper.handlePaddles(p);
    pongHelper.handleBall(p);


  }

}

new p5(sketch);
