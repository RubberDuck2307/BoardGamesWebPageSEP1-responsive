async function getBoardGames() {
    let xml = await $.get("xml/BoardGames.xml")
    let BoardGames = $(xml).find("BoardGame")
    const BoardGamesList = []
    $(BoardGames).each(function () {
        let boardGame = new Object()
        boardGame["ID"] = $(this).find("ID").text()
        boardGame["name"] = $(this).find("name").text()
        boardGame["type"] = $(this).find("type").text()
        boardGame["numberOfPlayersMin"] = $(this).find("numberOfPlayersMin").text()
        boardGame["numberOfPlayersMax"] = $(this).find("numberOfPlayersMax").text()
        boardGame["availabilityStatus"] = $(this).find("availabilityStatus").text()
        boardGame["ownerID"] = $(this).find("ownerID").text()
        boardGame["numberOfVotes"] = $(this).find("numberOfVotes").text()
        BoardGamesList.push(boardGame)
    })
    console.log(BoardGamesList.length)
    return BoardGamesList
}


async function getPlayers() {
    let xml = await $.get("xml/Players.xml")
    let players = $(xml).find("Player")
    const playersList = []
    $(players).each(function () {
        let player = new Object()
        player["ID"] = $(this).children("ID").text()
        player["name"] = $(this).find("name").text()
        playersList.push(player)
    })
    console.log(playersList)
    return playersList
}

async function getCurrentBorrowings() {
    let xml = await $.get("xml/CurrentBorrowings.xml")
    let borrowings = $(xml).find("Borrowing")
    const borrowingsList = []
    $(borrowings).each(function () {
        let borrowing = new Object()
        borrowing["ID"] = $(this).find("ID").text()
        borrowing["playerID"] = $(this).find("playerID").text()
        borrowing["gameID"] = $(this).find("gameID").text()
        borrowing["day"] = $($(this).find("to")).find("day").text()
        borrowing["month"] = $($(this).find("to")).find("month").text()
        borrowing["year"] = $($(this).find("to")).find("year").text()
        borrowingsList.push(borrowing)
    })
    return borrowingsList
}

console.log(await getCurrentBorrowings())

async function getReservation() {
    let xml = await $.get("xml/Reservations.xml")
    let reservations = $(xml).find("reservation")
    const reservationsList = []
    $(reservations).each(function () {
        let reservation = new Object()
        reservation["ID"] = $(this).find("ID").text()
        reservation["playerID"] = $(this).find("playerID").text()
        reservation["gameID"] = $(this).find("gameID").text()
        reservation["fromDay"] = $($(this).find("from")).find("day").text()
        reservation["fromMonth"] = $($(this).find("from")).find("month").text()
        reservation["fromYear"] = $($(this).find("from")).find("year").text()
        reservation["toDay"] = $($(this).find("to")).find("day").text()
        reservation["toMonth"] = $($(this).find("to")).find("month").text()
        reservation["toYear"] = $($(this).find("to")).find("year").text()
        reservationsList.push(reservation)
    })
    return reservationsList
}


let reservations = await getReservation()
let boardGames = await getBoardGames()
let players = await getPlayers()
let borrowings = await getCurrentBorrowings()


let textSmallTable = ""
let textBigTable = "<div class=\"row\">\n"


for (let i = 0; i < boardGames.length; i++) {

    let availability = ""
    let borrowedTo = ""
    let owner = ""
    let occupier = ""

    if (boardGames[i]["availabilityStatus"] == "Borrowed" || boardGames[i]["availabilityStatus"] == "Available") {

        if (boardGames[i]["availabilityStatus"] == "Borrowed") {
            availability = " redCircle "
            for (let j = 0; j < borrowings.length; j++) {
                if (borrowings[j]["gameID"] == boardGames[i]["ID"]) {
                    borrowedTo = borrowings[j].day + "/" + borrowings[j].month + "/" + borrowings[j].year
                    for (let k = 0; k < players.length; k++) {
                        if (players[k].id == borrowings[j].playerID) {
                            occupier = players[k].name
                            break
                        }
                    }
                    break
                }
            }
        } else {
            availability = " greenCircle "
            for (let j = 0; j < reservations.length; j++) {
                console.log("PAPX")
                console.log(reservations[j].gameID)
                if (reservations[j].gameID == boardGames[i].ID) {
                    availability = " yellowCircle "
                    break
                }
            }
        }

        if (boardGames[i].ownerID == 0) {
            owner = "Association"
        } else {
            for (let j = 0; j < players.length; j++) {
                if (boardGames[i].ownerID == players[j].ID) {
                    owner = players[j].name
                    break
                }
            }
        }


        textSmallTable += " <div class=\"row\">\n" +
            "                <div class=\"col-12 d-grid\">\n" +
            "                    <a class=\"btn btn-primary text-start\" data-bs-toggle=\"collapse\" href=\"#game" + i + "\" role=\"button\"\n" +
            "                       aria-expanded=\"false\"\n" +
            "                       aria-controls=\"game" + i + "\">" + boardGames[i]["name"] + " <div class=\"rounded-circle" + availability + "border border-light border-2 float-end\"></div></a>\n" +
            "                    <div class=\"collapse\" id=\"game" + i + "\">\n" +
            "                        <table class=\"table\">\n" +
            "                            <tr>\n" +
            "                                <th>Number of players</th>\n" +
            "                                <td>" + boardGames[i]["numberOfPlayersMin"] + " - " + boardGames[i].numberOfPlayersMax + "</td>\n" +
            "                            </tr>\n" +
            "                            <tr>\n" +
            "                                <th>Genre</th>\n" +
            "                                <td>" + boardGames[i].type + "</td>\n" +
            "                            </tr>\n" +
            "                            <tr>\n" +
            "                                <th>Owner</th>\n" +
            "                                <td>" + owner + "</td>\n" +
            "                            </tr>\n"

        if (!occupier == "") {
            textSmallTable +=
                "                            <tr>\n" +
                "                                <th>Occupier</th>\n" +
                "                                <td>Totally not Bob in disguise</td>\n" +
                "                            </tr>\n"
        }

        if (!borrowedTo == "") {

            textSmallTable += "                            <tr>\n" +
                "                                <th>Borrowed to:</th>\n" +
                "                                <td>17/10/2022</td>\n" +
                "                            </tr>\n"
        }

        textSmallTable +=
            "                        </table>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>"


        textBigTable +=
            "                <div class=\"col-md-6 col-lg-4 d-grid p-4\">\n" +
            "                    <table class=\"table \">\n" +
            "                        <thead class=\"tableHead\">\n" +
            "                            <th colspan=\"2\" class=\"align-items-center\">" + boardGames[i].name + " <div class=\" rounded-circle border border-2 border-light " + availability + " float-end\"></div></th>\n" +
            "                        </thead>\n" +
            "                        <tr >\n" +
            "                                <th>Number of players</th>\n" +
            "                                <td>" + boardGames[i]["numberOfPlayersMin"] + " - " + boardGames[i].numberOfPlayersMax + "</td>\n" +
            "                            </tr>\n" +
            "                            <tr>\n" +
            "                                <th>Genre</th>\n" +
            "                                <td>" + boardGames[i].type + "</td>\n" +
            "                            </tr>\n" +
            "                            <tr>\n" +
            "                                <th>Owner</th>\n" +
            "                                <td>" + owner + "</td>\n" +
            "                            </tr>\n"

        if (!occupier == "") {
            textBigTable +=
                "                            <tr>\n" +
                "                                <th>Occupier</th>\n" +
                "                                <td>Totally not Bob in disguise</td>\n" +
                "                            </tr>\n"
        }

        if (!borrowedTo == "") {

            textBigTable += "                            <tr>\n" +
                "                                <th>Borrowed to:</th>\n" +
                "                                <td>17/10/2022</td>\n" +
                "                            </tr>\n"
        }
        textBigTable +=
            "                        </table>\n" +
            "                    </div>\n"
    }
}
textSmallTable += "</div> </div> </div> "
textBigTable += "</div>"
$("#catalogueSmallTable").html(textSmallTable)
$("#catalogueBigTable").html(textBigTable)

let reservationTableText = "<div class=\"row\">"
for (let i = 0; i < boardGames.length; i++) {
    let size = 0;
    for (let j = 0; j < reservations.length; j++) {
        let name = ""
        if (reservations[j].gameID == boardGames[i].ID) {
            size = +1
            for (let k = 0; k < players.length; k++) {
                if (players[k].ID == reservations[j].playerID) ;
                {
                    name = players[k].name
                }
            }
            if (size != 0) {
                reservationTableText += "<div class=\"col-lg-6 d-grid offset-lg-3 col-md-8 offset-md-2\">\n" +
                    "                    <a class=\"btn btn-primary text-start\" data-bs-toggle=\"collapse\" href=\"#reservation" + i + "\" role=\"button\"\n" +
                    "                       aria-expanded=\"false\"\n" +
                    "                       aria-controls=\"reservation" + i + "\">" + boardGames[i].name + "\n" +
                    "                    </a>\n" +
                    "                    <div class=\"collapse\" id=\"reservation" + i + "\">\n" +
                    "                        <table class=\"table\">\n" +
                    "                            <thead>\n" +
                    "                            <th>Borrower</th>\n" +
                    "                            <th>From</th>\n" +
                    "                            <th>To</th>\n" +
                    "                            </thead>\n"

                reservationTableText +=
                    "                            <tr>\n" +
                    "                                <td>" + name + "</td>\n" +
                    "                                <td>" + reservations[j].fromDay + "/" + reservations[j].fromMonth + "/" + reservations[j].fromYear + "</td>\n" +
                    "                                <td>" + reservations[j].toDay + "/" + reservations[j].toMonth + "/" + reservations[j].toYear + "</td>\n" +
                    "                            </tr>\n"
            }
        }
    }
    reservationTableText +=
        "                        </table>\n" +
        "                    </div>" +
        "</div>"

}

reservationTableText += "            </div>\n" +
    "        </div>\n"
$("#reservationTable").html(reservationTableText)






