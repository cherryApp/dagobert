// Fő változók.
var Game = {};
var Keyboard = {};
var Component = {};

// Iránybillentyűk megadása.
Keyboard.Keymap = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

// Billentyű események.
Keyboard.ControllerEvents = function() {
    var self = this;
    this.pressKey = null;
    this.keymap = Keyboard.Keymap;

    // Billentyű lenyomás figyelése.
    document.onkeydown = function(event) {
        self.pressKey = event.which;
        console.log("pressKey", self.pressKey);
    }

    // Az utoljára lenyomott billentyű lekérése.
    this.getKey = function() {
        return this.keymap[this.pressKey];
    }
};

// Játéktér.
Component.Stage = function(canvas, conf) {
    // Settings.
    this.keyEvent = new Keyboard.ControllerEvents();
    this.width = canvas.width;
    this.height = canvas.height;
    this.length = [];
    this.food = {};
    this.score = 0;
    this.direction = 'right';
    this.conf = {
        cw: 10,
        size: 5,
        fps: 200
    };
};

// Kígyó.
Component.Snake = function(canvas, conf) {
    // A kígyó mozgástere.
    this.stage = new Component.Stage(canvas, conf);

    // Kígyó inicializálása.
    this.initSnake = function() {
        for (var i = 0; i < this.stage.conf.size; i++) {
            this.stage.length.push({ x: i, y: 0 });
        }
    };
    this.initSnake();

    // Étel inicializálása.
    this.initFood = function() {
        this.stage.food = {
            x: Math.round(
                Math.random()*(
                    (this.stage.width - this.stage.conf.cw) / this.stage.conf.cw
                )
            ),
            y: Math.round(
                Math.random()*(
                    (this.stage.height - this.stage.conf.cw) / this.stage.conf.cw
                )
            )
        }
    }
    this.initFood();

    // Játék újraindítása.
    this.restart = function() {
        this.stage.length = [];
        this.stage.food = {};
        this.stage.score = 0;
        this.stage.direction = 'right';
        this.stage.keyEvent.pressKey = null;
        this.initSnake();
        this.initFood();
    };
};

// Rajzolás.
Game.Draw = function(context, snake) {
    this.drawStage = function() {
        var keyPress = snake.stage.keyEvent.getKey();
        if (typeof keyPress != 'undefined') {
            snake.stage.direction = keyPress;
        }

        // A játék hátterét fehérre satírozzuk.
        context.fillStyle = "white";
        context.fillRect(0, 0, snake.stage.width, snake.stage.height);

        // A kígyó pozíciója.
        var nx = snake.stage.length[0].x;
        var ny = snake.stage.length[0].y;

        // A pozíció változtatása a haladási irány alapján.
        switch(snake.stage.direction) {
            case 'right': nx++;
                break;
            case 'left': nx--;
                break;
            case 'up': ny--;
                break;
            case 'down': ny++;
                break;
        }

        // Ütközés figyelése.
        if (this.collision(nx, ny)) {
            snake.restart();
            return;
        }

        // A kígyó etetése.
        if (nx == snake.stage.food.x && ny == snake.stage.food.y) {
            var tail = {x: nx, y: ny};
            snake.stage.score++;
            snake.stage.conf.fps -= 40;
            snake.initFood();
        } else {
            var tail = snake.stage.length.pop();
            tail.x = nx;
            tail.y = ny;
        }
        snake.stage.length.unshift(tail);

        // Kígyó kirajzolása.
        for (var i = 0; i < snake.stage.length.length; i++) {
            var cell = snake.stage.length[i];
            this.drawCell(cell.x, cell.y);
        }

        // Eledel rajzolása.
        this.drawCell(snake.stage.food.x, snake.stage.food.y);

        // Pontszám megjelenítése.
        context.fillText('Score: ' + snake.stage.score, 5, (snake.stage.height-5));
    };

    // Cella rajzolása.
    this.drawCell = function(x, y) {
        context.fillStyle = 'rgb(170, 170, 170)';
        context.beginPath();
        context.arc(
            (x * snake.stage.conf.cw + 6),
            (y * snake.stage.conf.cw + 6),
            4,
            0,
            2 * Math.PI,
            false
        );
        context.fill();
    };

    // Ütközés megállapítása.
    this.collision = function(nx, ny) {
        if (nx == -1 || nx == (snake.stage.width / snake.stage.conf.cw) || 
            ny == -1 || ny == (snake.stage.height / snake.stage.conf.cw) )
        {
            return true;
        } else {
            return false;
        }
    };
};

// Játék indítása.
Game.Snake = function(elementId, conf) {
    // Beállítások.
    var canvas = document.getElementById(elementId);
    var context = canvas.getContext("2d");
    var snake = new Component.Snake(canvas, conf);
    var gameDraw = new Game.Draw(context, snake);
    var intval = 0;

    // Game interval.
    this.setSpeed = function(speed) {
        speed = speed || snake.stage.conf.fps;
        var intval = setInterval(function() {
            gameDraw.drawStage();
        }, speed);
    }
    this.setSpeed();
};

var snake = new Game.Snake('stage', {fps: 100, size: 4});