var UIPlayer = function (name, ui_div) {
	var match = null;
    var position = null;
    var current_game = null;
    var player_key = null;

    var ui_message_log = $("<div class='text_player_message_log'></div>");
    //var ui_input_form = $("<form class='text_player_input_form'><input type='text' class='text_player_input'></form>");

    var ui_button_submit = $("#submit_button");
    
	$(ui_div).append(ui_message_log);//.append(ui_input_form);


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


	var show_dealt_cards = function (event_type, e) {
		if(event_type == Hearts.GAME_STARTED_EVENT) {
			var dealt = current_game.getHand(player_key).getDealtCards(player_key);
	    	var dealt_row = $('<tr id="row"></tr>');
	    	dealt_row.attr('count',Number('0'));
	    	dealt_row.attr('max',Number('3')); //select 3 cards
	    } else {
	    	var dealt = current_game.getHand(player_key).getUnplayedCards(player_key);
	    	var dealt_row = $('<tr id="row"></tr>');
	    	dealt_row.attr('count',Number('0'));
	    	dealt_row.attr('max',Number('1')); //select 1 card
	    }
	    dealt.forEach(function (c) {
	    	var dealt_card = $("<td class='ind_dealt_cards'>"+c.toString()+"</td>");
	    	var rank = c.getRank();
	    	var suit = c.getSuit();

	    	dealt_card.attr('rank',''+rank);
	    	dealt_card.attr('suit',''+suit);
	    	
	    	if(event_type == Hearts.GAME_STARTED_EVENT && e.getPassType == Hearts.PASS_NONE) {
	    		//do not make cards selectable
	    	} else {
				dealt_card.on("click", function() {
					var num = parseInt(dealt_row.attr('count'));
					var max = parseInt(dealt_row.attr('max'));
					if(!dealt_card.hasClass("selected") && (num < max)) {
						dealt_card.addClass("selected");
						num = Number(num)+1;
						dealt_row.attr('count', Number(num));
					}else if(!dealt_card.hasClass("selected")) {
						//if at max, do not allow more selections
					}else{
						dealt_card.removeClass("selected");
						num = Number(num)-1;
						dealt_row.attr('count', ''+Number(num));
					}
				});
			}
			//distinguish playable cards
			if(event_type != Hearts.GAME_STARTED_EVENT) {
	    		var playable = current_game.getHand(player_key).getPlayableCards(player_key);
	    		playable.forEach(function (d) {
	    			if(c.toString()==d.toString()){
	    				dealt_card.addClass("playable_card");
	    			}
	    		});
	    	}

			dealt_row.append(dealt_card);
	    });
	    var dealt_table = $('<table id="cards_table"></table>');
	    dealt_table.append(dealt_row);
	    $("#cards_table").replaceWith(dealt_table);
	}

	var remove_played_card = function() {
		// reset played card
	    var empty_card = $("<td class='empty'></td>");
	    empty_card.attr('id','played_card_north');
		$("#played_card_north").replaceWith(empty_card);
	}

	var update_scoreboard = function() {
		var sb = match.getScoreboard();
	    alert("Game Over!");
		var score = $("<ul id='scoreboard'>"+
				    "<li>"+match.getPlayerName(Hearts.NORTH)+": " +
				    sb[Hearts.NORTH] + "</li>" +
				    "<li>"+match.getPlayerName(Hearts.EAST)+": " +
				    sb[Hearts.EAST] + "</li>" +
				    "<li>"+match.getPlayerName(Hearts.SOUTH)+": " +
				    sb[Hearts.SOUTH] + "</li>" +
				    "<li>"+match.getPlayerName(Hearts.WEST)+": " +
				    sb[Hearts.WEST] + "</li>" +
				    "</ul>");
		$("#scoreboard").replaceWith(score);
	}

	game_of_hearts.registerEventHandler(Hearts.ALL_EVENTS, function (e) {
	    message_log_append($("<div class='text_player_message'>"+e.toString()+"</div>"));
	});

	game_of_hearts.registerEventHandler(Hearts.GAME_STARTED_EVENT, function (e) {
	    show_dealt_cards(Hearts.GAME_STARTED_EVENT, e);
	});

	game_of_hearts.registerEventHandler(Hearts.GAME_OVER_EVENT, function (e) {
		update_scoreboard();	    
	});

	game_of_hearts.registerEventHandler(Hearts.TRICK_START_EVENT, function (e) {
		show_dealt_cards(Hearts.TRICK_START_EVENT, e);
	});
	
	game_of_hearts.registerEventHandler(Hearts.TRICK_CONTINUE_EVENT, function (e) {
		show_dealt_cards(Hearts.TRICK_START_EVENT, e);
	});

	game_of_hearts.registerEventHandler(Hearts.TRICK_COMPLETE_EVENT, function (e) {
	  	//alert(e.getTrick().getWinner()+" won the trick!");
	  	show_dealt_cards(Hearts.TRICK_COMPLETE_EVENT, e);
	  	remove_played_card();
	});

	game_of_hearts.registerEventHandler(Hearts.PASSING_COMPLETE_EVENT, function (e) {
	    show_dealt_cards(Hearts.PASSING_COMPLETE_EVENT, e);
	});
    }

    var message_log_append = function (msg) {
	ui_message_log.append($(msg));
	ui_message_log.scrollTop(ui_message_log.prop("scrollHeight")-ui_message_log.height());
    }


    ui_button_submit.on("click", function(e) {
    	// WHEN PASSING CARDS
		if(current_game.getStatus() == Hearts.PASSING) {
		
			var selected_cards = $(".selected");
			var cards =[];
	    	selected_cards.each( function (c){
	    		cards[c] = new Card($(this).attr('rank'), $(this).attr('suit'));
	    	});
		 	//copy & paste from pass text input
	    	if (!current_game.passCards(cards, player_key)) {
			message_log_append($("<div class='text_player_message error'>Card pass failed!</div>"));
			show_dealt_cards(Hearts.GAME_STARTED_EVENT, current_game);
	    	} else {
			message_log_append($("<div class='text_player_message'>Cards passed. Waiting for first trick to start.</div>"));
	    	}
	    	//remove selected cards
	    	selected_cards.removeClass("selected");
	    	var dealt_row = $("#row");
	    	dealt_row.attr('count',Number(0));
	    	dealt_row.attr('max',Number(1));
	    } else {
	    	var selected_card = $(".selected");
	    	var card = [];
	    	selected_card.each( function (c){
	    		card[c] = new Card($(this).attr('rank'), $(this).attr('suit'));
	    	});
	    	if (!current_game.playCard(card[0], player_key)) {
				message_log_append($("<div class='text_player_message error'>Attempt to play " +
					card_to_play.toString() + " failed!</div>"));
	    	} else {
	    		show_played_card(card[0]);
	    	}
	    }	    
	});

	var show_played_card = function(c) {
		var played_card = $("<td class='ind_dealt_cards'>"+c.toString()+"</td>");
		played_card.attr('rank', c.getRank());
		played_card.attr('suit', c.getSuit());
    	played_card.attr('id', 'played_card_north');
		$("#played_card_north").replaceWith(played_card);

		var dealt_row = $("#row");
	    dealt_row.children(".selected").remove();
	}
}