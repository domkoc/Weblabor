export class Guesses {
    constructor() {
        this.clear();
    }

    addGuess(num, value) {
        if (num && value) {
            this.guesses.push({ num, value });
            this.render();
        }
    }

    clear() {
        this.guesses = [];
        this.render();
    }

    render() {
        $('#guesses tbody tr').remove();
        $('#guesses tbody').append(this.guesses.map((g, i) => $(
            `<tr>
                <td>${i + 1}</td>
                <td class='text-right'>${g.num}</td>
                <td class='bg-${g.value === 'correct' ? 'success' : 'danger'}'>${g.value === 'correct' ? '!!!' : g.value === 'less' ? '&gt;' : '&lt;'}</td>
            </tr>`
        )).reverse());
    }
}