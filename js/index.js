var load_state = {
    preload: function() {
        // Function called first to load all the assets
        game.stage.backgroundColor = '#71C5CF';
      
      	var birdDataURI =  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAG1BMVEX/+wUAAADf2wSfnAN/fQK/vANfXgEfHwA/PgFGJokpAAAA3ElEQVQ4je2SMQ+CMBCFz0ITdlAciVFwhIm1sujsoIziIK4EdMZEw9+2By2g1s3FhDe01/u4x11TgEF/o8VWnSdrOyuUxHsAhKWKnLFOWWTisunbOyIY4xICzCTRLIFqoxNAEEm0EyjgG+WFNGmRO6mRbgFZ+eifHN9QPL01qR6aXx2c9J42n/CwRTpHe35aXkSiQ55PctxTOUve2eklBiP/1c4tHDAYRsahBmnUAUlYH8QIoHOjVQsaa1N0QCvWAE1efMB/GvPbCZnsTzZOEjvDSR341Ld3MOgnegJFTCGJDuUm0wAAAABJRU5ErkJggg==';
      	var bird = new Image();
        bird.src = birdDataURI;
        game.cache.addImage('bird', birdDataURI, bird);

        var pipeDataURI ='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEWHxCUAAAAySQ1DYhJlkxt2qyBUehchMQk9s5QeAAAAiUlEQVQ4je2PPQqFMBCEh0RzDkHSB3xaW1kviL34e/8bmF2j0fp1kiEk7H7sZBZISvpP+aui8JZVaxobClX9ME8BOaCHCkT7eYfiJgt3Or78MS23TjeqYQhmtOxWa8J6/eiEYBd7/SLihnIUEt08kQSKNiExQTORpB6Q+f5mY2peLG6aPzZN+pYOXLMRI0lTo4MAAAAASUVORK5CYII=';
			 var pipe = new Image();
        pipe.src = pipeDataURI;
        game.cache.addImage('pipe', pipeDataURI, pipe);
      
      	//game.load.audio('jump', 'assets/jump.wav');
        //game.load.audio('oowh', 'assets/oowh.wav');
        //game.load.audio('bump', 'assets/bump.wav');
    },

    create: function() {
        // When all assets are loaded, go to the 'menu' state
        game.state.start('menu');
    }
};

var menu_state = {
    create: function() {
        // Call the 'start' function when pressing the spacebar
        var space_key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.start, this);

        // Defining variables
        var style = { font: "16px 'Press Start 2P'", fill: "#ffffff" };
        var x = game.world.width/2, y = game.world.height/2;

        // Adding a text centered on the screen
        var text = game.add.text(x, y-50, "Space to start", style);
        text.anchor.setTo(0.5, 0.5);

        // If the user already played
        if (score > 0) {
            // Display its score
            var score_label = game.add.text(x, y+50, "score: " + score, style);
            score_label.anchor.setTo(0.5, 0.5);
        }
    },

    // Start the actual game
    start: function() {
        game.state.start('play');
    }
};

var play_state = {
    create: function() {
    	game.physics.startSystem(Phaser.Physics.ARCADE);

		var space_key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    	space_key.onDown.add(this.jump, this);

    	pipes = game.add.group();
        pipes.createMultiple(40, 'pipe');
        pipes.setAll('outOfBoundsKill', true);
        pipes.setAll('checkWorldBounds', true);


    	// Fuction called after 'preload' to setup the game
    	bird = game.add.sprite(100, 245, 'bird');
		game.physics.enable( [ bird, pipes ], Phaser.Physics.ARCADE);
		bird.body.gravity.y = 1000;
		bird.anchor.setTo(-0.2, 0.5);

    	timer = game.time.events.loop(1500, this.add_row_of_pipes, this);

		score = 0;
		var style = { font: "30px 'Press Start 2P'", fill: "#ffffff"};
		label_score = game.add.text(20, 20, "0", style);

		//jump_sound = game.add.audio('jump');
		//bump_sound = game.add.audio('bump');
		//oowh_sound = game.add.audio('oowh');
		//hit_sound = false;
    },

    update: function() {
		// Function called 60 times per second
		if (bird.inWorld == false)
			this.restart_game();

		game.physics.arcade.overlap(bird, pipes, this.hit_pipe, null, this);

		if (bird.angle < 20)
    		bird.angle += 1;
    },

    jump: function() {
    	if (bird.alive == false)
    		return;
    	//jump_sound.play();
    	// Add a vertical velocity to the bird
    	bird.body.velocity.y = -350;
    	// create an animation on the bird
		game.add.tween(bird).to({angle: -20}, 100).start();
	},

	// Restart the game
	restart_game: function() {
		game.time.events.remove(timer);
	    // Start the 'main' state, which restarts the game
	    game.state.start('menu');
	},

	add_one_pipe: function(x, y) {
	    // Get the first dead pipe of our group
	    var pipe = pipes.getFirstDead();

	    // Set the new position of the pipe
	    pipe.reset(x, y);

	    // Add velocity to the pipe to make it move left
	    pipe.body.velocity.x = -200;

	    // Kill the pipe when it's no longer visible
	    //pipe.outOfBoundsKill = true;
	},

	add_row_of_pipes: function() {
		var hole = Math.floor(Math.random()*5)+1;

		for (var i = 0; i < 8; i++)
			if (i != hole && i != hole +1)
				this.add_one_pipe(400, i*60+10);

		score += 1;
		label_score.text = score;
	},

	hit_pipe: function() {
		//if( hit_sound == false) {
			//oowh_sound.play();
			//bump_sound.play();
		//	hit_sound = true;
	   // }
	    // If the bird has already hit a pipe, we have nothing to do
	    if (bird.alive == false)
	        return;

	    // Set the alive property of the bird to false
	    bird.alive = false;

	    // Prevent new pipes from appearing
	    game.time.events.remove(timer);

	    // Go through all the pipes, and stop their movement
	    pipes.forEachAlive(function(p){
	        p.body.velocity.x = 0;
	    }, this);
	},

};

// Initialize Phaser
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');

// Our 'score' global variable
var score = 0;

// Define all the states
game.state.add('load', load_state);
game.state.add('menu', menu_state);
game.state.add('play', play_state);

// Start with the 'load' state
game.state.start('load');