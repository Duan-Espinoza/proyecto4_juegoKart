//File: server/models/Player.js
class Player {
    
    constructor(name) {
    this.name = name;

}

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    toString() {
        return `Player: ${this.name}`;
    }

}