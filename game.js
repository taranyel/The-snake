class Canvas {
    canvas = document.getElementById("canvas");
    context = this.canvas.getContext("2d")
    cell_size = 35;
    cell_amount = 14;

    drawGrid() {
        for (let x = 0; x < this.canvas.height; x += this.cell_size) {
            for (let y = 0; y < this.canvas.width; y += this.cell_size) {
                this.context.fillStyle = this.getColor(x, y);
                this.context.fillRect(x, y, this.cell_size, this.cell_size);
            }
        }
    }

    getColor(x, y) {
        let color;
        if ((y % 2) === 0) {
            if ((x % 2) === 0) {
                color = ["156", "204", "45"];
            } else {
                color = ["75", "120", "30"];
            }
        } else {
            if ((x % 2) === 0) {
                color = ["75", "120", "30"];
            } else {
                color = ["156", "204", "45"];
            }
        }
        return "rgb(" + color[0] + "," + color[1] + "," + color[2] + "," + "80%)";
    }
}


class Coordinates {
    x;
    y;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Direction extends Coordinates {
    name;

    constructor(x, y, name) {
        super(x, y);
        this.name = name;
    }
}

class Snake {
    body = [];
    direction;
    minimal_move = canvas.cell_size;

    constructor() {
        this.direction = new Direction(this.minimal_move, 0, "right");
        this.body.push(new Coordinates(0, canvas.cell_size));
    }

    createSnake() {
        canvas.context.fillStyle = "#041530";
        canvas.context.fillRect(0, this.minimal_move, canvas.cell_size, canvas.cell_size);
    }

    checkBorder(current_coordinate, direction) {
        if ((current_coordinate === canvas.cell_size * (canvas.cell_amount - 1)) && (direction === this.minimal_move)) {
            return [0, 0];
        } else if ((current_coordinate === 0) && (direction === -this.minimal_move)) {
            return [canvas.cell_size * (canvas.cell_amount - 1), 0];
        }
        return [current_coordinate, direction];
    }

    grow() {
        let new_x = 0;
        let new_y = 0;

        switch (this.direction.name) {
            case "right":
                new_x = this.body[this.body.length - 1].x - this.minimal_move;
                new_y = this.body[this.body.length - 1].y;
                break;
            case "left":
                new_x = this.body[this.body.length - 1].x + this.minimal_move;
                new_y = this.body[this.body.length - 1].y;
                break;
            case "up":
                new_x = this.body[this.body.length - 1].x;
                new_y = this.body[this.body.length - 1].y + this.minimal_move;
                break;
            case "down":
                new_x = this.body[this.body.length - 1].x;
                new_y = this.body[this.body.length - 1].y - this.minimal_move;
                break;
        }

        this.body.push(new Coordinates(new_x, new_y));
    }
}

class Food extends Coordinates {
    constructor() {
        super(0, 0);
    }
}

class Game {
    snake_id;
    food_id;
    snake;
    score;
    record;
    food;
    speed;
    timer_start;
    timer_end;
    score_block
    game_block;
    nav;

    constructor() {
        document.body.addEventListener('keydown', this);
        this.score = document.getElementById("score");
        this.record = document.getElementById("record");
        this.score_block = document.querySelector(".score");
        this.nav = document.querySelector("nav");
        this.game_block = document.querySelector(".game_block");


        this.init();

        if (sessionStorage.getItem("logged_in") !== null) {
            this.displayRecord(JSON.parse(localStorage[this.getUser()]).record);
        }
    }

    handleEvent(e) {
        if (e.type === "keydown") {
            this.keydown(e);
        }
    }

    keydown(e) {
        const key = e.code;
        switch (key) {
            case 'ArrowUp':
                this.snake.direction.name = "up";
                this.snake.direction.x = 0;
                this.snake.direction.y = -this.snake.minimal_move;
                break;

            case 'ArrowDown':
                this.snake.direction.name = "down";
                this.snake.direction.x = 0;
                this.snake.direction.y = this.snake.minimal_move;
                break;

            case 'ArrowRight':
                this.snake.direction.name = "right";
                this.snake.direction.x = this.snake.minimal_move;
                this.snake.direction.y = 0;
                break;

            case 'ArrowLeft':
                this.snake.direction.name = "left";
                this.snake.direction.x = -this.snake.minimal_move;
                this.snake.direction.y = 0;
                break;
        }
    }

    init() {
        this.snake = new Snake();
        this.snake_id = 0;
        this.food_id = 0;
        this.food = [];
        this.speed = 300;
        this.timer_start = Date.now();

        this.score_block.classList.remove("game_over_score");
        this.game_block.classList.remove("game_over")
        const game_over_h = document.getElementById("game_over_h");
        if (game_over_h) {
            this.score_block.removeChild(game_over_h);
            this.score_block.removeChild(new_game);
        }
        this.displayScore(0);
    }

    controlSpeed() {
        this.timer_end = Date.now();

        if (this.timer_end - this.timer_start >= 15000) {
            if (this.speed >= 60) {
                this.speed -= 30;
                clearInterval(this.snake_id);
                this.snake_id = setInterval(this.moveSnake.bind(this), this.speed);
                this.timer_start = Date.now();
            }
        }
    }

    startGame() {
        this.clearCanvas();
        this.clearIntervals();
        this.init();
        this.showPauseGameButton();
        this.showFinishGameButton();
        this.hideContinueGameButton();
        this.hideNewGameButton();

        const game_block = document.querySelector(".game");
        game_block.style.display = "flex";
        this.nav.classList.remove("start");
        this.snake.createSnake();
        this.snake_id = setInterval(this.moveSnake.bind(this), this.speed);
        this.food_id = setInterval(this.generateFood.bind(this), 4000);
    }

    pauseGame() {
        this.showFinishGameButton();
        this.showContinueGameButton();
        this.hidePauseGameButton();
        this.hideNewGameButton();
        this.clearIntervals();
        document.body.removeEventListener('keydown', this);
    }

    finishGame() {
        this.hideFinishGameButton();
        this.hidePauseGameButton();
        this.hideContinueGameButton();
        this.showNewGameButton();
        this.clearIntervals();
        this.setRecord();
        this.showGameOver("Game ended");
    }

    continueGame() {
        this.showFinishGameButton();
        this.hideContinueGameButton();
        this.hideNewGameButton();
        this.showPauseGameButton();
        document.body.addEventListener('keydown', this);
        this.snake_id = setInterval(this.moveSnake.bind(this), this.speed);
        this.food_id = setInterval(this.generateFood.bind(this), 4000);
    }

    generateFood() {
        const food = new Food();
        this.drawFood(food);
        this.food.push(food);
    }

    isIn(x, y, array, start) {
        for (let i = start; i < array.length; i++) {
            if ((array[i].x === x) && (array[i].y === y)) {
                return true;
            }
        }
        return false;
    }

    drawFood(food) {
        let i = this.getRandomInt() * canvas.cell_size;
        let j = this.getRandomInt() * canvas.cell_size;

        while (this.isIn(i, j, this.snake.body, 0) || this.isIn(i, j, this.food, 0)) {
            i = this.getRandomInt() * canvas.cell_size;
            j = this.getRandomInt() * canvas.cell_size;
        }

        food.x = i;
        food.y = j;

        const image = document.getElementById("food_icon");
        canvas.context.drawImage(image, food.x, food.y, canvas.cell_size, canvas.cell_size);
        // canvas.canvas_context.fillStyle = "red";
        // canvas.canvas_context.fillRect(food.x, food.y, canvas.cell_size, canvas.cell_size);

        //setTimeout(this.removeFood.bind(this, food), 4000);
    }

    getRandomInt() {
        return Math.floor(Math.random() * canvas.cell_amount);
    }

    removeFood(food) {
        canvas.context.clearRect(food.x, food.y, canvas.cell_size, canvas.cell_size);
        canvas.context.strokeRect(food.x, food.y, canvas.cell_size, canvas.cell_size);
    }

    displayScore(score) {
        this.score.textContent = score;
    }

    displayRecord(record) {
        this.record.textContent = record;
    }

    eatFood() {
        for (let i = 0; i < this.food.length; i++) {
            if ((this.snake.body[0].x === this.food[i].x) && (this.snake.body[0].y === this.food[i].y)) {
                const sound = document.getElementById("eating_sound");
                sound.play();
                this.snake.grow();
                this.food.splice(i, 1);
                this.displayScore(this.snake.body.length - 1);
                return;
            }
        }
    }

    clearCanvas() {
        for (let i = 0; i < this.snake.body.length; i++) {
            canvas.context.clearRect(this.snake.body[i].x, this.snake.body[i].y, canvas.cell_size, canvas.cell_size);
            canvas.context.fillStyle = canvas.getColor(this.snake.body[i].x, this.snake.body[i].y);
            canvas.context.fillRect(this.snake.body[i].x, this.snake.body[i].y, canvas.cell_size, canvas.cell_size);
        }

        for (let i = 0; i < this.food.length; i++) {
            canvas.context.clearRect(this.food[i].x, this.food[i].y, canvas.cell_size, canvas.cell_size);
            canvas.context.fillStyle = canvas.getColor(this.food[i].x, this.food[i].y);
            canvas.context.fillRect(this.food[i].x, this.food[i].y, canvas.cell_size, canvas.cell_size);
        }
    }

    getUser() {
        return sessionStorage.getItem("logged_in");
    }

    setRecord() {
        const current_score = this.snake.body.length - 1;
        const user = JSON.parse(localStorage[this.getUser()]);
        if (current_score > user.record) {
            user.record = current_score;
            localStorage.removeItem(user.username);
            localStorage.setItem(user.username, JSON.stringify(user));
        }

        this.displayRecord(JSON.parse(localStorage[user.username]).record);
    }

    clearIntervals() {
        clearInterval(this.snake_id);
        clearInterval(this.food_id);
    }

    showGameOver(message) {
        this.score_block.classList.add("game_over_score");
        const game_over_h = document.createElement("h1");
        game_over_h.textContent = message;
        game_over_h.id = "game_over_h";
        this.score_block.append(new_game);
        this.score_block.append(game_over_h);
        this.game_block.classList.add("game_over")
    }

    isGameOver() {
        if (this.isIn(this.snake.body[0].x, this.snake.body[0].y, this.snake.body, 1)) {
            this.clearIntervals();
            this.setRecord();
            this.showNewGameButton();
            this.hideFinishGameButton();
            this.hidePauseGameButton();
            this.hideContinueGameButton();
            this.showGameOver("Game over");
            const sound = document.getElementById("game_over_sound");
            sound.play();
        }
    }

    moveSnake() {
        let head = new Coordinates(this.snake.body[0].x, this.snake.body[0].y);

        let check_border = this.snake.checkBorder(this.snake.body[0].x, this.snake.direction.x);
        this.snake.body[0].x = check_border[0];
        let current_direction_x = check_border[1];

        check_border = this.snake.checkBorder(this.snake.body[0].y, this.snake.direction.y);
        this.snake.body[0].y = check_border[0];
        let current_direction_y = check_border[1];

        this.snake.body[0].x += current_direction_x;
        this.snake.body[0].y += current_direction_y;

        this.controlSpeed();
        this.eatFood();
        this.isGameOver();

        canvas.context.fillStyle = "#041530";
        canvas.context.fillRect(this.snake.body[0].x, this.snake.body[0].y, canvas.cell_size, canvas.cell_size);

        for (let i = 1; i < this.snake.body.length; i++) {
            let temp = this.snake.body[i];
            this.snake.body[i] = head;

            canvas.context.fillStyle = "#041530";
            canvas.context.fillRect(this.snake.body[i].x, this.snake.body[i].y, canvas.cell_size, canvas.cell_size);

            head = temp;
        }

        canvas.context.clearRect(head.x, head.y, canvas.cell_size, canvas.cell_size);
        canvas.context.fillStyle = canvas.getColor(head.x, head.y);
        canvas.context.fillRect(head.x, head.y, canvas.cell_size, canvas.cell_size);
        //canvas.context.strokeRect(head.x, head.y, canvas.cell_size, canvas.cell_size);
    }

    showNewGameButton() {
        new_game.style.display = "block";
    }

    showPauseGameButton() {
        pause_game.style.display = "block";
    }

    showFinishGameButton() {
        finish_game.style.display = "block";
    }

    showContinueGameButton() {
        continue_game.style.display = "block";
    }

    hideNewGameButton() {
        new_game.style.display = "none";
    }

    hidePauseGameButton() {
        pause_game.style.display = "none";
    }

    hideFinishGameButton() {
        finish_game.style.display = "none";
    }

    hideContinueGameButton() {
        continue_game.style.display = "none";
    }
}

const canvas = new Canvas();
canvas.drawGrid();

const game = new Game();
new_game = document.getElementById("new_game");
pause_game = document.getElementById("pause_game");
finish_game = document.getElementById("finish_game");
continue_game = document.getElementById("continue_game");

new_game.addEventListener("click", game.startGame.bind(game));
pause_game.addEventListener("click", game.pauseGame.bind(game));
finish_game.addEventListener("click", game.finishGame.bind(game));
continue_game.addEventListener("click", game.continueGame.bind(game));

game.showNewGameButton();
game.hideFinishGameButton();
game.hidePauseGameButton();
game.hideContinueGameButton();
