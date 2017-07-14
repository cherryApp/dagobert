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
        fps: 100
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
            x: 30,
            y: 50
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