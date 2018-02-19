var DumbAI = function (name) {

    var match = null;
    var position = null;
    var current_game = null;
    var player_key = null;

    this.setupMatch = function (hearts_match, pos) {
	match = hearts_match;
	position = pos;
    }

    this.getName = function () {
	return name;
    }

    this.setupNextGame = function (game_of_hearts, pkey) {
	current_game = game_of_hearts;
	player_key = pkey;

	current_game.registerEventHandler(Hearts.GAME_STARTED_EVENT, function (e) {
	    if (e.getPassType() != Hearts.PASS_NONE) {
		var cards = current_game.getHand(player_key).getDealtCards(player_key);
		
		current_game.passCards(cards.splice(0,3), player_key);
	    }
	});

	current_game.registerEventHandler(Hearts.TRICK_START_EVENT, function (e) {
	    if (e.getStartPos() == position) {
		var playable_cards = current_game.getHand(player_key).getPlayableCards(player_key);
		current_game.playCard(playable_cards[0], player_key);
		show_played_card(playable_cards[0]);
	    }
	});

	current_game.registerEventHandler(Hearts.TRICK_CONTINUE_EVENT, function (e) {
	    if (e.getNextPos() == position) {
		var playable_cards = current_game.getHand(player_key).getPlayableCards(player_key);
		current_game.playCard(playable_cards[0], player_key);
		show_played_card(playable_cards[0]);
	    }
	});

	current_game.registerEventHandler(Hearts.TRICK_COMPLETE_EVENT, function (e) {
		rem_played_cards();
	});
    
	}
	// My code
	
	var show_played_card = function (c) {
		var played_card = $("<td class='ind_dealt_cards'>"+c.toString()+"</td>");
		played_card.attr('rank', c.getRank());
		played_card.attr('suit', c.getSuit());
    	if (position == Hearts.SOUTH) {
			played_card.attr('id', 'played_card_south');
			$("#played_card_south").replaceWith(played_card);
		} else if (position == Hearts.EAST) {
			played_card.attr('id', 'played_card_east');
			$("#played_card_east").replaceWith(played_card);
		} else {
			played_card.attr('id', 'played_card_west');
			$("#played_card_west").replaceWith(played_card);
		}
	}
	
	var rem_played_cards = function () {
		var empty_card_s = $("<td id='played_card_south' class='empty'></td>");
		var empty_card_e = $("<td id='played_card_east' class='empty'></td>");
		var empty_card_w = $("<td id='played_card_west' class='empty'></td>");
		
    	//empty_card_s.attr('id', 'played_card_south');
		$("#played_card_south").replaceWith(empty_card_s);
		//empty_card_e.attr('id', 'played_card_east');
		$("#played_card_east").replaceWith(empty_card_e);
		//empty_card_w.attr('id', 'played_card_west');
		$("#played_card_west").replaceWith(empty_card_w);
	}
}


