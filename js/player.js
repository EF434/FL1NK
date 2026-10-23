// ====================== Logic for moving Fl1nk (player) arounf the game ====================== //


// // declaring all the variables in the game - maze layout, postion and shape
// let fl1nk_maze_design = {};
// let user_key_pressed = {};
// let current_deck = 1;
// let current_ladder; 
// let deck_positions_data = null
// let ladder_near_deck = null;



// // get fl1nk's updates postion
// function updated_deck_info(new_deck){
//     current_deck = new_deck;
//     flink_y = fl1nk_maze_design.decks[current_deck].y - flink_height;
// }

// getting maze boundries for charcaters movements
function player_maze_limits(character_horiz_postiton, width, maze_deck){

    let deck_info = fl1nk_maze_design.decks[maze_deck];

    // fl1nk can't going to right side of canavs
    if (character_horiz_postiton < deck_info.startPoint) {
        character_horiz_postiton = deck_info.startPoint;
    }

    if (character_horiz_postiton + width > deck_info.endPoint) {
        character_horiz_postiton = deck_info.endPoint - width;
    }

    return character_horiz_postiton

}

function climb_ladder(keyboard_command) {

    let playerCenter = flink_x + flink_width / 2;
    let i = 0

    for (; i < fl1nk_maze_design.ladders.length;) {

        let ladder = fl1nk_maze_design.ladders[i];
        i = i + 1


        // Check if FL1NK is near the ladder
        if (playerCenter >= ladder.x - 35 &&
            playerCenter <= ladder.x + 35) {

            // Move up
            if (keyboard_command === "ArrowUp") {
                if (current_deck === ladder.bottomPoint) {
                    updated_deck_info(ladder.topPoint);
                    break;
                }
            }

            // Move down
            if (keyboard_command === "ArrowDown") {
                if (current_deck === ladder.topPoint) {
                    updated_deck_info(ladder.bottomPoint);
                    break;
                }
            }}}
}


// anonymus function to handle the keyboard
// Function to handle keyboard commands
function keyboard_command(event) {

    // key down code
    if (event.type === "keydown") {
        user_key_pressed[event.key] = true;

        if (event.repeat === false) {
            if (fl1nk_maze_design.ladders) {
                climb_ladder(event.key);
            }}}

    // key up code
    if (event.type === "keyup") {
        user_key_pressed[event.key] = false;
    }}

// call the methods and make it work
document.addEventListener("keydown", keyboard_command);
document.addEventListener("keyup", keyboard_command);




// make fl1nk character left and right
function move_fl1nk_left_right(){


    // move right
    if (user_key_pressed["ArrowRight"]){
       flink_x = flink_x + 6;
    }
    // move left
     if (user_key_pressed["ArrowLeft"]) {
        flink_x = flink_x - 6;
    }

    flink_x = player_maze_limits(flink_x, flink_width, current_deck);
    display_game_elements();
}

