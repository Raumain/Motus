#!/usr/local/bin/php
<?php 
    $open = fopen("./www/Rotus/liste_francais.txt", "r") or die ("Problème d'ouverture du fichier liste");  
    $tab = array();
    $i = 0;
    $ligne2 = [];
    while(!feof($open)){
        $ligne2[$i] = fgets($open);
        $i++;
    }
    fclose($open);
    $randomWord = $ligne2[rand(0, sizeof($ligne2))];
    $randomWord = explode("\r", $randomWord)[0];
    while(strlen($randomWord) < 5 || strlen($randomWord) > 8){
        $randomWord = $ligne2[rand(0, sizeof($ligne2))];
        $randomWord = explode("\r", $randomWord)[0];
    }
    $open = fopen("./www/Rotus/LeMotEstDansCeFichier.txt", "w") or die ("Problème d'ouverture du fichier à écrire"); 
    fwrite($open, $randomWord);
?>