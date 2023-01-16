async function getEvents() {
    let xml = await $.get("xml/Events.xml")
    let events = $(xml).find("Event")
    const eventsList = []
    $(events).each(function () {
        let event = new Object()
        event["ID"] = $(this).find("ID").text()
        event["name"] = $(this).find("name").text()
        event["description"] = $(this).find("description").text()
        event["location"] = $(this).find("location").text()
        event["startingDay"] = $($(this).find("fromDate").find("day")).text()
        event["startingMonth"] = $($(this).find("fromDate").find("month")).text()
        event["startingYear"] = $($(this).find("fromDate").find("year")).text()
        event["startingTime"] = $(this).find("fromHours").text() + ":" + $(this).find("fromMinutes").text()
        event["startingHour"] = $(this).find("fromHours").text()
        event["startingMinute"] = $(this).find("fromMinutes").text()
        event["endingDay"] = $($(this).find("toDate").find("day")).text()
        event["endingMonth"] = $($(this).find("toDate").find("month")).text()
        event["endingYear"] = $($(this).find("toDate").find("year")).text()
        event["endingTime"] = $(this).find("toHours").text() + ":" + $(this).find("toMinutes").text()
        event["endingHour"] = $(this).find("toHours").text()
        event["endingMinute"] = $(this).find("toMinutes").text()
        event["link"] = $(this).find("link").text()

        eventsList.push(event)
    })
    return eventsList
}

let events = await getEvents()
let currentDate = Date.now()
let text = ""
for (let i = 0; i < events.length; i++) {
    let eventDate = new Date(events[i].endingYear, events[i].endingMonth, events[i].endingDay, events[i].endingHour, events[i].endingMinute)
    text += "                        <div class=\"carousel-item active\">\n" +
        "                            <div class=\"card\" style=\"width: auto\">\n" +
        "                                <img src=\"images/chess.png\" class=\"card-img-top\" alt=\"Chess\">\n" +
        "                                <div class=\"card-body\">\n" +
        "                                    <h5 class=\"card-title\">" + events[i].name + "</h5>\n"
    if (events[i].startingDay === events[i].endingDay && events[i].endingMonth === events[i].startingMonth) {
        text += "<p class=\"card-text\">Date: " + events[i].startingDay + "/" + events[i].startingMonth + " " + events[i].startingTime + " - " + events[i].endingTime + "</p>\n"
    } else {
        text += "<p class=\"card-text\">Date: " + events[i].startingDay + "/" + events[i].startingMonth + " " + events[i].startingTime + " - " + events[i].endingDay + "/" + events[i].endingMonth + " " + events[i].endingTime + "</p>\n"
    }
    text +=
        "                                    <p class=\"card-text\">Location: " + events[i].location + "</p>\n" +
        "                                    <p class=\"card-text\">Description: " + events[i].description + "</p>\n"
    text += "<a href=\"" + events[i].link + "\" class=\"btn btn-primary\">More Info</a>"

    text +=
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>"
}
console.log(text)
$("#carousel").html(text)
console.log($("#carousel").html())

