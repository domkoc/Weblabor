import { Player } from './player';
import { Timer } from './timer';
import { Logic } from './logic';
import { Guesses } from './guesses';
import { Guess } from './guess';

export class Game {
    constructor() {
        this.timer = new Timer();
        this.player = new Player();
        this.logic = new Logic(this);
        this.guesses = new Guesses();
        this.guess = new Guess(this);

        this.player.onNameSet.then(() => this.start());

        this.components = [this.timer, this.player, this.logic, this.guesses, this.guess];

        this.render();
    }

    render() {
        this.components.map(c => c && typeof (c.render) === 'function' && c.render());
    }

    start() {
        this.timer.start();
        this.guess.setEnabled(true);
        this.logic.startGame();
    }

    onGuessed(num, guess) {
        this.guesses.addGuess(num, guess);
        if (guess === 'correct') {
            this.guess.setEnabled(false);
            this.timer.stop();
        }
    }

    onGuessing(num) {
        this.logic.guess(num);
    }
}