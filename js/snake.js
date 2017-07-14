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