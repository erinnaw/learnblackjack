"use-strict";

class Card {
    constructor(id, name, value, img, qty, ev) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.img = img;
        this.qty = qty;
        this.ev = ev;
    }

    set_qty(qty) {
        this.qty = qty;
    }

    decrement_qty() {
        this.qty--;
    }

    get_ev() {
        return this.ev;
    }

    get_qty() {
        return this.qty;
    }

    get_value() {
        return this.value;
    }

    get_image() {
        return this.img;
    }

    get_name() {
        return this.name;
    }
}

class Deck {
    constructor() {
        this.c2 = new Card(0, "2", 2, "static/image/2.png", 4, 1);
        this.c3 = new Card(1, "3", 3, "static/image/3.png", 4, 1);
        this.c4 = new Card(2, "4", 4, "static/image/4.png", 4, 1);
        this.c5 = new Card(3, "5", 5, "static/image/5.png", 4, 1);
        this.c6 = new Card(4, "6", 6, "static/image/6.png", 4, 1);
        this.c7 = new Card(5, "7", 7, "static/image/7.png", 4, 0);
        this.c8 = new Card(6, "8", 8, "static/image/8.png", 4, 0);
        this.c9 = new Card(7, "9", 9, "static/image/9.png", 4, 0);
        this.c10 = new Card(8, "10", 10, "static/image/10.png", 4, -1);
        this.cj = new Card(9, "J", 10, "static/image/j.png", 4, -1);
        this.cq = new Card(10, "Q", 10, "static/image/q.png", 4, -1);
        this.ck = new Card(11, "K", 10, "static/image/k.png", 4, -1);
        this.ca = new Card(12, "A", 11, "static/image/a.png", 4, -1);

        this.cards = new Map();
        this.cards.set(0, this.c2);
        this.cards.set(1, this.c3);
        this.cards.set(2, this.c4);
        this.cards.set(3, this.c5);
        this.cards.set(4, this.c6);
        this.cards.set(5, this.c7);
        this.cards.set(6, this.c8);
        this.cards.set(7, this.c9);
        this.cards.set(8, this.c10);
        this.cards.set(9, this.cj);
        this.cards.set(10, this.cq);
        this.cards.set(11, this.ck);
        this.cards.set(12, this.ca);

        this.stack = [];

        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < 13; i++) {
                this.stack.push(i);
            }
        }
    }

    //Durstenfeld Shuffle Algorithm: Randomize array.
    shuffle() {
        for (let i = this.stack.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random(0, this.stack.length) * (i + 1));
            let temp = this.stack[i];
            this.stack[i] = this.stack[j];
            this.stack[j] = temp;
        }
    }

    pop() {
        return this.stack.pop();
    }

    reset() {
        this.c2.set_qty(4);
        this.c3.set_qty(4);
        this.c4.set_qty(4);
        this.c5.set_qty(4);
        this.c6.set_qty(4);
        this.c7.set_qty(4);
        this.c8.set_qty(4);
        this.c9.set_qty(4);
        this.c10.set_qty(4);
        this.cj.set_qty(4);
        this.cq.set_qty(4);
        this.ck.set_qty(4);
        this.ca.set_qty(4);

        this.stack = [];

        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < 13; i++) {
                this.stack.push(i);
            }
        }
    }
}

class Player {
    constructor() {
        this.card_shown = 0;
        this.cards = [];
    }

    add_card_shown(id) {
        this.card_shown = id;
    }

    push_cards(id) {
        this.cards.push(id);
    }

    calculate_hand() {
        let total = 0, a_counter = 0;
        let c1 = 0, c2 = 0;
        let calculations = [];

        //if card is an 'A'
        if (this.card_shown === 12) {
            a_counter++;
        }
        else {
            if (this.card_shown >= 0 && this.card_shown <= 8) {
                total += (this.card_shown + 2);
            }
            else if (this.card_shown >= 9 && this.card_shown <= 11) {
                total += 10;
            }
        }

        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i] === 12) {
                a_counter++;
            }
            else {
                if (this.cards[i] >= 0 && this.cards[i] <= 8) {
                    total += (this.cards[i] + 2);
                }
                else if (this.cards[i] >= 9 && this.cards[i] <= 11) {
                    total += 10;
                }
            }
        }

        c1 += total;

        if (a_counter === 1) {
            let c2_flag = false;

            if (total < 11) {
                c2_flag = true;
                c1 += 11;
            }
            else {
                c1 += 1;
            }

            if (c2_flag) {
                c2 = total + 1;
                calculations.push(c2);
            }
        }
        else if (a_counter > 1) {
            let c2_flag = false;

            if ((total + 11 + (a_counter - 1)) <= 21) {
                c2_flag = true;
                c1 = 11;

                for (let i = 0; i < a_counter - 1; i++) {
                    c1 += 1;
                }
            }
            else {
                for (let i = 0; i < a_counter - 1; i++) {
                    c1 += 1;
                }
            }

            if (c2_flag) {
                for (let i = 0; i < a_counter - 1; i++) {
                    c2 = total + 1;
                }

                calculations.push(c2);
            }
        }

        calculations.push(c1);

        return calculations;
    }

    calculate_hand_best() {
        let total = 0;
        let a_counter = 0;

        //if card is an 'A'
        if (this.card_shown === 12) {
            a_counter++;
        }
        else {
            if (this.card_shown >= 0 && this.card_shown <= 8) {
                total += (this.card_shown + 2);
            }
            else if (this.card_shown >= 9 && this.card_shown <= 11) {
                total += 10;
            }
        }

        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i] === 12) {
                a_counter++;
            }
            else {
                if (this.cards[i] >= 0 && this.cards[i] <= 8) {
                    total += (this.cards[i] + 2);
                }
                else if (this.cards[i] >= 9 && this.cards[i] <= 11) {
                    total += 10;
                }
            }
        }

        if (a_counter === 1) {
            if (total < 11) {
                total += 11;
            }
            else {
                total += 1;
            }
        }
        else if (a_counter > 1) {
            if ((total + 11 + (a_counter - 1)) <= 21) {
                total = 11;

                for (let i = 0; i < a_counter - 1; i++) {
                    total += 1;
                }
            }
            else {
                for (let i = 0; i < a_counter - 1; i++) {
                    total += 1;
                }
            }
        }

        return total;
    }

    get_hand() {
        arr = new Array(this.cards);
        arr.push(this.card_shown);

        return arr;
    }

    empty_hand() {
        this.cards = [];
    }
}

class Game {
    constructor() {
        this.deck = new Deck();
        this.deck.shuffle();

        this.dealer = new Player();
        this.player = new Player();

        this.score = 0;
        this.bet = 10;
        this.ev_value = 0;
        this.bet = 10;
        this.bet_increment = 10;
        this.max_bet = 100;

        this.probabilities = new Map();
        this.probabilities.set(0, this.deck.cards.get(0).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(1, this.deck.cards.get(1).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(2, this.deck.cards.get(2).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(3, this.deck.cards.get(3).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(4, this.deck.cards.get(4).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(5, this.deck.cards.get(5).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(6, this.deck.cards.get(6).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(7, this.deck.cards.get(7).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(8, this.deck.cards.get(8).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(9, this.deck.cards.get(9).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(10, this.deck.cards.get(10).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(11, this.deck.cards.get(11).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(12, this.deck.cards.get(12).get_qty() / this.deck.stack.length * 100);

        this.recommendation = "None";

        this.print_probabilities();
        $('#EV-score').html(this.ev_value);
        this.update_scoreboard();
        this.update_recommendation();

        $('#hit').removeClass("active");
        $('#stand').removeClass("active");
        $('#doubledown').removeClass("active");
        $('#split').removeClass("active");

        $('#hit').addClass("inactive");
        $('#stand').addClass("inactive");
        $('#doubledown').addClass("inactive");
        $('#split').addClass("inactive");

        $('#bet-amount').html(this.bet);
        $('#total-cards').html(this.deck.stack.length);
        $('#game-text').html("");
        $('#endround-screen').css("visibility", "hidden");

        this.activate_bet_UI();
    }

    activate_bet_UI() {
        $('#c1').css("visibility", "hidden");
        $('#c2').css("visibility", "hidden");
        $('#arrow-left').css("visibility", "visible");
        $('#arrow-right').css("visibility", "visible");
        $('#arrow-left').on('click');
        $('#arrow-right').on('click');
        $('#bet-amount').on('click');
        $('#bet-amount').css("visibility", "visible");
        $('#bet-amount').on('mouseover');
        $('#bet-amount').html(this.bet);

        $('#arrow-left').on("click", () => {

            if (this.bet >= this.bet_increment * 2) {
                this.bet -= this.bet_increment;
                $('#bet-amount').html(this.bet);
            }
        });

        $('#arrow-right').on("click", () => {
            if (this.bet <= this.max_bet - this.bet_increment) {
                this.bet += this.bet_increment;
                $('#bet-amount').html(this.bet);
            }
        });

        $('#bet-amount').on("mouseover", () => {
            $('#bet-amount').html("Start");

        }).on("mouseout", () => {
            $('#bet-amount').html(this.bet);

        }).on("click", () => {
            //hide bet_amount UI 
            $('#bet-amount').html(this.bet);
            this.deactive_bet_UI();
            this.start_game();
        });
    }

    deactive_bet_UI() {
        $('#arrow-left').off('click');
        $('#arrow-right').off('click');
        $('#arrow-left').css("visibility", "hidden");
        $('#arrow-right').css("visibility", "hidden");
        $('#bet-amount').off('click');
        $('#bet-amount').css("visibility", "hidden");
        $('#bet-amount').off('mouseover');
        $('#c1').css("visibility", "visible");
        $('#c2').css("visibility", "visible");
    }

    update_probabilities_flipped_cards(id) {
        this.deck.cards.get(id).decrement_qty();
        this.probabilities.set(id, this.deck.cards.get(id).get_qty() / this.deck.stack.length * 100);

        $(`#card-${this.deck.cards.get(id).get_name()}`).html(this.probabilities.get(id).toFixed(2));
        $(`#card-left-${this.deck.cards.get(id).get_name()}`).html(this.deck.cards.get(id).get_qty());

        $(`#card-${this.deck.cards.get(id).get_name()}`).removeClass("highlight");
        $(`#card-left-${this.deck.cards.get(id).get_name()}`).removeClass("highlight");
        $(`#card-${this.deck.cards.get(id).get_name()}`).addClass("highlight");
        $(`#card-left-${this.deck.cards.get(id).get_name()}`).addClass("highlight");
    }

    set_probabilities_all_cards() {
        this.probabilities.set(0, this.deck.cards.get(0).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(1, this.deck.cards.get(1).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(2, this.deck.cards.get(2).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(3, this.deck.cards.get(3).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(4, this.deck.cards.get(4).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(5, this.deck.cards.get(5).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(6, this.deck.cards.get(6).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(7, this.deck.cards.get(7).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(8, this.deck.cards.get(8).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(9, this.deck.cards.get(9).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(10, this.deck.cards.get(10).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(11, this.deck.cards.get(11).get_qty() / this.deck.stack.length * 100);
        this.probabilities.set(12, this.deck.cards.get(12).get_qty() / this.deck.stack.length * 100);
    }

    print_probabilities() {
        $('#card-2').html(this.probabilities.get(0).toFixed(2));
        $('#card-3').html(this.probabilities.get(1).toFixed(2));
        $('#card-4').html(this.probabilities.get(2).toFixed(2));
        $('#card-5').html(this.probabilities.get(3).toFixed(2));
        $('#card-6').html(this.probabilities.get(4).toFixed(2));
        $('#card-7').html(this.probabilities.get(5).toFixed(2));
        $('#card-8').html(this.probabilities.get(6).toFixed(2));
        $('#card-9').html(this.probabilities.get(7).toFixed(2));
        $('#card-10').html(this.probabilities.get(8).toFixed(2));
        $('#card-J').html(this.probabilities.get(9).toFixed(2));
        $('#card-Q').html(this.probabilities.get(10).toFixed(2));
        $('#card-K').html(this.probabilities.get(11).toFixed(2));
        $('#card-A').html(this.probabilities.get(12).toFixed(2));

        $('#card-left-2').html(this.deck.cards.get(0).get_qty());
        $('#card-left-3').html(this.deck.cards.get(1).get_qty());
        $('#card-left-4').html(this.deck.cards.get(2).get_qty());
        $('#card-left-5').html(this.deck.cards.get(3).get_qty());
        $('#card-left-6').html(this.deck.cards.get(4).get_qty());
        $('#card-left-7').html(this.deck.cards.get(5).get_qty());
        $('#card-left-8').html(this.deck.cards.get(6).get_qty());
        $('#card-left-9').html(this.deck.cards.get(7).get_qty());
        $('#card-left-10').html(this.deck.cards.get(8).get_qty());
        $('#card-left-J').html(this.deck.cards.get(9).get_qty());
        $('#card-left-Q').html(this.deck.cards.get(10).get_qty());
        $('#card-left-K').html(this.deck.cards.get(11).get_qty());
        $('#card-left-A').html(this.deck.cards.get(12).get_qty());
    }

    update_scoreboard() {
        $('#score').html(this.score);
        $('#bet').html(this.bet);

        if (this.score < 0) {
            $('#score').css("color", "red");
        }
        else if (this.score > 0) {
            $('#score').css("color", "green");
        }
        else {
            $('#score').css("color", "black");
        }
    }

    update_ev(id) {
        $(`#helper-${this.deck.cards.get(id).get_name()}`).removeClass("highlight");
        $(`#helper-${this.deck.cards.get(id).get_name()}`).addClass("highlight");

        this.ev_value += this.deck.cards.get(id).get_ev();
        $('#EV-score').html(this.ev_value);
    }

    update_recommendation() {
        //if ev <= -4, lower bet, means higher chance of low valued cards = bad chances
        //if ev >= 4, raise bet, means higher chance of high calued cards = good chances

        let output = "-";
        let result = "-";

        if (this.ev_value <= -4) {
            output = "Raise Bet<br>";
        }

        else if (this.ev_value >= 4) {
            output = "Lower Bet<br>";
        }

        else {
            output = "Neutral Bet<br>";
        }

        if (this.dealer.card_shown === 0) {
            if ((this.player.card_shown === 12 && (this.player.cards[0] >= 0 && this.player.cards[0] <= 4)) ||
                (this.player.cards[0] === 12 && (this.player.card_shown >= 0 && this.player.card_shown <= 4))) {
                result = "Hit";
            }
            else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 5 && this.player.cards[0] <= 8)) ||
                (this.player.cards[0] === 12 && (this.player.card_shown >= 5 && this.player.card_shown <= 8))) {
                result = "Stand";
            }
            else if ((this.player.card_shown === 12 && this.player.cards[0] === 12) ||
                (this.player.card_shown === 0 && this.player.cards[0] === 0) ||
                (this.player.card_shown === 1 && this.player.cards[0] === 1)) {
                result = "Split";
            }
            else if (this.player.card_shown === 2 && this.player.cards[0] === 2) {
                result = "Hit";
            }
            else if (this.player.card_shown === 3 && this.player.cards[0] === 3) {
                result = "Double Down";
            }
            else if ((this.player.card_shown >= 4 && this.player.card_shown <= 7) &&
                (this.player.cards[0] >= 4 && this.player.cards[0] <= 7) &&
                this.player.card_shown === this.player.cards[0]) {
                result = "Split";
            }
            else if ((this.player.card_shown >= 8 && this.player.card_shown <= 11) &&
                (this.player.cards[0] >= 8 && this.player.cards[0] <= 11)) {
                result = "Stand";
            }
        }
        else if (this.dealer.card_shown === 1) {
            if ((this.player.card_shown === 12 && (this.player.cards[0] >= 0 && this.player.cards[0] <= 3)) ||
                (this.player.cards[0] === 12 && (this.player.card_shown >= 0 && this.player.card_shown <= 3))) {
                result = "Hit";
            }
            else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 4 && this.player.cards[0] <= 5)) ||
                (this.player.cards[0] === 12 && (this.player.card_shown >= 4 && this.player.card_shown <= 5))) {
                result = "Double Down";
            }
            else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 6 && this.player.cards[0] <= 8)) ||
                (this.player.cards[0] === 12 && (this.player.card_shown >= 6 && this.player.card_shown <= 8))) {
                result = "Stand";
            }
            else if ((this.player.card_shown === 12 && this.player.cards[0] === 12) ||
                (this.player.card_shown === 0 && this.player.cards[0] === 0) ||
                (this.player.card_shown === 1 && this.player.cards[0] === 1)) {
                result = "Split";
            }
            else if (this.player.card_shown === 2 && this.player.cards[0] === 2) {
                result = "Hit";
            }
            else if (this.player.card_shown === 3 && this.player.cards[0] === 3) {
                result = "Double Down";
            }
            else if ((this.player.card_shown >= 4 && this.player.card_shown <= 7) &&
                (this.player.cards[0] >= 4 && this.player.cards[0] <= 7) &&
                this.player.card_shown === this.player.cards[0]) {
                result = "Split";
            }
            else if ((this.player.card_shown >= 8 && this.player.card_shown <= 11) &&
                (this.player.cards[0] >= 8 && this.player.cards[0] <= 11)) {
                result = "Stand";
            }
        }
        else if (this.dealer.card_shown === 2) {
            if ((this.player.card_shown === 12 && (this.player.cards[0] >= 0 && this.player.cards[0] <= 1)) ||
                (this.player.cards[0] === 12 && (this.player.card_shown >= 0 && this.player.card_shown <= 1))) {
                result = "Hit";
            }
            else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 2 && this.player.cards[0] <= 5)) ||
                (this.player.cards[0] === 12 && (this.player.card_shown >= 2 && this.player.card_shown <= 5))) {
                result = "Double Down";
            }
            else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 6 && this.player.cards[0] <= 8)) ||
                (this.player.cards[0] === 12 && (this.player.card_shown >= 6 && this.player.card_shown <= 8))) {
                result = "Stand";
            }
            else if ((this.player.card_shown === 12 && this.player.cards[0] === 12) ||
                (this.player.card_shown === 0 && this.player.cards[0] === 0) ||
                (this.player.card_shown === 1 && this.player.cards[0] === 1)) {
                result = "Split";
            }
            else if (this.player.card_shown === 2 && this.player.cards[0] === 2) {
                result = "Hit";
            }
            else if (this.player.card_shown === 3 && this.player.cards[0] === 3) {
                result = "Double Down";
            }
            else if ((this.player.card_shown >= 4 && this.player.card_shown <= 7) &&
                (this.player.cards[0] >= 4 && this.player.cards[0] <= 7) &&
                this.player.card_shown === this.player.cards[0]) {
                result = "Split";
            }
            else if ((this.player.card_shown >= 8 && this.player.card_shown <= 11) &&
                (this.player.cards[0] >= 8 && this.player.cards[0] <= 11)) {
                result = "Stand";
            }
        }
        else if (this.dealer.card_shown === 3 || this.dealer.card_shown === 4) {
            if ((this.player.card_shown === 12 && (this.player.cards[0] >= 0 && this.player.cards[0] <= 5)) ||
                (this.player.cards[0] === 12 && (this.player.card_shown >= 0 && this.player.card_shown <= 5))) {
                result = "Double Down";
            }
            else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 6 && this.player.cards[0] <= 8)) ||
                (this.player.cards[0] === 12 && (this.player.card_shown >= 6 && this.player.card_shown <= 8))) {
                result = "Stand";
            }
            else if ((this.player.card_shown === 12 && this.player.cards[0] === 12) ||
                (this.player.card_shown === 0 && this.player.cards[0] === 0) ||
                (this.player.card_shown === 1 && this.player.cards[0] === 1) ||
                (this.player.card_shown === 2 && this.player.cards[0] === 2)) {
                result = "Split";
            }
            else if (this.player.card_shown === 3 && this.player.cards[0] === 3) {
                result = "Double Down";
            }
            else if ((this.player.card_shown >= 4 && this.player.card_shown <= 7) &&
                (this.player.cards[0] >= 4 && this.player.cards[0] <= 7) &&
                this.player.card_shown === this.player.cards[0]) {
                result = "Split";
            }
            else if ((this.player.card_shown >= 8 && this.player.card_shown <= 11) &&
                (this.player.cards[0] >= 8 && this.player.cards[0] <= 11)) {
                result = "Stand";
            }
        }
        else if (this.dealer.card_shown === 5) {
            if ((this.player.card_shown === 12 && (this.player.cards[0] >= 0 && this.player.cards[0] <= 4)) ||
                (this.player.cards[0] === 12 && (this.player.card_shown >= 0 && this.player.card_shown <= 4))) {
                result = "Hit";
            }
            else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 5 && this.player.cards[0] <= 8)) ||
                (this.player.cards[0] === 12 && (this.player.card_shown >= 5 && this.player.card_shown <= 8))) {
                result = "Stand";
            }
            else if ((this.player.card_shown === 12 && this.player.cards[0] === 12) ||
                (this.player.card_shown === 0 && this.player.cards[0] === 0) ||
                (this.player.card_shown === 1 && this.player.cards[0] === 1)) {
                result = "Split";
            }
            else if (this.player.card_shown === 2 && this.player.cards[0] === 2) {
                result = "Hit";
            }
            else if (this.player.card_shown === 3 && this.player.cards[0] === 3) {
                result = "Double Down";
            }
            else if (this.player.card_shown === 4 && this.player.cards[0] === 4) {
                result = "Hit";
            }
            else if ((this.player.card_shown >= 5 && this.player.card_shown <= 6) &&
                (this.player.cards[0] >= 5 && this.player.cards[0] <= 6) &&
                this.player.card_shown === this.player.cards[0]) {
                result = "Split";
            }
            else if ((this.player.card_shown >= 7 && this.player.card_shown <= 11) &&
                (this.player.cards[0] >= 7 && this.player.cards[0] <= 11)) {
                result = "Stand";
            }
        }
        else if (this.dealer.card_shown === 6) {
            if ((this.player.card_shown === 12 && (this.player.cards[0] >= 0 && this.player.cards[0] <= 4)) ||
                (this.player.cards[0] === 12 && (this.player.card_shown >= 0 && this.player.card_shown <= 4))) {
                result = "Hit";
            }
            else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 5 && this.player.cards[0] <= 8)) ||
                (this.player.cards[0] === 12 && (this.player.card_shown >= 5 && this.player.card_shown <= 8))) {
                result = "Stand";
            }
            else if (this.player.card_shown === 12 && this.player.cards[0] === 12) {
                result = "Split";
            }
            else if ((this.player.card_shown === 0 && this.player.cards[0] === 0) ||
                (this.player.card_shown === 1 && this.player.cards[0] === 1) ||
                (this.player.card_shown === 2 && this.player.cards[0] === 2)) {
                result = "Hit";
            }
            else if (this.player.card_shown === 3 && this.player.cards[0] === 3) {
                result = "Double Down";
            }
            else if ((this.player.card_shown === 4 && this.player.cards[0] === 4) ||
                (this.player.card_shown === 5 && this.player.cards[0] === 5)) {
                result = "Hit";
            }
            else if ((this.player.card_shown >= 6 && this.player.card_shown <= 7) &&
                (this.player.cards[0] >= 6 && this.player.cards[0] <= 7) &&
                this.player.card_shown === this.player.cards[0]) {
                result = "Split";
            }
            else if ((this.player.card_shown >= 8 && this.player.card_shown <= 11) &&
                (this.player.cards[0] >= 8 && this.player.cards[0] <= 11)) {
                result = "Stand";
            }
        }
        else if (this.dealer.card_shown === 7) {
            if ((this.player.card_shown === 12 && (this.player.cards[0] >= 0 && this.player.cards[0] <= 5)) ||
                (this.player.cards[0] === 12 && (this.player.card_shown >= 0 && this.player.card_shown <= 5))) {
                result = "Hit";
            }
            else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 6 && this.player.cards[0] <= 8)) ||
                (this.player.cards[0] === 12 && (this.player.card_shown >= 6 && this.player.card_shown <= 8))) {
                result = "Stand";
            }
            else if (this.player.card_shown === 12 && this.player.cards[0] === 12) {
                result = "Split";
            }
            else if ((this.player.card_shown === 0 && this.player.cards[0] === 0) ||
                (this.player.card_shown === 1 && this.player.cards[0] === 1) ||
                (this.player.card_shown === 2 && this.player.cards[0] === 2)) {
                result = "Hit";
            }
            else if (this.player.card_shown === 3 && this.player.cards[0] === 3) {
                result = "Double Down";
            }
            else if ((this.player.card_shown === 4 && this.player.cards[0] === 4) ||
                (this.player.card_shown === 5 && this.player.cards[0] === 5)) {
                result = "Hit";
            }
            else if ((this.player.card_shown >= 6 && this.player.card_shown <= 7) &&
                (this.player.cards[0] >= 6 && this.player.cards[0] <= 7) &&
                this.player.card_shown === this.player.cards[0]) {
                result = "Split";
            }
            else if ((this.player.card_shown >= 8 && this.player.card_shown <= 11) &&
                (this.player.cards[0] >= 8 && this.player.cards[0] <= 11)) {
                result = "Stand";
            }
        }
        else if (this.dealer.card_shown >= 8 && this.dealer.card_shown <= 12) {
            if ((this.player.card_shown === 12 && (this.player.cards[0] >= 0 && this.player.cards[0] <= 5)) ||
                (this.player.cards[0] === 12 && (this.player.card_shown >= 0 && this.player.card_shown <= 5))) {
                result = "Hit";
            }
            else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 6 && this.player.cards[0] <= 8)) ||
                (this.player.cards[0] === 12 && (this.player.card_shown >= 6 && this.player.card_shown <= 8))) {
                result = "Stand";
            }
            else if (this.player.card_shown === 12 && this.player.cards[0] === 12) {
                result = "Split";
            }
            else if ((this.player.card_shown >= 0 && this.player.card_shown <= 5) &&
                (this.player.cards[0] >= 0 && this.player.cards[0] <= 5) &&
                this.player.card_shown === this.player.cards[0]) {
                result = "Hit";
            }
            else if (this.player.card_shown === 6 && this.player.cards[0] === 6) {
                result = "Split";
            }
            else if ((this.player.card_shown >= 7 && this.player.card_shown <= 11) &&
                (this.player.cards[0] >= 7 && this.player.cards[0] <= 11)) {
                result = "Stand";
            }
        }

        this.recommendation = output + result;
        $('#recommended-move').html(this.recommendation);
    }

    reset() {
        this.deck.reset();
        this.dealer.empty_hand();
        this.player.empty_hand();

        this.ev_value = 0;
        this.qty = 4 * 13;
        this.recommendation = "None";

        this.set_probabilities_all_cards();
        this.print_probabilities();
        $('#EV-score').html(this.ev_value);
        this.update_scoreboard();
        $('#recommended-move').html(this.recommendation);
        $('#total-cards').html(this.deck.stack.length);
        $('#game-text').html("");
        $('#endround-screen').css("visibility", "hidden");

        $('#hit').removeClass("active");
        $('#stand').removeClass("active");
        $('#doubledown').removeClass("active");
        $('#split').removeClass("active");

        $('#hit').addClass("inactive");
        $('#stand').addClass("inactive");
        $('#doubledown').addClass("inactive");
        $('#split').addClass("inactive");
    }

    dealer_hit() {
        this.dealer.push_cards(this.deck.pop());
        $('#total-cards').html(this.deck.stack.length);
    }

    player_hit() {
        let id = this.deck.pop();

        this.player.push_cards(id);
        this.update_probabilities_flipped_cards(id);
        this.update_ev(id);
        this.update_recommendation();

        let c = this.player.calculate_hand();

        $('#c1').html(c[0]);
        $('#c2').html("");

        if (c.length > 1) {
            $('#c2').html(c[1]);
        }

        $('#total-cards').html(this.deck.stack.length);
    }

    reveal_hands() {
        $('#hit').removeClass("active");
        $('#stand').removeClass("active");
        $('#doubledown').removeClass("active");
        $('#split').removeClass("active");
        $('#split').removeClass("inactive");

        $('#hit').off('click');
        $('#stand').off('click');
        $('#doubledown').off('click');
        $('#split').off('click');

        $('#endround-screen').css("visibility", "visible");

        if (this.deck.stack.length < 13) {
            $('#next-round-text').html("New Game");
            $('#arrow-left').css("visibility", "hidden");
            $('#arrow-right').css("visibility", "hidden");

            $('#next-round-text').off('click').on("click", () => {
                $('#endround-screen').css("visibility", "hidden");
                $('#new-game').trigger('click');
            });
        }
        else {
            $('#next-round-text').html("Next Round");
            $('#arrow-left').css("visibility", "hidden");
            $('#arrow-right').css("visibility", "hidden");

            $('#next-round-text').on("mouseover", () => {
                $('#arrow-next').addClass("arrow-bounceright");

            }).on("mouseout", () => {
                $('#arrow-next').removeClass("arrow-bounceright");

            }).off('click').on("click", () => {
                $('#endround-screen').css("visibility", "hidden");
                this.new_round();
            });
        }

        let player_hand = this.player.calculate_hand_best();
        let dealer_hand = this.dealer.calculate_hand_best();

        if ((player_hand > dealer_hand && player_hand <= 21) || (player_hand <= 21 && dealer_hand > 21)) {
            console.log("Player Win!");
            $('#game-text').html("Player Win!");
            this.score += this.bet;
        }
        else if ((player_hand < dealer_hand && dealer_hand <= 21) || (player_hand > 21 && dealer_hand <= 21)) {
            console.log("Dealer Win!");
            $('#game-text').html("Dealer Win!");
            this.score -= this.bet;
        }
        else if (player_hand === dealer_hand) {
            console.log("Draw!");
            $('#game-text').html("Draw!");
        }
        else if (player_hand > 21 && dealer_hand > 21) {
            console.log("Both Bust!");
            $('#game-text').html("Both Bust!");
        }
        else {
            console.log("Who Won?");
            $('#game-text').html("Who Won?");
        }

        for (let i = 0; i < this.dealer.cards.length; i++) {
            $(`#dealer-${i}-${this.dealer.cards[i]}`).attr('src', this.deck.cards.get(this.dealer.cards[i]).get_image());
        }

        this.update_scoreboard();

        //update ev and probabilities from dealer's hand
        for (let i = 0; i < this.dealer.cards.length; i++) {
            this.update_ev(this.dealer.cards[i]);
            this.update_probabilities_flipped_cards(this.dealer.cards[i]);
        }
    }

    new_round() {
        $('#dealer-cards').html("");
        $('#player-cards').html("");
        $('#game-text').html("");
        $('#endround-screen').css("visibility", "hidden");
        $('#c1').css("visibility", "hidden");
        $('#c2').css("visibility", "hidden");

        $('#hit').removeClass("active");
        $('#stand').removeClass("active");
        $('#doubledown').removeClass("active");
        $('#split').removeClass("active");

        $('#hit').addClass("inactive");
        $('#stand').addClass("inactive");
        $('#doubledown').addClass("inactive");
        $('#split').addClass("inactive");

        this.update_scoreboard();
        this.activate_bet_UI();
    }

    //Doubledown lets you place an additional bet, equal to your ante, in return for another card
    doubledown() {



    }

    //Split is an option when a player's initial two card hand has same value
    split() {



    }

    //check if hand can hit, stand, dd and/or split
    calculate_available_moves() {
        let c = this.player.calculate_hand();

        $('#c1').html(c[0]);
        $('#c2').html("");

        if (c.length > 1) {
            $('#c2').html(c[1]);
        }

        if (c[0] < 21) {
            if (this.player.card_shown === this.player.cards[0]) {
                $('#split').removeClass("inactive");
                $('#split').addClass("active");

                $('#split').on("click", () => {





                });
            }
            else {
                $('#split').addClass("inactive");
                $('#split').removeClass("active");
                $('#split').off('click');
            }

            $('#hit').removeClass("inactive");
            $('#stand').removeClass("inactive");
            $('#doubledown').removeClass("inactive");

            $('#hit').addClass("active");
            $('#stand').addClass("active");
            $('#doubledown').addClass("active");

            $('#hit').off("click").on("click", () => {
                this.player_hit();
                this.draw_player_hand();
                this.dealer_hit();
                this.draw_dealer_hand();
                //this.output_console();

                if (this.player.calculate_hand_best() >= 21) {
                    this.reveal_hands();
                }
            });

            $('#stand').on("click", () => {
                //this.output_console();
                this.reveal_hands();
            });

            $('#doubledown').on("click", () => {






            });
        }
        else {
            //player automatically loses
            this.reveal_hands();
        }
    }

    output_console() {
        console.log("<----------------");
        console.log(this.dealer.card_shown);
        console.log(this.dealer.cards);
        console.log(this.deck.stack);
        console.log(this.player.card_shown);
        console.log(this.player.cards);
        console.log("---------------->");
    }

    draw_dealer_hand() {
        $('#dealer-cards').html(`<img src=\"${this.deck.cards.get(this.dealer.card_shown).get_image()}\" class=\"card-img dealer\" id=\"dealer-shown-${this.dealer.card_shown}\"></img>`);
        $(`#dealer-shown-${this.dealer.card_shown}`).css('left', `0%`);
        $(`#dealer-shown-${this.dealer.card_shown}`).css('z-index', '0');

        let pos = 42 - ((this.dealer.cards.length - 1) * 20 / 2);
        let pos_offset = 10;

        for (let i = 0; i < this.dealer.cards.length; i++) {
            $('#dealer-cards').append(`<img src=\"static/image/card-back.png\" class=\"card-img dealer\" id=\"dealer-${i}-${this.dealer.cards[i]}\"></img>`);
            $(`#dealer-${i}-${this.dealer.cards[i]}`).css('left', `${pos}%`);
            $(`#dealer-${i}-${this.dealer.cards[i]}`).css('z-index', `${i + 1}`);

            pos += pos_offset;
        }
    }

    draw_player_hand() {
        $('#player-cards').html(`<img src=\"${this.deck.cards.get(this.player.card_shown).get_image()}\" class=\"card-img player\" id=\"player-shown-${this.player.card_shown}\"></img>`);
        $(`#player-shown-${this.player.card_shown}`).css('left', `0%`);
        $(`#player-shown-${this.player.card_shown}`).css('z-index', '0');

        let pos = 42 - ((this.player.cards.length - 1) * 20 / 2);
        let pos_offset = 10;

        for (let i = 0; i < this.player.cards.length; i++) {
            $('#player-cards').append(`<img src=\"${this.deck.cards.get(this.player.cards[i]).get_image()}\" class=\"card-img player\" id=\"player-${i}-${this.player.cards[i]}\"></img>`);
            $(`#player-${i}-${this.player.cards[i]}`).css('left', `${pos}%`);
            $(`#player-${i}-${this.player.cards[i]}`).css('z-index', `${i + 1}`);

            pos += pos_offset;
        }
    }

    start_game() {
        this.dealer.empty_hand();
        this.player.empty_hand();

        this.dealer.add_card_shown(this.deck.pop());
        this.player.add_card_shown(this.deck.pop());

        this.update_probabilities_flipped_cards(this.dealer.card_shown);
        this.update_probabilities_flipped_cards(this.player.card_shown);
        this.update_ev(this.dealer.card_shown);
        this.update_ev(this.player.card_shown);
        this.update_scoreboard();

        this.dealer_hit();
        this.draw_dealer_hand();
        this.player_hit();
        this.draw_player_hand();

        $('#c1').css("visibility", "visible");
        $('#c2').css("visibility", "visible");

        if (this.player.calculate_hand_best() >= 21) {
            this.reveal_hands();
        }

        this.update_recommendation();
        //this.output_console();
        this.calculate_available_moves();
    }
}

$('#new-game').on('click', () => {
    delete game;
    let game = new Game();

    $('#dealer-cards').html("");
    $('#player-cards').html("");
    $('#c1').css("visibility", "hidden");
    $('#c2').css("visibility", "hidden");
});

$('#back-to-main-menu').on('click', () => {
    window.location.href = 'main.html';
});

let game = new Game();

