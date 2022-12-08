function readBoardGames(){
    $.get("xml/BoardGames.xml", function (xml){
        let boardGames =$(xml).find("BoardGame")
        return boardGames
    })}


export * from "FileReader.js"
