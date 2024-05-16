/**
 * Class represents game board (canvas).
 */
class Canvas {
    canvas = document.querySelector("canvas");
    context = this.canvas.getContext("2d")
    cell_size = 35;
    cell_amount = 14;


    /**
     * Draws grid on the game board.
     */
    drawGrid() {
        for (let x = 0; x < this.canvas.height; x += this.cell_size) {
            for (let y = 0; y < this.canvas.width; y += this.cell_size) {
                this.context.fillStyle = this.getColor(x, y);
                this.context.fillRect(x, y, this.cell_size, this.cell_size);
            }
        }
    }


    /**
     * Decides with which color will be filled cell on the game board.
     *
     * @param x - x coordinate on the game board
     * @param y - y coordinate on the game board
     * @returns {String} - returns color in rgb format
     */
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


/**
 * Class represents coordinates on the game board.
 */
class Coordinates {
    x;
    y;


    /**
     * - Constructor
     * @param x - x coordinate on the game board
     * @param y - y coordinate on the game board
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


/**
 * Class represents snake direction on the game board, extends Coordinates class.
 */
class Direction extends Coordinates {
    name;


    /**
     * Constructor
     *
     * @param x - x coordinate on the game board
     * @param y - y coordinate on the game board
     * @param name - direction name, can be: <b>right, left, up, down</b>
     */
    constructor(x, y, name) {
        super(x, y);
        this.name = name;
    }
}


/**
 * Class represents snake on the gme board.
 */
class Snake {
    body = [];
    direction;
    minimal_move = canvas.cell_size;

    /**
     * Constructor, creates snake and sets <b>right</b> as default snake direction
     */
    constructor() {
        this.direction = new Direction(this.minimal_move, 0, "right");
        this.body.push(new Coordinates(0, canvas.cell_size));
    }


    /**
     * Draws new snake on the game board.
     */
    createSnake() {
        canvas.context.fillStyle = "#041530";
        canvas.context.fillRect(0, this.minimal_move, canvas.cell_size, canvas.cell_size);
    }


    /**
     * Checks if snake crosses border of the game board.
     *
     * @param current_coordinate - current <b>x</b> or <b>y</b> snake coordinate on the game board
     * @param direction - current snake direction
     * @returns {number[]|*[]} - returns new snake coordinates
     */
    checkBorder(current_coordinate, direction) {
        if ((current_coordinate === canvas.cell_size * (canvas.cell_amount - 1)) && (direction === this.minimal_move)) {
            return [0, 0];
        } else if ((current_coordinate === 0) && (direction === -this.minimal_move)) {
            return [canvas.cell_size * (canvas.cell_amount - 1), 0];
        }
        return [current_coordinate, direction];
    }


    /**
     * Increases snake according to its directory.
     */
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


/**
 * Class represents food on the game board, extends Coordinates class.
 * Every food item has its own coordinates on the game board.
 */
class Food extends Coordinates {

    /**
     * Constructor
     */
    constructor() {
        super(0, 0);
    }
}


/**
 * Class manages game, shows user score and record.
 */
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


    /**
     * Constructor, sets <i>keydown</i> event to body, gets html elements from the document,
     * shows user record if user is logged in
     */
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


    /**
     * Handles events.
     *
     * @param e - event
     */
    handleEvent(e) {
        if (e.type === "keydown") {
            this.keydown(e);
        }
    }


    /**
     * Manages snake direction according to pressed key.
     *
     * @param e - key pressed
     */
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


    /**
     * Initialise variables for new game, sets timer to the current time.
     */
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


    /**
     * Controls snake speed, increases snake speed every 15 seconds.
     */
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


    /**
     * Starts new game.
     */
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


    /**
     * Pauses game.
     */
    pauseGame() {
        this.showFinishGameButton();
        this.showContinueGameButton();
        this.hidePauseGameButton();
        this.hideNewGameButton();
        this.clearIntervals();
        document.body.removeEventListener('keydown', this);
    }


    /**
     * Finishes game.
     */
    finishGame() {
        this.hideFinishGameButton();
        this.hidePauseGameButton();
        this.hideContinueGameButton();
        this.showNewGameButton();
        this.clearIntervals();
        this.setRecord();
        this.showEndGameScreen("The end");
    }


    /**
     * Continues game after pause.
     */
    continueGame() {
        this.showFinishGameButton();
        this.hideContinueGameButton();
        this.hideNewGameButton();
        this.showPauseGameButton();
        document.body.addEventListener('keydown', this);
        this.snake_id = setInterval(this.moveSnake.bind(this), this.speed);
        this.food_id = setInterval(this.generateFood.bind(this), 4000);
    }


    /**
     * Creates new food, adds new food to the food list.
     */
    generateFood() {
        const food = new Food();
        this.drawFood(food);
        this.food.push(food);
    }


    /**
     * Checks if given coordinates are in the given list of coordinates.
     *
     * @param x - given x coordinate on the game board
     * @param y - given x coordinate on the game board
     * @param array - given list of coordinates
     * @param start - start index, from which given coordinates will be searched in the given list of coordinates
     * @returns {boolean} - returns <b>true</b> if given coordinates are in the given list of coordinates,
     * otherwise returns <b>false</b>
     */
    isIn(x, y, array, start) {
        for (let i = start; i < array.length; i++) {
            if ((array[i].x === x) && (array[i].y === y)) {
                return true;
            }
        }
        return false;
    }


    /**
     * Generates random coordinates on the game board, checks if these coordinates are in snake, if not, draws new food
     * on these coordinates. Sets new coordinates to the food item.
     *
     * @param food - given food item
     */
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
    }


    /**
     * @returns {number} - returns new random int
     */
    getRandomInt() {
        return Math.floor(Math.random() * canvas.cell_amount);
    }


    /**
     * Sets score.
     *
     * @param score - score html element
     */
    displayScore(score) {
        this.score.textContent = score;
    }

    /**
     * Sets record.
     *
     * @param record - record html element
     */
    displayRecord(record) {
        this.record.textContent = record;
    }


    /**
     * Checks if any of generated food items are in the snake body, if yes represents "eating food by snake" -
     * grows snake body, removes "eaten" food item from list of food items. Also plays eating sound and updates score.
     */
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


    /**
     * Clears game board for new game.
     */
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


    /**
     * Gets currently logged-in user.
     *
     * @returns {String} - returns currently logged-in user
     */
    getUser() {
        return sessionStorage.getItem("logged_in");
    }


    /**
     * Sets new record for logged-in user after game.
     */
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


    /**
     * Stops snake.
     */
    clearIntervals() {
        clearInterval(this.snake_id);
        clearInterval(this.food_id);
    }


    /**
     * Shows "end game" screen when game is finished.
     *
     * @param message - message to show on the screen
     */
    showEndGameScreen(message) {
        this.score_block.classList.add("game_over_score");
        const game_over_h = document.createElement("h1");
        game_over_h.textContent = message;
        game_over_h.id = "game_over_h";
        this.score_block.append(new_game);
        this.score_block.append(game_over_h);
        this.game_block.classList.add("game_over")
    }


    /**
     * Checks if game is over, if yes, stops snake, shows "game over" screen and plays game over sound.
     */
    isGameOver() {
        if (this.isIn(this.snake.body[0].x, this.snake.body[0].y, this.snake.body, 1)) {
            this.clearIntervals();
            this.setRecord();
            this.showNewGameButton();
            this.hideFinishGameButton();
            this.hidePauseGameButton();
            this.hideContinueGameButton();
            this.showEndGameScreen("Game over");

            const sound = document.getElementById("game_over_sound");
            sound.play();
        }
    }


    /**
     * Checks if user wins the game, if yes, shows victory screen and plays victory sound.
     */
    isVictory() {
        if (this.snake.body.length === canvas.cell_size * canvas.cell_size) {
            this.clearIntervals();
            this.setRecord();
            this.showNewGameButton();
            this.hideFinishGameButton();
            this.hidePauseGameButton();
            this.hideContinueGameButton();
            this.showEndGameScreen("Victory!!!");

            const sound = document.getElementById("victory_sound");
            sound.play();
        }
    }


    /**
     * Moves snake on the game board, checks if game is over or if user wins the game.
     */
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
        this.isVictory();

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
    }


    /**
     * Shows "new game" button.
     */
    showNewGameButton() {
        new_game.style.display = "block";
    }

    /**
     * Shows "pause game" button.
     */
    showPauseGameButton() {
        pause_game.style.display = "block";
    }

    /**
     * Shows "finish game" button.
     */
    showFinishGameButton() {
        finish_game.style.display = "block";
    }

    /**
     * Shows "continue game" button.
     */
    showContinueGameButton() {
        continue_game.style.display = "block";
    }

    /**
     * Hides "new game" button.
     */
    hideNewGameButton() {
        new_game.style.display = "none";
    }

    /**
     * Hides "pause game" button.
     */
    hidePauseGameButton() {
        pause_game.style.display = "none";
    }

    /**
     * Hides "finish game" button.
     */
    hideFinishGameButton() {
        finish_game.style.display = "none";
    }

    /**
     * Hides "continue game" button.
     */
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
