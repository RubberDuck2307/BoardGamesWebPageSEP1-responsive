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
        boardGame["rating"] = 0
        boardGame["amountOfRatings"] = 0
        BoardGamesList.push(boardGame)
    })

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

async function getElection() {
    let xml = await $.get("xml/Election.xml")
    let election = $(xml).find("Election")
    if ($(xml).find("startingDate").length == 0) {
        return null
    } else {
        let electionObject = new Object()
        electionObject["startingDay"] = $($(election[0]).find("startingDate")).find("day").text()
        electionObject["startingMonth"] = $($(election[0]).find("startingDate")).find("month").text()
        electionObject["startingYear"] = $($(election[0]).find("startingDate")).find("year").text()
        electionObject["endingDay"] = $($(election[0]).find("endingDate")).find("day").text()
        electionObject["endingMonth"] = $($(election[0]).find("endingDate")).find("month").text()
        electionObject["endingYear"] = $($(election[0]).find("endingDate")).find("year").text()
        return electionObject
    }
}


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

async function calculateRatings() {
    let xml = await $.get("xml/Ratings.xml")
    let ratings = $(xml).find("Rating")
    const highRatedGames = []
    $(ratings).each(function () {
        for (let i = 0; i < boardGames.length; i++) {
            if ($(this).find("gameID").text() == boardGames[i].ID) {
                boardGames[i]["rating"] += parseInt($(this).find("value").text())
                boardGames[i]["amountOfRatings"] += 1
            }
        }

    })
    for (let i = 0; i < boardGames.length; i++) {
        boardGames[i]["averageRating"] = parseInt(boardGames[i].rating) / parseInt(boardGames[i].amountOfRatings)
        if (boardGames[i]["averageRating"] >= 4 && boardGames[i].availabilityStatus == "Available") {
            highRatedGames.push(boardGames[i])
        }
    }
    return highRatedGames
}


let reservations = await getReservation()
let boardGames = await getBoardGames()
await calculateRatings()
let players = await getPlayers()
let borrowings = await getCurrentBorrowings()


let textSmallTable = "<p class=\"description\">You can borrow these board games:</p> "
let textBigTable = "<p class=\"description\">You can borrow these board games:</p> <div class=\"row\">\n"

let highRatedGames = await calculateRatings()
if (highRatedGames.length < 4) {
    for (let i = 0; i < highRatedGames.length; i++) {
        let owner
        if (highRatedGames[i].ownerID == 0) {
            owner = "Association"
        } else {
            for (let j = 0; j < players.length; j++) {
                if (highRatedGames[i].ownerID == players[j].ID) {
                    owner = players[j].name
                    break
                }
            }
        }

        textSmallTable += " <div class=\"row\">\n" +
            "                <div class=\"col-12 d-grid\">\n" +
            "                    <a class=\"btn btn-primary text-start\" data-bs-toggle=\"collapse\" href=\"#game" + i + "\" role=\"button\"\n" +
            "                       aria-expanded=\"false\"\n" +
            "                       aria-controls=\"game" + i + "\">" + highRatedGames[i]["name"] + " <img src=\"images/star-vector-png-transparent-image-pngpix-21.png\" class=\"star mb-1 me-1 float-end\" alt= \"star\"> </a>\n" +
            "                    <div class=\"collapse\" id=\"game" + i + "\">\n" +
            "                        <table class=\"table\">\n" +
            "                            <tr>\n" +
            "                                <th>Number of players</th>\n" +
            "                                <td>" + highRatedGames[i]["numberOfPlayersMin"] + " - " + highRatedGames[i].numberOfPlayersMax + "</td>\n" +
            "                            </tr>\n" +
            "                            <tr>\n" +
            "                                <th>Genre</th>\n" +
            "                                <td>" + highRatedGames[i].type + "</td>\n" +
            "                            </tr>\n" +
            "                            <tr>\n" +
            "                                <th>Owner</th>\n" +
            "                                <td>" + owner + "</td>\n" +
            "                            </tr>\n" +
            "                        </table>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>"


        textBigTable +=
            "                <div class=\"col-md-6 col-lg-4 d-grid p-4\">\n" +
            "                    <table class=\"table \">\n" +
            "                        <thead class=\"tableHead\">\n" +
            "                            <th colspan=\"2\" class=\"align-items-center\">" + highRatedGames[i].name + "\n" +
            "                                <img src=\"images/star-vector-png-transparent-image-pngpix-21.png\" class=\"star mb-1 me-1 float-end\"></th>" +
            "                        </thead>\n" +
            "                        <tr >\n" +
            "                                <th>Number of players</th>\n" +
            "                                <td>" + highRatedGames[i]["numberOfPlayersMin"] + " - " + highRatedGames[i].numberOfPlayersMax + "</td>\n" +
            "                            </tr>\n" +
            "                            <tr>\n" +
            "                                <th>Genre</th>\n" +
            "                                <td>" + highRatedGames[i].type + "</td>\n" +
            "                            </tr>\n" +
            "                            <tr>\n" +
            "                                <th>Owner</th>\n" +
            "                                <td>" + owner + "</td>\n" +
            "                            </tr>\n" +
            "                        </table>\n" +
            "                    </div>\n"
    }
} else {
    const randoms = []
    let index = 0
    for (; randoms.length < 3;) {
        let random = Math.floor(Math.random() * highRatedGames.length)
        if (!randoms.includes(random)) {
            randoms.push(random)
        }
    }
    randoms.forEach(function (int) {
        let boardGame = highRatedGames[int]


        let owner
        if (boardGame.ownerID == 0) {
            owner = "Association"
        } else {
            for (let j = 0; j < players.length; j++) {
                if (boardGame.ownerID == players[j].ID) {
                    owner = players[j].name
                    break
                }
            }
        }

        textSmallTable += " <div class=\"row\">\n" +
            "                <div class=\"col-12 d-grid\">\n" +
            "                    <a class=\"btn btn-primary text-start\" data-bs-toggle=\"collapse\" href=\"#game" + index + "\" role=\"button\"\n" +
            "                       aria-expanded=\"false\"\n" +
            "                       aria-controls=\"game" + index + "\">" + boardGame["name"] + "<img src=\"images/star-vector-png-transparent-image-pngpix-21.png\" class=\"star mb-1 me-1 float-end\"></a>\n" +
            "                    <div class=\"collapse\" id=\"game" + index + "\">\n" +
            "                        <table class=\"table\">\n" +
            "                            <tr>\n" +
            "                                <th>Number of players</th>\n" +
            "                                <td>" + boardGame["numberOfPlayersMin"] + " - " + boardGame.numberOfPlayersMax + "</td>\n" +
            "                            </tr>\n" +
            "                            <tr>\n" +
            "                                <th>Genre</th>\n" +
            "                                <td>" + boardGame.type + "</td>\n" +
            "                            </tr>\n" +
            "                            <tr>\n" +
            "                                <th>Owner</th>\n" +
            "                                <td>" + owner + "</td>\n" +
            "                            </tr>\n" +
            "                        </table>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>"


        textBigTable +=
            "                <div class=\"col-md-6 col-lg-4 d-grid p-4\">\n" +
            "                    <table class=\"table \">\n" +
            "                        <thead class=\"tableHead\">\n" +
            "                            <th colspan=\"2\" class=\"align-items-center\">" + boardGame.name + "\n" +
            "                                <img src=\"images/star-vector-png-transparent-image-pngpix-21.png\" class=\"star mb-1 me-1 float-end\"></th>" +
            "                        </thead>\n" +
            "                        <tr >\n" +
            "                                <th>Number of players</th>\n" +
            "                                <td>" + boardGame["numberOfPlayersMin"] + " - " + boardGame.numberOfPlayersMax + "</td>\n" +
            "                            </tr>\n" +
            "                            <tr>\n" +
            "                                <th>Genre</th>\n" +
            "                                <td>" + boardGame.type + "</td>\n" +
            "                            </tr>\n" +
            "                            <tr>\n" +
            "                                <th>Owner</th>\n" +
            "                                <td>" + owner + "</td>\n" +
            "                            </tr>\n" +
            "                        </table>\n" +
            "                    </div>\n"
        index += 1
    })
}

let index = 3

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
            "                    <a class=\"btn btn-primary text-start\" data-bs-toggle=\"collapse\" href=\"#game" + index + "\" role=\"button\"\n" +
            "                       aria-expanded=\"false\"\n" +
            "                       aria-controls=\"game" + index + "\">" + boardGames[i]["name"] + " <div class=\"rounded-circle" + availability + "border border-light border-2 float-end\"></div></a>\n" +
            "                    <div class=\"collapse\" id=\"game" + index + "\">\n" +
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

        console.log(borrowedTo)
        if (!borrowedTo == "") {

            textSmallTable += "                            <tr>\n" +
                "                                <th>Borrowed to</th>\n" +
                "                                <td> "+ borrowedTo + "</td>\n" +
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
                "                                <th>Borrowed to</th>\n" +
                "                                <td>"+ borrowedTo +"</td>\n" +
                "                            </tr>\n"
        }
        textBigTable +=
            "                        </table>\n" +
            "                    </div>\n"

        index += 1
    }
}
textSmallTable += "</div> </div> </div> "
textBigTable += "</div>"
$("#catalogueSmallTable").html(textSmallTable)
$("#catalogueBigTable").html(textBigTable)
let reservationTableText = "<h4 class='text-center mb-3'>Reservations</h4>"


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
                    "                            <th>Reserved by</th>\n" +
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

let textElectionBig = ""
let textElectionSmall = ""

let election = await getElection()

if (election != null) {
    textElectionBig += "        <h2 class=\"text-center\"> Election </h2>\n" +
        "                       <p class = \"description\">There are ongoing election about a new board game till  " + election.endingDay +"/" + election.endingMonth +"/" + election.endingYear + "</p> " +
        "                       <p class='description'>You can vote for these games:</p>"      +
        "                       <div class=\"row\">"
    textElectionSmall += "  <h2 class=\"text-center\"> Election </h2>\n" +
        "                   <p class = \"description\">There are ongoing election about a new board game till "+ election.endingDay +"/" + election.endingMonth +"/" + election.endingYear + "</p>" +
        "                   <p class='description'>You can vote for these games:</p>\  <div class=\"row\">"
    for (let i = 0; i < boardGames.length; i++) {
        if (boardGames[i].availabilityStatus == "Considered to be bought") {
            textElectionBig +=
                " <div class=\"col-md-6 col-lg-4 d-grid p-4\">\n" +
                "                    <table class=\"table\">\n" +
                "                        <tr class=\"tableHead\">\n" +
                "                            <th colspan=\"2\">" + boardGames[i].name +
                "                            </th>\n" +
                "\n" +
                "                        </tr>\n" +
                "                        <tr>\n" +
                "                            <th>Number of players</th>\n" +
                "                            <td>" + boardGames[i].numberOfPlayersMin + "-" + boardGames[i].numberOfPlayersMax + "</td>\n" +
                "                        <tr>\n" +
                "                            <th>Genre</th>\n" +
                "                            <td>" + boardGames[i].type + "</td>\n" +
                "                        </tr>" +
                "                        </table>\n" +
                "                    </div>\n"

            textElectionSmall += "<div class=\"col-12 d-grid\">\n" +
                "                    <a class=\"btn btn-primary text-start\" data-bs-toggle=\"collapse\" href=\"#CTBB1\" role=\"button\"\n" +
                "                       aria-expanded=\"false\"\n" +
                "                       aria-controls=\"CTBB1\">"+ boardGames[i].name +"\n" +
                "                    </a>\n" +
                "                    <div class=\"collapse\" id=\"CTBB1\">\n" +
                "                        <table class=\"table\">\n" +
                "                            <tr>\n" +
                "                                <th>Number of players</th>\n" +
                "                                <td>" + boardGames[i].numberOfPlayersMin + "-" + boardGames[i].numberOfPlayersMax + "</td>\n" +
                "                            </tr>\n" +
                "                            <tr>\n" +
                "                            <th>Genre</th>\n" +
                "                            <td>" + boardGames[i].type + "</td>\n" +
                "                            </tr>\n" +
                "                        </table>\n" +
                "                    </div> "
        }
    }
    textElectionBig +=
        "            </div>\n" +
        "        </div>"
    textElectionSmall += "                </div>\n" +
        "            </div>\n" +
        "        </div>"
}
$("#ElectionBig").html(textElectionBig)
$("#electionSmall").html(textElectionSmall)






