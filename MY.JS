// Check whether FL1NK touches an obstacle
// function touchesObstacle(player, obstacle) {
//     // Smaller collision area for FL1NK
//     const playerX = player.horizontal_position + 25;
//     const playerY = player.vertical_position + 20;
//     const playerWidth = player.width - 50;
//     const playerHeight = player.height - 30;

//     if (playerX >= obstacle.x + obstacle.width) {
//         return false;
//     }

//     if (playerX + playerWidth <= obstacle.x) {
//         return false;
//     }

//     if (playerY >= obstacle.y + obstacle.height) {
//         return false;
//     }

//     if (playerY + playerHeight <= obstacle.y) {
//         return false;
//     }

//     return true;
// }