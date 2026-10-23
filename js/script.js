
//  // Load the FL1NK sprite sheet image
// const fl1nk_spirate_sheet = new Image();
// fl1nk_spirate_sheet.src = "assets/images/fl1nk-spirate-sheet.png";

// // game variables for animation
// let fl1nk_animation_data = {};
// let user_key_pressed = {};
// let current_deck = 1;
// let count = 0;

// window.addEventListener('load', function(){
//     // getting the canvas element, and providing 2d functionaltiy
//     let pirate_maze_canvas = document.querySelector("#fl1nk-game-canvas");
//     let  context = pirate_maze_canvas.getContext("2d");

//     class Player_Fl1nk{
//         constructor(){
//             this.flink_x = 445;
//             this.flink_y = 800;
//             this.flink_width = 90
//             this.flink_height = 95
//             this.scale = 1;
//             this.framePerSecond = 60;
//             this.secondsToUpdate = this.framePerSecond / 8;
//             this.currentFrame = 0;

//         }

//         // get fl1nk's updates postion
//         updated_deck_info(new_deck){
//             current_deck = new_deck;
//             this.flink_y = fl1nk_maze_design.decks[current_deck].y - this.flink_height * this.scale;
//         }
//         // Draw FL1NK separately
//         animate(context){
//             context.drawImage(fl1nk_spirate_sheet, 
//             2 * fl1nk_frame,
//             0,
//             fl1nk_frame.position.width,
//             fl1nk_frame.position.height,
//             flink_x,
//             flink_y,
//             flink_width,
//             flink_height);
//         }

//         player_maze_limits(character_horiz_postiton, width, maze_deck){

//         var deck_info = fl1nk_maze_design.decks[maze_deck];

//         // fl1nk can't going to right side of canavs
//         if (this.x < deck.startPoint) {
//              this.x = deck.startPoint;
//         }

//         if (this.x + this.width * this.scale > deck.endPoint) {
//             this.x = deck.endPoint - this.width * this.scale;
//         }}

//         climb_ladder(keyboard_command) {

//         let playerCenter = this.flink_x + (this.flink_width * this.scale) / 2;
//         let i = 0

//         for (; i < fl1nk_maze_design.ladders.length;) {

//         let ladder = fl1nk_maze_design.ladders[i];
//         i = i + 1


//         // Check if FL1NK is near the ladder
//         if (playerCenter >= ladder.x - 35 &&
//             playerCenter <= ladder.x + 35) {

//             // Move up
//             if (keyboard_command === "ArrowUp") {
//                 if (current_deck === ladder.bottomPoint) {
//                     updated_deck_info(ladder.topPoint);
//                     break;
//                 }
//             }

//             // Move down
//             if (keyboard_command === "ArrowDown") {
//                 if (current_deck === ladder.topPoint) {
//                     updated_deck_info(ladder.bottomPoint);
//                     break;
//                 }
//             }}}

//             function keyboard_command(event) {

//             // key down code
//             if (event.type === "keydown") {
//                 user_key_pressed[event.key] = true;

//                 if (event.repeat === false) {
//                     if (fl1nk_maze_design.ladders) {
//                         climb_ladder(event.key);
//                     }}}

//             // key up code
//             if (event.type === "keyup") {
//                 user_key_pressed[event.key] = false;
//             }}

//             move_fl1nk_left_right(){


//             // move right
//             if (user_key_pressed["ArrowRight"]){
//             flink_x = flink_x + 6;
//             }
//             // move left
//             if (user_key_pressed["ArrowLeft"]) {
//                 flink_x = flink_x - 6;
//             }

//             flink_x = player_maze_limits(flink_x, flink_width, current_deck);
//             display_game_elements();
//         }

//         function animate(){
//         context.drawImage(
//             fl1nk_spirate_sheet,
//             2 * fl1nk_frame;
//             0;
//             fl1nk_frame.position.width,
//             fl1nk_frame.position.height,
//             flink_x,
//             flink_y,
//             flink_width,
//             flink_height
//     );
// }}

// const fl1nk = new Player_Fl1nk();

// // get the json file, load and extract content, start gthe game
// fetch("assets/data/fl1nk-maze-layout.json")
// .then(file_data => file_data.json())
// .then(maze_data => {fl1nk_maze_design = maze_data; updated_deck_info(current_deck); run_game();});

// // display game elemets, and clear them as fl1nk proceeds game
// function display_game_elements() {
//     context.clearRect(0, 0, pirate_maze_canvas.width, pirate_maze_canvas.height);
//     display_coins();
//     draw_fl1nk_animation();
// }

// // call the methods and make it work
// document.addEventListener("keydown", keyboard_command);
// document.addEventListener("keyup", keyboard_command);

// function run_game() {

//     move_fl1nk_left_right();
//     move_pirate();
//     draw_pirate();
//     draw_key();
//     draw_poison();
//     draw_treasure();
//     check_poison_collision();   
//     check_coin_collection();
//     check_key_collection();
//     check_treasure_collection();
//     requestAnimationFrame(run_game);
// }

import { Player_Fl1nk } from "./player_fl1nk.js";
