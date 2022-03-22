var emoji2copy;
var nbOfCol;
var tmpCol;
var copyBtn = document.querySelector('.copy');
var emojiTrad = [];
var textCopied = "";
var j = 1;

copyBtn.addEventListener('click', () => {
    emoji2copy = document.querySelectorAll('.table-result tr td i');
    nbOfCol = document.querySelectorAll('.table-result > tr:first-child td').length;
    tmpCol = nbOfCol;
    textCopied = "ROTUS " + emoji2copy.length/nbOfCol + "/6\n\n";
    for(let i = 0; i < emoji2copy.length; i++){
        if(emoji2copy[i].style.color == "rgb(40, 255, 191)"){
            emojiTrad[i] = "🟩";
        }
        if(emoji2copy[i].style.color == "rgb(154, 220, 255)"){
            emojiTrad[i] = "🟦";
        }
        if(emoji2copy[i].style.color == "rgb(0, 0, 0)"){
            emojiTrad[i] = "⬛";
        }
        if(nbOfCol/(i+1) == j){
            console.log(nbOfCol);
            nbOfCol = tmpCol + nbOfCol;
            textCopied += emojiTrad.join("") + "\n";
            console.log(emojiTrad);
            console.log(nbOfCol + " / " + i + " / " + j + " / " + textCopied);
            emojiTrad = [];
        }
    }
    textCopied += emojiTrad.join("") + "\n";
    textCopied += "\n\nhttps://romainthibaud.com/Rotus";
    navigator.clipboard.writeText(textCopied);
    document.querySelector('.popup').style.display = "block";
    setTimeout(() => {
        document.querySelector('.popup').style.display = "none";
    },1500);
});
