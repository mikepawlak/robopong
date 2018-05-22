import Brain from 'brain.js';


let ai = {
  movementDecision : (ball, paddle2) => {
    let ball_f = ball.location.y;
    let paddle_f = paddle2.location + 50;

    if (ball_f < paddle_f && (paddle_f - ball_f) > 10) {
      return "up";
    }
    else if (ball_f > paddle_f && (ball_f - paddle_f) > 10) {
      return "down";
    }
    else {
      return "neither";
    }
  },
  getCoord : (ball, paddle2) => {
    let netinput = [
      ball.location.x,
      ball.location.y,
      ball.velocity.x,
      ball.velocity.y,
      paddle2.location
    ];

  }
};


export default ai
