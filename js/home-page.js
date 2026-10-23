
const first_part = document.querySelector("#first-line");
const second_part = document.querySelector("#second-line");

const first_text = "THE MAZE";
const second_text = "WON'T STAY STILL";

function textTypingEffect(element, text, i = 0) {
    if (i < text.length) {
        element.textContent += text[i];
        setTimeout(() => textTypingEffect(element, text, i + 1), 100);
        
    } else if (element === first_part) {
        textTypingEffect(second_part, second_text);
    }
}

textTypingEffect(first_part, first_text);
