export class Guess {
    constructor(game) {
        $('#guess-form').on('submit', e => {
            e.preventDefault();
            const value = parseInt($('#guess-input').val());
            if (!isNaN(value) && value > 0 && value <= 100)
                game.onGuessing(value);
            $('#guess-form')[0].reset();
        });
        $('#guess-form')[0].reset();
        this.setEnabled(false);
    }

    setEnabled(value) {
        this.enabled = !!value;
        this.render();
    }

    render() {
        const elements = $('#guess-input, #guess-button')
        if (!this.enabled) {
            elements.attr('disabled', 'disabled');
        } else {
            elements.removeAttr('disabled');
            $('#guess-input').focus();
        }
    }
}