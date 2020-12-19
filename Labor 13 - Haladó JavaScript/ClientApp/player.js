export class Player {
    constructor() {
        this.onNameSet = new Promise((resolve, reject) => {
            $('#start-form').on('submit', e => {
                e.preventDefault();
                const name = $('#name-input').val();
                if (name && name.length) {
                    resolve(name);
                }
                else {
                    reject();
                }
            });
        });

        this.onNameSet.then(name => {
            this.name = name;
            this.render();
        });
    }

    render() {
        const elements = $('#name-input, #start-button')
        if (this.name && this.name.length) {
            elements.attr('disabled', 'disabled');
        } else {
            elements.removeAttr('disabled');
        }
    }
}