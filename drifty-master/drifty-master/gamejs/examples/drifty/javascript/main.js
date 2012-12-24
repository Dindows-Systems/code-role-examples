/**
 * @fileoverview Minimal is the smalles GameJs app I could think of, which still shows off
 * most of the concepts GameJs introduces.
 *
 * It's a pulsating, colored circle. You can make the circle change color
 * by clicking.
 *
 */

var gamejs = require('gamejs');

var SCREEN_WIDTH  = 200,
    SCREEN_HEIGHT = 400;


function Car(){
   this.color        = "#55aa33";
   this.width        = 30;
   this.height       = 60;
   this.posX         = parseInt( SCREEN_WIDTH / 2, 10 ),
   this.posY         = parseInt( SCREEN_HEIGHT / 2, 10 );
   this.velX         = 0;
   this.velY         = -1;
   this.friction     = 0.98;
   // this.acceleration = 0.4; 
   this.wallFriction = -0.6;
   this.rotationStep = 5;     // number of degrees to rotate car when key is pressed
   // this.maxSpeed     = 100;
   // this.maxReverseSpeed = 10;
   return this;
}

Car.prototype.draw = function( display ){
   gamejs.draw.rect( display, this.color, new gamejs.Rect( [this.posX - (this.width/2), this.posY - (this.height/2)], [this.width, this.height]), 0);
   //gamejs.transform.rotate( display, 10 );
};

Car.prototype.update = function( msDuration ){
   this.velX *= this.friction;
   this.velY *= this.friction;

   // If the car has reached the bottom or top of the screen, flip the velocity
   if( (this.posY + (this.height/2) > SCREEN_HEIGHT ) || (this.posY - (this.height/2) < 0 )){
      this.velY *= this.wallFriction;
   }

   // Make sure the car has not driven through the walls this frame
   this.posY = ( (this.posY - (this.height/2)) < 0 )? (this.height/2): this.posY;
   this.posY = ( (this.posY + (this.height/2)) > SCREEN_HEIGHT )? ( SCREEN_HEIGHT - (this.height/2)): this.posY;

   this.posX = this.posX + this.velX;
   this.posY = this.posY + this.velY;

};


function main() {

   function handleEvent(event) {
      if ( event.type === gamejs.event.KEY_DOWN) {
         if( event.key === gamejs.event.K_UP ) {
            car.velY -= 0.5;
         } else if( event.key === gamejs.event.K_DOWN ){
            car.velY += 0.5;
         }
      }
   }

  // handle key / mouse events
      // gamejs.event.get().forEach(function(event) {
      //    if (event.type === gamejs.event.KEY_UP) {
      //       if (event.key === gamejs.event.K_UP) {
      //          // reverse Y direction of sparkles
      //          sparkles.forEach(function(sparkle) {
      //             sparkle.deltaY *= -1;
      //          });
      //       };
      //    } else if (event.type === gamejs.event.MOUSE_MOTION) {
      //       // if mouse is over display surface
      //       if (displayRect.collidePoint(event.pos)) {
      //          // add sparkle at mouse position
      //          sparkles.push({
      //             left: event.pos[0],
      //             top: event.pos[1],
      //             alpha: Math.random(),
      //             deltaX: 30 - Math.random() * 60,
      //             deltaY: 80 + Math.random() * 40,
      //          });
      //       }
      //    }
      // });


   // handle events.
   // update models.
   // clear screen.
   // draw screen.
   // called ~ 30 times per second by fps.callback
   // msDuration = actual time in milliseconds since last call
   function gameTick(msDuration) {
      gamejs.event.get().forEach(function(event) {
         handleEvent(event);
      });
      car.update( msDuration );
      display.clear();
      car.draw( display );
   }

   // Setup screen and car.
   // Start game loop.
   var display = gamejs.display.setMode( [SCREEN_WIDTH, SCREEN_HEIGHT] );
   var car = new Car();

   gamejs.time.fpsCallback(gameTick, this, 60);
};

// call main after all resources have finished loading
gamejs.ready(main);
