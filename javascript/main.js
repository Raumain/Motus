var today = new Date();
var userID =  Math.floor(today.getFullYear()*today.getMonth()*today.getDate());
var canPlay = true;

function createCookie(name,value) {
    var date = new Date();
    date.setHours(23,59,59,0);
    var expires = "; expires="+date.toGMTString();
    document.cookie = name+"="+value+expires+"; path=/";
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
function checkCookie(name) {
  let user = getCookie(name);
  if (user == "") {
        canPlay = true;
  } 
  else {
        canPlay = false;
  }
  return canPlay;
}

if(getCookie("cameAtLeastOnce") != "true"){
    localStorage.clear(); 
    createCookie("cameAtLeastOnce", "true");
}

if(checkCookie("played") == true){
    
    
var dico = fetch("LeMotEstDansCeFichier.txt") //Dictionnaire contenant la liste de mot
.then(function(data){
    return data.text();
})
.then(function(text){
    var randomWord = text;
    randomWord = randomWord.split('\r')[0];
    randomWord = randomWord.split('\n')[0];
    var tabWord = []; //tableau pour stocker individuellement chaque lettre du mot random
    var firstLine = document.querySelector('.first-line');
    var lines = document.querySelectorAll('.lines');


    randomWord = randomWord.toUpperCase();
    var randomWordLength = randomWord.length;
    if(randomWord.split('\r').length > 1 || randomWord.split('\n').length > 1){
        randomWordLength =randomWord.length-1;
    }

    function createElement(element, parent, content){
        newElement = document.createElement(element);
        newElement.innerHTML = content
        parent.appendChild(newElement);
    }
    
    /* CREATION DE LA GRILLE DE JEU */
    async function CreateGrid(){
        for(let i = 0; i < randomWordLength; i++){
            tabWord[i] = randomWord[i];
            createElement("td", firstLine, "_");
            for(let j = 0; j < 5; j++){
                createElement("td", lines[j], "_");
            }
            
        }
        document.querySelector(".first-line > td").innerHTML = tabWord[0];
    }
    
    CreateGrid()
    .then(function(){
        var td = document.querySelectorAll('td');
        for(let k = 0; k < td.length; k++){
            if(td[k].innerHTML == "_"){
                td[k].style.fontWeight = "100";
            }
        }
    })
    .catch(error => {console.log(error)});

    /* KEYBOARD */

    var touches = document.querySelectorAll(".touche");
    var efface = document.querySelector(".efface");
    var entre = document.querySelector(".entre");
    var line2write = document.querySelector(".set");
    var td2write = line2write.children;
    var isWritable = true;
    var stop = false;
    if(localStorage.length != 0){
        var td = document.querySelectorAll('td');
        for(let i = 0; i < localStorage.length; i++){
            if(localStorage.getItem("letter"+i) != undefined){
                td[i].innerHTML = localStorage.getItem("letter"+i);
                td[i].style.background = localStorage.getItem('color'+i);
                if(td[i].innerHTML == "_"){
                    td[i].style.fontWeight = "100";
                }
            }
        }   
        for(let j = 0; j < td.length; j++){
            if(td[j].innerHTML == "_" && !stop){
                stop = true;
                line2write = td[j].parentElement;
            }
        }
        td2write = line2write.children;
        td2write[0].innerHTML = randomWord[0];
        td2write[0].style.fontWeight = "bold";
    }

    // Réaction à un clic sur une touche du clavier, en vérifiant qu'on écrit dans la bonne case du tableau
    for(let i = 0; i < touches.length-2; i++){
        touches[i].onclick = () => {
            isWritable = true;
            AddLetter(touches[i].innerHTML, isWritable);
        }
    }
    efface.onclick = () => {
        var containLetter = true;
        for(let k = 0; k < td2write.length; k++){
            if(td2write[k].innerHTML == "_" && k-1 != 0 && containLetter){ //on vérifie qu'on efface bien la dernière case de la ligne mais pas la première
                td2write[k-1].innerHTML = "_";
                td2write[k-1].style.fontWeight = "100";
                containLetter = false;
            }
            if(td2write[k] == td2write[td2write.length-1]){ //Si toute la ligne est remplie
                td2write[td2write.length-1].innerHTML = "_";
                td2write[td2write.length-1].style.fontWeight = "100";
            }
        }
        
    }
    entre.onclick = () => {
        
        var guess = "";
        var tabGuess = [];
        if(td2write[td2write.length-1].innerHTML != "_"){ //on vérifie que la ligne est complète
            
            for(let l = 0; l < line2write.children.length; l++){
                guess += line2write.children[l].innerHTML;  //on assemble toutes les lettres pour en faire un mot
                tabGuess[l] = line2write.children[l].innerHTML;
            }
            var strTabWord = tabWord.join("");
            if(guess == strTabWord.toUpperCase()){ //gagné
                for(let p = 0; p < guess.length; p++){
                    td2write[p].style.background = "#28FFBF";
                    changeBgColorKeyboard(td2write[p].innerHTML, "#28FFBF");
                }
                GetResultEmoji();
                DisplayEmojiGrid(".win");
                createCookie("played", userID);
                localStorage.clear();
            }
            else{
                //On compare chaque lettre du guess à chaque lettre du mot random
                for(let m = 0; m < guess.length; m++){ // Cas où la lettre existe et est bien placé
                    if(tabGuess[m]==tabWord[m]){
                        td2write[m].style.background = "#28FFBF";
                        tabWord[m] = "_"; 
                        tabGuess[m] = "-";
                        changeBgColorKeyboard(td2write[m].innerHTML, "#28FFBF");
                    }
                }
                for(let n = 0; n < tabWord.length; n++){ // Cas où la lettre existe et est mal placé
                    for(let w = 0; w < tabGuess.length; w++){
                        if(tabWord[n]==tabGuess[w]){
                            td2write[w].style.background = "#9ADCFF";
                            tabWord[n] = "_"; 
                            tabGuess[w] = "-";
                            changeBgColorKeyboard(td2write[w].innerHTML, "#9ADCFF");
                        }
                    }
                   
                }
                //On remet le tableau de lettre à sa valeur initiale : le mot random
                for(let o = 0; o < randomWordLength; o++){
                    tabWord[o] = randomWord[o];
                    tabGuess[o] = guess[o];
                }
                written = true;
                //On passe à la ligne suivante en remettant la première lettre du mot random
                if(document.querySelector('.unset') != undefined){
                    var td = document.querySelectorAll('td');
                    var stop2 = false;
                    for(let j = 0; j < td.length; j++){
                        if(td[j].innerHTML == "_" && !stop2){
                            stop2 = true;
                            line2write = td[j].parentElement;
                            line2write.classList.remove("unset");
                        }
                    }
                    td2write = line2write.children;
                    td2write[0].innerHTML = randomWord[0];
                    td2write[0].style.fontWeight = "bold";
                }
                else{ //Perdu
                    GetResultEmoji();
                    DisplayEmojiGrid(".loose");
                    createCookie("played", userID);
                    localStorage.clear();
                }
            }
            save = Save();
        }
    }

    async function AddLetter(value, check){
        for(let j = 0; j < td2write.length; j++){
            if(td2write[j].innerHTML == "_" && check){
                td2write[j].innerHTML = value;
                td2write[j].style.fontWeight = "bold";
                check = false;
            }
        }
    }
    function GetResultEmoji(){
        var tdResult = document.querySelectorAll('.table td');
        var emoji = [];
        var emojiResult = new Array(6);
        var cpt = 0;
        for(let i = 0; i < tdResult.length; i++){
            if(tdResult[i].innerHTML != "_"){
                if(tdResult[i].style.background == ''){
                    emoji[i] = "rgb(0, 0, 0)";
                }
                else{
                    emoji[i] = tdResult[i].style.background;
                }
                
            }
        }
        for(let j = 0; j < 6; j++){
            emojiResult[j] = new Array(emoji.length);
            for(let k = 0; k < randomWordLength; k++){
                emojiResult[j][k] = emoji[cpt];
                cpt++;
            }
        }
        return emojiResult;
    }
    
    function DisplayEmojiGrid(result){
        var t = GetResultEmoji();
        var tSize = t[0].length/randomWordLength;
        document.querySelector('.lockscreen').style.display = "block";
        document.querySelector(result).style.display = "flex";
        document.querySelector('.word').innerHTML += randomWord; 
        for(let a = 0; a < 6; a++){
            createElement("tr", document.querySelector(result+' .table-result'), "");
            for(let b = 0; b < (t[0].length)/tSize; b++){
                if(t[a][b] != undefined){
                    createElement("td", document.querySelectorAll('.table-result tr')[a], "<i class=\"fa-solid fa-square\" style=\"color: "+t[a][b]+"\"></i>")
                }
            }
        }
    }
   
    function Save(){
        var tableSave = document.querySelectorAll('.table tbody tr td');
        for(let i = 0; i < tableSave.length; i++){
            localStorage.setItem("letter"+i, tableSave[i].innerHTML);
            localStorage.setItem("color"+i, tableSave[i].style.background);
        }
    }
    function changeBgColorKeyboard(letter, color){
        for(let i = 0; i < touches.length-2; i++){
            if(letter == touches[i].innerHTML){
                touches[i].style.background = color;
            }
        }
    }

})
.catch();

}
else{
    document.querySelector('.content').innerHTML = "";
    document.querySelector('.lockscreen').style.display = "flex";
    document.querySelector('.lockscreen').innerHTML = "<h1>Vous avez déjà tenté votre chance pour aujourd'hui !</h1><br /><p>Revenez demain :)</p>";
}