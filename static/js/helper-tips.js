"use-strict";

$('#probabilities-help').on('mouseover', () => {
    //$('#helper-text-container').css('visibility', 'visible');
    $('#helper-text-container').addClass('visible');
    $('#helper-text-container').removeClass('hidden');
    $('#helper-tip-subheader').html("Probabilities");
    $('#helper-text').html(`<p>
                            The probabilities of each card that could be drawn next is displayed here. 
                            The probability is calculated using the equation:<br>
                            <center><sup>No. of Specific Card Left</sup> / <sub>(Total No. of Cards Left)</sub>&emsp;&emsp;X&emsp;&emsp;100%</center>
                            </p>`);

}).on('mouseout', () => {
    //$('#helper-text-container').css('visibility', 'hidden');
    $('#helper-text-container').addClass('hidden');
    $('#helper-text-container').removeClass('visible');
});

$('#EV-help').on('mouseover', () => {
    //$('#helper-text-container').css('visibility', 'visible');
    $('#helper-text-container').addClass('visible');
    $('#helper-text-container').removeClass('hidden');
    $('#helper-tip-subheader').html("EV");
    $('#helper-text').html(`<p>
                            The EV value indicates how likely you are to receive a high value card (10 & A) compared
                            to a low value card (1 ~ 6).<br>
                            <ul>
                                <li>[EV value > 3] : A higher EV value means you are likely to receive a high-valued card.</li>
                                <li>[EV value < -3]: A lower EV value means you are likely to receive a low-valued card.</li>
                            </ul> 
                            </p>`);

    //if ev <= -4, lower bet, means higher chance of low valued cards = bad chances
    //if ev >= 4, raise bet, means higher chance of high calued cards = good chances

}).on('mouseout', () => {
    //$('#helper-text-container').css('visibility', 'hidden');
    $('#helper-text-container').addClass('hidden');
    $('#helper-text-container').removeClass('visible');
});

$('#recommended-help').on('mouseover', () => {
    //$('#helper-text-container').css('visibility', 'visible');
    $('#helper-text-container').addClass('visible');
    $('#helper-text-container').removeClass('hidden');
    $('#helper-tip-subheader').html("Recommended Moves");
    $('#helper-text').html(`<p>
                            The Recommended Moves are calculated based on the current EV value and the dealer's face-up card.
                            </p>`);

    if (game.recommended_bet === "Raise Bet") {
        $('#helper-text').append(`<ul>
                                    <li><b>Raise Bet</b>: You have a good chance of drawing high-valued cards (10 & A) 
                                    based on the current EV value. The odd is in your favor.</li>`);
    }
    else if(game.recommended_bet === "Lower Bet") {
        $('#helper-text').append(`<ul>
                                    <li><b>Lower Bet</b>: You have a good chance of drawing low-valued cards (1 ~ 6) 
                                    based on the current EV value. This is a risky bet.</li>`);
    }
    else if (game.recommended_bet === "Neutral Bet") {
        $('#helper-text').append(`<ul>
                                    <li><b>Neutral Bet</b>: No recommendation based on the neutral EV value.</li>`);
    }
    else {
        $('#helper-text').append(`<ul>
                                    <li><b>None</b>: No recommendation.</li>`);
    }
    
    if (game.recommended_move === "Hit") {
        $('#helper-text').append(`<li><b>Hit</b>: - </li>`);
    }
    else if (game.recommended_move === "Stand") {
        $('#helper-text').append(`<li><b>Stand</b>: - </li>`);
    }
    else if (game.recommended_move === "Double Down") {
        $('#helper-text').append(`<li><b>Double Down</b>: - </li>`);
    }
    else if (game.recommended_move === "Split") {
        $('#helper-text').append(`<li><b>Split</b>: - </li>`);
    }
    else {
        $('#helper-text').append(`<li><b>None</b>: No recommendation.</li>`);
    }

    $('#helper-text').append('</ul>');

}).on('mouseout', () => {
    //$('#helper-text-container').css('visibility', 'hidden');
    $('#helper-text-container').addClass('hidden');
    $('#helper-text-container').removeClass('visible');
});