$(document).ready(function () {
	var name = prompt("Please enter your name");
		if(name == null || name == "") {
			var north = new UIPlayer("Geraldine", $("#north_player")[0]);
		} else {
			var north = new UIPlayer(name, $("#north_player")[0]);
		}
    var east = new DumbAI("Brenden")
    var south = new DumbAI("Stephanie");
    var west = new DumbAI("Jake");

    var match = new HeartsMatch(north, east, south, west);

    match.run();
});
