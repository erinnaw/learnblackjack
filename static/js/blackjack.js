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

    pop_by_id(id) {
        let index = this.stack.findIndex(element => element === id);
        return this.stack.splice(index, 1);
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
        this.cards_split = [];
        this.hasSplit = false;
    }

    add_card_shown(id) {
        this.card_shown = id;
    }

    push_cards(id) {
        this.cards.push(id);
    }

    push_cards_split(id) {
        this.cards_split.push(id);
    }

    calculate_hand_split() {
        let total = 0, a_counter = 0;
        let c1 = 0, c2 = 0;
        let calculations = [];

        for (let i = 0; i < this.cards_split.length; i++) {
            if (this.cards_split[i] === 12) {
                a_counter++;
            }
            else {
                if (this.cards_split[i] >= 0 && this.cards_split[i] <= 8) {
                    total += (this.cards_split[i] + 2);
                }
                else if (this.cards_split[i] >= 9 && this.cards_split[i] <= 11) {
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

    calculate_split_best() {
        let total = 0;
        let a_counter = 0;

        for (let i = 0; i < this.cards_split.length; i++) {
            if (this.cards_split[i] === 12) {
                a_counter++;
            }
            else {
                if (this.cards_split[i] >= 0 && this.cards_split[i] <= 8) {
                    total += (this.cards_split[i] + 2);
                }
                else if (this.cards_split[i] >= 9 && this.cards_split[i] <= 11) {
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

    get_card_shown() {
        if (this.card_shown === 12) {
            return 11;
        }
        else if (this.card_shown >= 8) {
            return 10;
        }
        else {
            return this.card_shown + 2;
        }
    }

    get_hand() {
        arr = new Array(this.cards);
        arr.push(this.card_shown);

        return arr;
    }

    empty_hand() {
        this.cards = [];
        this.cards_split = [];
        this.hasSplit = false;
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
        this.bet_split = 0;
        this.ev_value = 0;
        this.bet = 10;
        this.bet_increment = 10;
        this.max_bet = 100;
        this.startSplit = false;
        this.atBetUI = true;

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
        this.recommended_bet = "None";
        this.recommended_move = "None";
        this.recommended_text = "-";

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

        $('#score').css('color', 'black');
        $('#bet').css('color', 'black');
        $('#bet-split').css('color', 'black');

        $('#bet-amount').html(this.bet);
        $('#total-cards').html(this.deck.stack.length);
        $('#game-text').html("");
        $('#endround-screen').css("visibility", "hidden");

        for (let i = 0; i < this.deck.cards.size; i++) {
            $(`#card-${this.deck.cards.get(i).get_name()}`).removeClass("highlight");
            $(`#card-left-${this.deck.cards.get(i).get_name()}`).removeClass("highlight");
        }

        this.activate_bet_UI();
    }

    activate_bet_UI() {
        $('#d1').css("visibility", "hidden");
        $('#c1').css("visibility", "hidden");
        $('#c2').css("visibility", "hidden");
        $('#c3').css("visibility", "hidden");
        $('#c4').css("visibility", "hidden");        
        $('#arrow-left').css("visibility", "visible");
        $('#arrow-right').css("visibility", "visible");
        $('#arrow-left').on('click');
        $('#arrow-right').on('click');
        $('#bet-amount').on('click');
        $('#bet-amount').css("visibility", "visible");
        $('#bet-amount').on('mouseover');

        this.atBetUI = true;
        this.update_recommendation();

        if (this.bet > 100) {
            this.bet = 100;
        }
        
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
        $('#d1').css("visibility", "visible");
        $('#c1').css("visibility", "visible");
        $('#c2').css("visibility", "visible");

        $('#score').css('color', 'black');
        $('#bet').css('color', 'black');
        $('#bet-split').css('color', 'black');
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
        $('#bet-split').html("");
        
        if (this.player.hasSplit) {
            $('#bet-split').html(this.bet_split);
        }

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

        let output = "None";
        let result = "None";
        this.recommended_move = "None";
        this.recommended_text = "-";
        const player_hand = this.player.calculate_hand_best();

        if (this.ev_value <= -4) {
            output = "Raise Bet<br>";
            this.recommended_bet = "Raise Bet";
        }

        else if (this.ev_value >= 4) {
            output = "Lower Bet<br>";
            this.recommended_bet = "Lower Bet";
        }

        else {
            output = "Neutral Bet<br>";
            this.recommended_bet = "Neutral Bet";
        }
        
        if (this.atBetUI) {
            this.atBetUI = false;
        }
        else {
            if (this.player.cards.length > 1) {
                if (player_hand < 15) {
                    if (this.ev_value > 3) {
                        result = "Stand";
                        this.recommended_text = "Based on the current EV value, you are likely to draw a high-valued card [10 ~ 11].";
                    }
                    else  if (this.ev_value < -3) {
                        result = "Hit";
                        this.recommended_text = "Based on the current EV value, you are likely to draw a low-valued card [1 ~ 6].";
                    }
                    else {
                        result = "Hit";
                        this.recommended_text = `Based on the current relatively neutral EV value, it is hard to tell what your next move should be.
                                                But your hand is too low anyway. Take a card!`;   
                    }
                }
                else if (player_hand < 17){
                    if (this.ev_value > 3) {
                        result = "Hit";
                        this.recommended_text = "Based on the current EV value, you are likely to draw a high-valued card [10 ~ 11].";
                    }
                    else  if (this.ev_value < -3) {
                        result = "Stand";
                        this.recommended_text = "Based on the current EV value, you are likely to draw a low-valued card [1 ~ 6].";
                    }
                    else {
                        result = "Stand";
                        this.recommended_text = `Based on the current relatively neutral EV value, it is hard to tell what your next move should be.
                                                But your hand is too high anyway. Stand!`;   
                    }
                }
                else {
                    result = "Stand";
                    this.recommended_text = "You have a good hand. Stand!";                    
                }
            }
            else {
                if (this.dealer.card_shown === 0) {
                    if ((this.player.card_shown === 12 && (this.player.cards[0] >= 0 && this.player.cards[0] <= 4)) ||
                        (this.player.cards[0] === 12 && (this.player.card_shown >= 0 && this.player.card_shown <= 4))) {
                        result = "Hit";
                        this.recommended_text = "Treat the [A] card like a 1. Take another card because your dealer could very well bust from this!";
                    }
                    else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 5 && this.player.cards[0] <= 8)) ||
                        (this.player.cards[0] === 12 && (this.player.card_shown >= 5 && this.player.card_shown <= 8))) {
                        result = "Stand";
                        this.recommended_text = "Treat the [A] card like an 11. You have a decent hand that is not worth the risk of another hit.";
                    }
                    else if ((this.player.card_shown === 12 && this.player.cards[0] === 12) ||
                        (this.player.card_shown === 0 && this.player.cards[0] === 0) ||
                        (this.player.card_shown === 1 && this.player.cards[0] === 1)) {
                        result = "Split";
                        this.recommended_text = "These are good cards to split";
                    }
                    else if((this.player.card_shown >= 0 && this.player.card_shown <= 6) &&
                        (this.player.cards[0] >= 0 && this.player.cards[0] <= 6)) {
                            result = 'Hit';
                            this.recommended_text = "Your hand is too low. Take another card!";
                    }
                    else if (this.player.card_shown === 3 && this.player.cards[0] === 3) {
                        result = "Double Down";
                        this.recommended_text = "Go big or go home!";
                    }
                    else if (((this.player.card_shown >= 4 && this.player.card_shown <= 7) ||
                        (this.player.cards[0] >= 4 && this.player.cards[0] <= 7)) &&
                        (this.player.card_shown === this.player.cards[0])) {
                        result = "Split";
                        this.recommended_text = "You can split your cards";
                    }
                    else if ((this.player.card_shown >= 8 && this.player.card_shown <= 11) &&
                        (this.player.cards[0] >= 8 && this.player.cards[0] <= 11)) {
                        result = "Stand";
                        this.recommended_text = "You have a great hand. Stand!";
                    }
                    else {
                        result = "None";
                        this.recommended_text = "-";
                    }
                }
                else if (this.dealer.card_shown === 1) {
                    if ((this.player.card_shown === 12 && (this.player.cards[0] >= 0 && this.player.cards[0] <= 3)) ||
                        (this.player.cards[0] === 12 && (this.player.card_shown >= 0 && this.player.card_shown <= 3))) {
                        result = "Hit";
                        this.recommended_text = "Treat the [A] card like a 1. Take another card because your dealer could very well bust from this!";
                    }
                    else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 4 && this.player.cards[0] <= 5)) ||
                        (this.player.cards[0] === 12 && (this.player.card_shown >= 4 && this.player.card_shown <= 5))) {
                        result = "Double Down";
                        this.recommended_text = "Treat the [A] card like a 1 and double down. The odds are in your favor!";
                    }
                    else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 6 && this.player.cards[0] <= 8)) ||
                        (this.player.cards[0] === 12 && (this.player.card_shown >= 6 && this.player.card_shown <= 8))) {
                        result = "Stand";
                        this.recommended_text = "Treat the [A] card like an 11. You have a decent hand that is not worth the risk of another hit.";
                    }
                    else if ((this.player.card_shown === 12 && this.player.cards[0] === 12) ||
                        (this.player.card_shown === 0 && this.player.cards[0] === 0) ||
                        (this.player.card_shown === 1 && this.player.cards[0] === 1)) {
                        result = "Split";
                        this.recommended_text = "This is the perfect pair to split!";
                    }
                    else if((this.player.card_shown >= 0 && this.player.card_shown <= 6) &&
                        (this.player.cards[0] >= 0 && this.player.cards[0] <= 6)) {
                            result = 'Hit';
                            this.recommended_text = "Your hand is too low. Take another card!";
                    }
                    else if (this.player.card_shown === 3 && this.player.cards[0] === 3) {
                        result = "Double Down";
                        this.recommended_text = "Go big or go home!";
                    }
                    else if (((this.player.card_shown >= 4 && this.player.card_shown <= 7) &&
                        (this.player.cards[0] >= 4 && this.player.cards[0] <= 7)) &&
                        this.player.card_shown === this.player.cards[0]) {
                        result = "Split";
                        this.recommended_text = "You have a good pair to split.";
                    }
                    else if ((this.player.card_shown >= 8 && this.player.card_shown <= 11) &&
                        (this.player.cards[0] >= 8 && this.player.cards[0] <= 11)) {
                        result = "Stand";
                        this.recommended_text = "You have a great hand. Stand!";
                    }
                    else {
                        result = "None";
                        this.recommended_text = "-";
                    }
                }
                else if (this.dealer.card_shown === 2) {
                    if ((this.player.card_shown === 12 && (this.player.cards[0] >= 0 && this.player.cards[0] <= 1)) ||
                        (this.player.cards[0] === 12 && (this.player.card_shown >= 0 && this.player.card_shown <= 1))) {
                        result = "Hit";
                        this.recommended_text = "Treat the [A] card like a 1. Take another card because your dealer could very well bust from this!";
                    }
                    else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 2 && this.player.cards[0] <= 5)) ||
                        (this.player.cards[0] === 12 && (this.player.card_shown >= 2 && this.player.card_shown <= 5))) {
                        result = "Double Down";
                        this.recommended_text = "Treat the [A] card like a 1 and double down. The odds are in your favor!";
                    }
                    else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 6 && this.player.cards[0] <= 8)) ||
                        (this.player.cards[0] === 12 && (this.player.card_shown >= 6 && this.player.card_shown <= 8))) {
                        result = "Stand";
                        this.recommended_text = "Treat the [A] card like an 11. You have a decent hand that is not worth the risk of another hit.";
                    }
                    else if ((this.player.card_shown === 12 && this.player.cards[0] === 12) ||
                        (this.player.card_shown === 0 && this.player.cards[0] === 0) ||
                        (this.player.card_shown === 1 && this.player.cards[0] === 1)) {
                        result = "Split";
                        this.recommended_text = "This is the perfect pair to split!";
                    }
                    else if((this.player.card_shown >= 0 && this.player.card_shown <= 6) &&
                        (this.player.cards[0] >= 0 && this.player.cards[0] <= 6)) {
                            result = 'Hit';
                            this.recommended_text = "Your hand is too low. Take another card!";
                    }
                    else if (this.player.card_shown === 3 && this.player.cards[0] === 3) {
                        result = "Double Down";
                        this.recommended_text = "Go big or go home!";
                    }
                    else if (((this.player.card_shown >= 4 && this.player.card_shown <= 7) &&
                        (this.player.cards[0] >= 4 && this.player.cards[0] <= 7)) &&
                        this.player.card_shown === this.player.cards[0]) {
                        result = "Split";
                        this.recommended_text = "You have a good pair to split.";
                    }
                    else if ((this.player.card_shown >= 8 && this.player.card_shown <= 11) &&
                        (this.player.cards[0] >= 8 && this.player.cards[0] <= 11)) {
                        result = "Stand";
                        this.recommended_text = "You have a great hand. Stand!";
                    }
                    else {
                        result = "None";
                        this.recommended_text = "-";
                    }
                }
                else if (this.dealer.card_shown === 3 || this.dealer.card_shown === 4) {
                    if ((this.player.card_shown === 12 && (this.player.cards[0] >= 0 && this.player.cards[0] <= 5)) ||
                        (this.player.cards[0] === 12 && (this.player.card_shown >= 0 && this.player.card_shown <= 5))) {
                        result = "Double Down";
                        this.recommended_text = "Treat the [A] card like a 1 and double down. The odds are in your favor!";
                    }
                    else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 6 && this.player.cards[0] <= 8)) ||
                        (this.player.cards[0] === 12 && (this.player.card_shown >= 6 && this.player.card_shown <= 8))) {
                        result = "Stand";
                        this.recommended_text = "Treat the [A] card like an 11. You have a decent hand that is not worth the risk of another hit.";
                    }
                    else if ((this.player.card_shown === 12 && this.player.cards[0] === 12) ||
                        (this.player.card_shown === 0 && this.player.cards[0] === 0) ||
                        (this.player.card_shown === 1 && this.player.cards[0] === 1) ||
                        (this.player.card_shown === 2 && this.player.cards[0] === 2)) {
                        result = "Split";
                        this.recommended_text = "This is the perfect pair to split!";
                    }
                    else if (this.player.card_shown === 3 && this.player.cards[0] === 3) {
                        result = "Double Down";
                        this.recommended_text = "Go big or go home!";
                    }
                    else if (((this.player.card_shown >= 4 && this.player.card_shown <= 7) &&
                        (this.player.cards[0] >= 4 && this.player.cards[0] <= 7)) &&
                        this.player.card_shown === this.player.cards[0]) {
                        result = "Split";
                        this.recommended_text = "You have a good pair to split.";
                    }
                    else if ((this.player.card_shown >= 8 && this.player.card_shown <= 11) &&
                        (this.player.cards[0] >= 8 && this.player.cards[0] <= 11)) {
                        result = "Stand";
                        this.recommended_text = "You have a great hand. Stand!";
                    }
                    else if((this.player.card_shown >= 0 && this.player.card_shown <= 6) &&
                        (this.player.cards[0] >= 0 && this.player.cards[0] <= 6)) {
                            result = 'Hit';
                            this.recommended_text = "Your hand is too low. Take another card!";
                    }
                    else {
                        result = "None";
                        this.recommended_text = "-";
                    }
                }
                else if (this.dealer.card_shown === 5) {
                    if ((this.player.card_shown === 12 && (this.player.cards[0] >= 0 && this.player.cards[0] <= 4)) ||
                        (this.player.cards[0] === 12 && (this.player.card_shown >= 0 && this.player.card_shown <= 4))) {
                        result = "Hit";
                        this.recommended_text = "Treat the [A] card like a 1. Take another card because your dealer could very well bust from this!";
                    }
                    else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 5 && this.player.cards[0] <= 8)) ||
                        (this.player.cards[0] === 12 && (this.player.card_shown >= 5 && this.player.card_shown <= 8))) {
                        result = "Stand";
                        this.recommended_text = "Treat the [A] card like an 11. You have a decent hand that is not worth the risk of another hit.";
                    }
                    else if ((this.player.card_shown === 12 && this.player.cards[0] === 12) ||
                        (this.player.card_shown === 0 && this.player.cards[0] === 0) ||
                        (this.player.card_shown === 1 && this.player.cards[0] === 1)) {
                        result = "Split";
                        this.recommended_text = "This is the perfect pair to split!";               
                    }
                    else if((this.player.card_shown >= 0 && this.player.card_shown <= 6) &&
                        (this.player.cards[0] >= 0 && this.player.cards[0] <= 6)) {
                            result = 'Hit';
                            this.recommended_text = "Your hand is too low. Take another card!";
                    }
                    else if (this.player.card_shown === 3 && this.player.cards[0] === 3) {
                        result = "Double Down";
                        this.recommended_text = "Go big or go home!";
                    }
                    else if (((this.player.card_shown >= 5 && this.player.card_shown <= 6) &&
                        (this.player.cards[0] >= 5 && this.player.cards[0] <= 6)) &&
                        this.player.card_shown === this.player.cards[0]) {
                        result = "Split";
                        this.recommended_text = "You have a good pair to split.";
                    }
                    else if ((this.player.card_shown >= 7 && this.player.card_shown <= 11) &&
                        (this.player.cards[0] >= 7 && this.player.cards[0] <= 11)) {
                        result = "Stand";
                        this.recommended_text = "You have a great hand. Stand!";
                    }
                    else {
                        result = "None";
                        this.recommended_text = "-";
                    }
                }
                else if (this.dealer.card_shown === 6) {
                    if ((this.player.card_shown === 12 && (this.player.cards[0] >= 0 && this.player.cards[0] <= 4)) ||
                        (this.player.cards[0] === 12 && (this.player.card_shown >= 0 && this.player.card_shown <= 4))) {
                        result = "Hit";
                        this.recommended_text = "Treat the [A] card like a 1. Take another card because your dealer could very well bust from this!";
                    }
                    else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 5 && this.player.cards[0] <= 8)) ||
                        (this.player.cards[0] === 12 && (this.player.card_shown >= 5 && this.player.card_shown <= 8))) {
                        result = "Stand";
                        this.recommended_text = "Treat the [A] card like an 11. You have a decent hand that is not worth the risk of another hit.";
                    }
                    else if (this.player.card_shown === 12 && this.player.cards[0] === 12) {
                        result = "Split";
                        this.recommended_text = "You have the perfect pair to split.";
                    }
                    else if ((this.player.card_shown >= 0 && this.player.card_shown <= 5) &&
                        (this.player.cards[0] >= 0 && this.player.cards[0] <= 5) &&
                        (this.player.card_shown === this.player.cards[0])) {
                        result = "Hit";
                        this.recommended_text = "Don't split. Your hand is too low. Take another card!";
                    }
                    else if (this.player.card_shown === 3 && this.player.cards[0] === 3) {
                        result = "Double Down";
                        this.recommended_text = "Go big or go home!";
                    }
                    else if ((this.player.card_shown >= 6 && this.player.card_shown <= 7) &&
                        (this.player.cards[0] >= 6 && this.player.cards[0] <= 7) &&
                        this.player.card_shown === this.player.cards[0]) {
                        result = "Split";
                        this.recommended_text = "You have a good pair to split.";
                    }
                    else if ((this.player.card_shown >= 8 && this.player.card_shown <= 11) &&
                        (this.player.cards[0] >= 8 && this.player.cards[0] <= 11)) {
                        result = "Stand";
                        this.recommended_text = "You have a great hand. Stand!";                   
                    }
                    else {
                        result = "None";
                        this.recommended_text = "-";                   
                    }
                }
                else if (this.dealer.card_shown === 7) {
                    if ((this.player.card_shown === 12 && (this.player.cards[0] >= 0 && this.player.cards[0] <= 5)) ||
                        (this.player.cards[0] === 12 && (this.player.card_shown >= 0 && this.player.card_shown <= 5))) {
                        result = "Hit";
                        this.recommended_text = "Treat the [A] card like a 1. Take another card because your dealer could very well bust from this!";
                    }
                    else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 6 && this.player.cards[0] <= 8)) ||
                        (this.player.cards[0] === 12 && (this.player.card_shown >= 6 && this.player.card_shown <= 8))) {
                        result = "Stand";
                        this.recommended_text = "Treat the [A] card like an 11. You have a decent hand that is not worth the risk of another hit.";
                    }
                    else if (this.player.card_shown === 12 && this.player.cards[0] === 12) {
                        result = "Split";
                        this.recommended_text = "You have the perfect pair to split.";
                    }
                    else if ((this.player.card_shown === 0 && this.player.cards[0] === 0) ||
                        (this.player.card_shown === 1 && this.player.cards[0] === 1) ||
                        (this.player.card_shown === 2 && this.player.cards[0] === 2) ||
                        (this.player.card_shown === 4 && this.player.cards[0] === 4) ||
                        (this.player.card_shown === 5 && this.player.cards[0] === 5)) {
                        result = "Hit";
                        this.recommended_text = "Don't split. Your hand is too low. Take another card!";
                    }
                    else if (this.player.card_shown === 3 && this.player.cards[0] === 3) {
                        result = "Double Down";
                        this.recommended_text = "Go big or go home!";
                    }
                    else if (((this.player.card_shown >= 6 && this.player.card_shown <= 7) &&
                        (this.player.cards[0] >= 6 && this.player.cards[0] <= 7)) &&
                        this.player.card_shown === this.player.cards[0]) {
                        result = "Split";
                        this.recommended_text = "You have a good pair to split.";
                    }
                    else if ((this.player.card_shown >= 8 && this.player.card_shown <= 11) &&
                        (this.player.cards[0] >= 8 && this.player.cards[0] <= 11)) {
                        result = "Stand";
                        this.recommended_text = "You have a great hand. Stand!";                   
                    }
                    else {
                        result = "None";
                        this.recommended_text = "-";                   
                    }
                }
                else if (this.dealer.card_shown >= 8 && this.dealer.card_shown <= 12) {
                    if ((this.player.card_shown === 12 && (this.player.cards[0] >= 0 && this.player.cards[0] <= 5)) ||
                        (this.player.cards[0] === 12 && (this.player.card_shown >= 0 && this.player.card_shown <= 5))) {
                        result = "Hit";
                        this.recommended_text = "Treat the [A] card like a 1. Take another card because your dealer could very well bust from this!";
                    }
                    else if ((this.player.card_shown === 12 && (this.player.cards[0] >= 6 && this.player.cards[0] <= 8)) ||
                        (this.player.cards[0] === 12 && (this.player.card_shown >= 6 && this.player.card_shown <= 8))) {
                        result = "Stand";
                        this.recommended_text = "Treat the [A] card like an 11. You have a decent hand that is not worth the risk of another hit.";
                    }
                    else if ((this.player.card_shown >= 0 && this.player.card_shown <= 5) &&
                        (this.player.cards[0] >= 0 && this.player.cards[0] <= 5) &&
                        this.player.card_shown === this.player.cards[0]) {
                        result = "Hit";
                        this.recommended_text = "Don't split. Your hand is too low. Take another card!";
                    }
                    else if ((this.player.card_shown === 6 && this.player.cards[0] === 6) ||
                        (this.player.card_shown === 12 && this.player.cards[0] === 12)) {
                        result = "Split";
                        this.recommended_text = "You have a good pair to split.";                   
                    }
                    else if ((this.player.card_shown >= 7 && this.player.card_shown <= 11) &&
                        (this.player.cards[0] >= 7 && this.player.cards[0] <= 11)) {
                        result = "Stand";
                        this.recommended_text = "You have a great hand. Stand!";                   
                    }
                    else {
                        result = "None";
                        this.recommended_text = "-";                   
                    }
                }
                if (result === "None") {
                    if (player_hand < 15) {
                        result = "Hit";
                        this.recommended_text = "Your hand is too low. Take another card!"
                    }
                    else {
                        result = "Stand";
                        this.recommended_text = "You might bust at the next hit. Take a stand!"
                    }
                }
            }
        }

        this.recommendation = output + result;
        this.recommended_move = result;
        $('#recommended-move').html(this.recommendation);
    }

    reset() {
        this.deck.reset();
        this.dealer.empty_hand();
        this.player.empty_hand();

        this.startSplit = false;
        this.ev_value = 0;
        this.qty = 4 * 13;
        this.recommendation = "None";
        this.recommended_bet = "None";
        this.recommended_move = "None";

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

        $('#score').css('color', 'black');
        $('#bet').css('color', 'black');
        $('#bet-split').css('color', 'black');

        for (let i = 0; i < this.deck.cards.size; i++) {
            $(`#card-${this.deck.cards.get(i).get_name()}`).removeClass("highlight");
            $(`#card-left-${this.deck.cards.get(i).get_name()}`).removeClass("highlight");
        }
    }

    dealer_hit() {
        this.dealer.push_cards(this.deck.pop());
        $('#total-cards').html(this.deck.stack.length);
    }

    player_hit() {
        let id = 0;

        if (this.startSplit) {
            id = this.player.card_shown;
            let removed = this.deck.pop_by_id(id);
            this.player.push_cards(id);
            this.startSplit = false;
        }
        else {
            $('#split').off('click');
            $('#split').removeClass('active');
            $('#split').addClass('inactive');

            id = this.deck.pop();
            this.player.push_cards(id);
        }

        this.update_probabilities_flipped_cards(id);
        this.update_ev(id);

        let c = this.player.calculate_hand();

        if (this.player.hasSplit && !this.startSplit) {
            id = this.deck.pop();
            this.player.push_cards_split(id);
            this.update_probabilities_flipped_cards(id);
            this.update_ev(id);

            let c_s = this.player.calculate_hand_split();
            $('#c1').html(c_s[0]);
            $('#c2').html("-");

            if (c_s.length > 1) {
                $('#c2'). html(c_s[1]);
            }

            $('#c3').html(c[0]);
            $('#c4').html("-");

            if (c.length > 1) {
                $('#c4').html(c[1]);
            }
        }
        else {
            $('#c1').html(c[0]);
            $('#c2').html("-");

            if (c.length > 1) {
                $('#c2').html(c[1]);
            }
        }

        this.update_recommendation();
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

        if (this.player.hasSplit) {
            let player_split = this.player.calculate_split_best();
            console.log(player_hand);
            console.log(player_split);
            console.log(dealer_hand);
            
            if (((player_split > dealer_hand && player_split <= 21) && (player_hand > dealer_hand && player_hand <= 21)) ||
                (player_hand <= 21 && player_split <= 21 && dealer_hand > 21)) {
                console.log("Player Wins Double!");
                $('#game-text').html("Player Wins Double!");
                this.score += this.bet;
                this.score += this.bet_split;

                $('#bet').css('color', 'green');
                $('#bet-split').css('color', 'green');
            }
            else if (((player_split < dealer_hand && dealer_hand <= 21) || (player_split > 21 && dealer_hand <= 21)) && ((player_hand < dealer_hand && dealer_hand <= 21)) ||
                (player_hand > 21 && dealer_hand <= 21)) {
                console.log("Player Loses Double!");
                $('#game-text').html("Player Loses Double!");
                this.score -= this.bet;
                this.score -= this.bet_split;

                $('#bet').css('color', 'red');
                $('#bet-split').css('color', 'red');
            }
            else if ((player_split === dealer_hand || (player_split > 21 && dealer_hand > 21)) && (player_hand === dealer_hand || (player_hand > 21 && dealer_hand > 21))) {
                console.log("Double Draw!");
                $('#game-text').html("Double Draw!");

                $('#bet').css('color', 'black');
                $('#bet-split').css('color', 'black');
            }
            else if (player_split > 21 && player_hand > 21 && dealer_hand > 21) {
                console.log("All Bust");
                $('#game-text').html("All Bust!");

                $('#bet').css('color', 'black');
                $('#bet-split').css('color', 'black');
            }
            else if ((player_split === dealer_hand || (player_split > 21 && dealer_hand > 21)) && ((player_hand > dealer_hand && player_hand <= 21) || (player_hand <= 21 && dealer_hand > 21))) {
                console.log("Player Wins A Hand!");
                $('#game-text').html("Player Wins A Hand!");
                this.score += this.bet;

                $('#bet').css('color', 'green');
                $('#bet-split').css('color', 'black');
            }
            else if ((player_hand === dealer_hand || (player_hand > 21 && dealer_hand > 21)) && ((player_split > dealer_hand && player_split <= 21) || (player_split <= 21 && dealer_hand > 21))) {
                console.log("Player Wins A Hand!");
                $('#game-text').html("Player Wins A Hand!");
                this.score += this.bet_split;

                $('#bet').css('color', 'black');
                $('#bet-split').css('color', 'green');
            }
            else if (((player_hand < dealer_hand && dealer_hand <= 21) || (player_hand > 21 && dealer_hand <= 21)) && (player_split === dealer_hand || (player_split > 21 && dealer_hand > 21))) {
                console.log("Player Loses A Hand!");
                $('#game-text').html("Player Loses A Hand!");
                this.score -= this.bet; 

                $('#bet').css('color', 'red');
                $('#bet-split').css('color', 'black');
            }
            else if (((player_split < dealer_hand && dealer_hand <= 21) || (player_split > 21 && dealer_hand <= 21)) && (player_hand === dealer_hand || (player_hand > 21 && dealer_hand > 21))) {
                console.log("Player Loses A Hand!");
                $('#game-text').html("Player Loses A Hand!");
                this.score -= this.bet_split; 

                $('#bet').css('color', 'black');
                $('#bet-split').css('color', 'red');
            }
            else if (((player_hand > dealer_hand && player_hand <= 21) || (dealer_hand > 21 && player_hand <= 21)) && ((player_split < dealer_hand && dealer_hand <= 21) || (player_split > 21 && dealer_hand <= 21))) {
                console.log("Player Bets Cancel Out!");
                $('#game-text').html("Player Bet Cancelled Out!");

                $('#bet').css('color', 'green');
                $('#bet-split').css('color', 'red');
            }
            else if (((player_split > dealer_hand && player_split <= 21) || (player_split <= 21 && dealer_hand > 21)) && ((player_hand < dealer_hand && dealer_hand <= 21) || (player_hand > 21 && dealer_hand <= 21))) {
                console.log("Player Bets Cancel Out!");
                $('#game-text').html("Player Bet Cancelled Out!");

                $('#bet').css('color', 'red');
                $('#bet-split').css('color', 'green');
            }
            else {
                console.log("Error: Undetermined Winner");
                $('#game-text').html("Error: Undetermined Winner");

                $('#bet').css('color', 'black');
                $('#bet-split').css('color', 'black');
            }
        }
        else {
            if ((player_hand > dealer_hand && player_hand <= 21) || (player_hand <= 21 && dealer_hand > 21)) {
                console.log("Player Win!");
                $('#game-text').html("Player Win!");
                $('#bet').css('color', 'green');
                this.score += this.bet;
            }
            else if ((player_hand < dealer_hand && dealer_hand <= 21) || (player_hand > 21 && dealer_hand <= 21)) {
                console.log("Dealer Win!");
                $('#game-text').html("Dealer Win!");
                $('#bet').css('color', 'red');
                this.score -= this.bet;
            }
            else if (player_hand === dealer_hand) {
                console.log("Draw!");
                $('#game-text').html("Draw!");
                $('#bet').css('color', 'black');
            }
            else if (player_hand > 21 && dealer_hand > 21) {
                console.log("Both Bust!");
                $('#game-text').html("Both Bust!");
                $('#bet').css('color', 'black');
            }
            else {
                console.log("Error: Undetermined Winner");
                $('#bet').css('color', 'black');
                $('#game-text').html("Error: Undetermined Winner");
            }
        }

        for (let i = 0; i < this.dealer.cards.length; i++) {
            $(`#dealer-${i}-${this.dealer.cards[i]}`).attr('src', this.deck.cards.get(this.dealer.cards[i]).get_image());
        }

        $('#d1').html(this.dealer.calculate_hand_best());
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
        $('#d1').css("visibility", "hidden");
        $('#c1').css("visibility", "hidden");
        $('#c2').css("visibility", "hidden");
        $('#c3').css("visibility", "hidden");
        $('#c4').css("visibility", "hidden");

        $('#hit').removeClass("active");
        $('#stand').removeClass("active");
        $('#doubledown').removeClass("active");
        $('#split').removeClass("active");

        $('#hit').addClass("inactive");
        $('#stand').addClass("inactive");
        $('#doubledown').addClass("inactive");
        $('#split').addClass("inactive");

        $('#bet').css('color', 'black');
        $('#bet-split').css('color', 'black');

        for (let i = 0; i < this.deck.cards.size; i++) {
            $(`#card-${this.deck.cards.get(i).get_name()}`).removeClass("highlight");
            $(`#card-left-${this.deck.cards.get(i).get_name()}`).removeClass("highlight");
        }

        this.update_scoreboard();
        this.activate_bet_UI();
        this.startSplit = false;
    }

    //check if hand can hit, stand, dd and/or split
    calculate_available_moves() {
        let c = this.player.calculate_hand();

        if (this.player.hasSplit) {
            let c_s = this.player.calculate_hand_split();
            $('#c1').html(c_s[0]);
            $('#c2').html("-");

            if (c_s.length > 1) {
                $('#c2').html(c_s[1]);
            }

            $('#c3').html(c[0]);
            $('#c4').html("-");

            if (c.length > 1) {
                $('#c4').html(c[1]);
            }
        }
        else {
            $('#c1').html(c[0]);
            $('#c2').html("-");

            if (c.length > 1) {
                $('#c2').html(c[1]);
            }
        }

        if (c[0] < 21) {
            if (this.player.card_shown === this.player.cards[0]) {
                $('#split').removeClass("inactive");
                $('#split').addClass("active");

                $('#split').on("click", () => {
                    this.player.hasSplit = true;
                    this.bet_split = this.bet;
                    this.player.push_cards_split(this.player.cards.pop());
                    this.draw_player_hand();

                    if (this.player.hasSplit) {
                        $('#c3').css("visibility", "visible");
                        $('#c4').css("visibility", "visible");

                        let c = this.player.calculate_hand();
                        $('#c3').html(c[0]);
                        $('#c4').html("-");

                        if (c.length > 1) {
                            $('#c4').html(c[1]);
                        }
                    }

                    $('#split').off('click');
                    $('#split').removeClass('active');
                    $('#split').addClass('inactive');
                    this.update_scoreboard();
                    //this.output_console();
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
                this.dealer_hit();
                this.draw_dealer_hand();
                this.player_hit();
                this.draw_player_hand();
                //this.output_console();

                if (this.player.hasSplit) {
                    if (this.player.calculate_split_best() >= 21 || this.player.calculate_hand_best() >= 21) {
                        this.reveal_hands();
                    }
                }
                else {
                    if (this.player.calculate_hand_best() >= 21) {
                        this.reveal_hands();
                    }
                }
            });

            $('#stand').on("click", () => {
                //this.output_console();
                this.reveal_hands();
            });

            //player stands after taking an extra card
            $('#doubledown').on("click", () => {
                this.bet *= 2;

                if (this.player.hasSplit) {
                    this.bet_split *= 2;
                }

                this.dealer_hit();
                this.player_hit();
                this.player_hit();

                this.draw_dealer_hand();
                this.draw_player_hand();
                this.reveal_hands();
                //this.output_console();
            });
        }
        else {
            //player automatically loses
            this.reveal_hands();
        }
    }

    output_console() {
        console.log("<----------------");
        console.log("Dealer:");
        console.log(this.dealer.card_shown);
        console.log(this.dealer.cards);
        console.log("Deck:");
        console.log(this.deck.stack);
        console.log("Player:");
        console.log(this.player.card_shown);
        console.log(this.player.cards);
        
        if (this.player.hasSplit) {
            console.log("Player (split):");
            console.log(this.player.cards_split);
        }

        console.log("---------------->");
    }

    draw_dealer_hand() {
        $('#dealer-cards').html(`<img src=\"${this.deck.cards.get(this.dealer.card_shown).get_image()}\" class=\"card-img dealer\" id=\"dealer-shown-${this.dealer.card_shown}\"></img>`);
        $(`#dealer-shown-${this.dealer.card_shown}`).css('left', `0%`);
        $(`#dealer-shown-${this.dealer.card_shown}`).css('z-index', '0');

        let pos = $('#dealer-cards').width() / 3;
        let pos_offset = $('.card-img').width() / 3;

        for (let i = 0; i < this.dealer.cards.length; i++) {
            $('#dealer-cards').append(`<img src=\"static/image/card-back.png\" class=\"card-img dealer\" id=\"dealer-${i}-${this.dealer.cards[i]}\"></img>`);
            $(`#dealer-${i}-${this.dealer.cards[i]}`).css('left', `${pos}px`);
            $(`#dealer-${i}-${this.dealer.cards[i]}`).css('z-index', `${i + 1}`);

            pos += pos_offset;
        }
    }

    draw_player_hand() {
        $('#player-cards').html(`<img src=\"${this.deck.cards.get(this.player.card_shown).get_image()}\" class=\"card-img player\" id=\"player-shown-${this.player.card_shown}\"></img>`);
        $(`#player-shown-${this.player.card_shown}`).css('left', `0%`);
        $(`#player-shown-${this.player.card_shown}`).css('z-index', '0');

        let split_offset = $('#player-cards').width() / 3;
        let pos_offset = $('.card-img').width() / 3;

        if (this.player.hasSplit) {
            split_offset = $('#player-cards').width() / 4;
            let pos_split = split_offset * 2 + ((this.player.cards.length - 1) * ($('.card-img').width() / 3 ) / 2);

            for (let i = 0; i < this.player.cards_split.length; i++) {
                $('#player-cards').append(`<img src=\"${this.deck.cards.get(this.player.cards_split[i]).get_image()}\" class=\"card-img player\" id=\"split-${i}-${this.player.cards_split[i]}\"></img>`);
                $(`#split-${i}-${this.player.cards_split[i]}`).css('left', `${pos_split}px`);
                $(`#split-${i}-${this.player.cards_split[i]}`).css('z-index', `${i + 1}`);

                pos_split += pos_offset;
            }

            split_offset /= 2;
        }

        let pos = split_offset - ((this.player.cards.length - 1) * ($('.card-img').width() / 3 ) / 2);

        for (let i = 0; i < this.player.cards.length; i++) {
            $('#player-cards').append(`<img src=\"${this.deck.cards.get(this.player.cards[i]).get_image()}\" class=\"card-img player\" id=\"player-${i}-${this.player.cards[i]}\"></img>`);
            $(`#player-${i}-${this.player.cards[i]}`).css('left', `${pos}px`);
            $(`#player-${i}-${this.player.cards[i]}`).css('z-index', `${i + 1}`);

            pos += pos_offset;
        }
    }

    start_game() {
        this.dealer.empty_hand();
        this.player.empty_hand();

        for (let i = 0; i < this.deck.cards.size; i++) {
            $(`#card-${this.deck.cards.get(i).get_name()}`).removeClass("highlight");
            $(`#card-left-${this.deck.cards.get(i).get_name()}`).removeClass("highlight");
        }

        this.dealer.add_card_shown(this.deck.pop());
        this.player.add_card_shown(this.deck.pop());
        this.update_probabilities_flipped_cards(this.dealer.card_shown);
        this.update_probabilities_flipped_cards(this.player.card_shown);
        $('#d1').html(this.dealer.get_card_shown());

        this.dealer_hit();
        this.player_hit();

        this.update_ev(this.dealer.card_shown);
        this.update_ev(this.player.card_shown);
        this.update_scoreboard();

        this.draw_dealer_hand();
        this.draw_player_hand();

        $('#d1').css("visibility", "visible");
        $('#c1').css("visibility", "visible");
        $('#c2').css("visibility", "visible");

        $('#bet').css('color', 'black');
        $('#bet-split').css('color', 'black');

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
    game.startSplit = false;

    $('#dealer-cards').html("");
    $('#player-cards').html("");
    $('#c1').css("visibility", "hidden");
    $('#c2').css("visibility", "hidden");
    $('#c3').css("visibility", "hidden");
    $('#c4').css("visibility", "hidden");
});

let game = new Game();
game.startSplit = false;

