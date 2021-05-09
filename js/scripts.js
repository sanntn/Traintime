let url = 'https://rata.digitraffic.fi/api/v1/live-trains/station/KTÖ?departing_trains=30&include_nonstopping=false';


(async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        parseData(data);

    } catch (error) {
        console.error(error)
    }

})()

function parseData(data) {

    let listingArr = [];

    for (let index = 0; index < 35; index++) {

        let stations = data[index].timeTableRows;

        for (let station = 0; station < stations.length; station++) {

            if (stations[station].stationShortCode === 'KTÖ' && stations[station].type === 'DEPARTURE' && !stations[station].actualTime) {

                let listing = {
                    trainNumber: data[index].commuterLineID,
                    track: stations[station].commercialTrack,
                    destination: stations[stations.length - 1].stationShortCode,
                    utcDate: data[index].timeTableRows[station].scheduledTime
                }

                listingArr.push(listing);

            }

        }

    }

    listingArr.sort(function (a, b) {
        return a.utcDate.localeCompare(b.utcDate);
    })

    displayItems(listingArr);

}

function displayItems(data) {

    for (let time = 0; time < data.length; time++) {
        let localDate = new Date(data[time].utcDate)
        localDate = localDate.toLocaleTimeString(navigator.language, {
            hour: '2-digit',
            minute: '2-digit'
        });

        data[time].utcDate = localDate;

    }

    for (let index = 0; index < data.length; index++) {

        let tableListing = '<li class="table-listing">';
        tableListing += '<ul class="table-listing__wrapper">';
        tableListing += '<li class="listing__train">' + data[index].trainNumber + '</li>';
        tableListing += '<li class="listing_time">' + data[index].utcDate + '</li>';
        tableListing += '<li class="listing_destination">' + data[index].destination + '</li>';
        tableListing += '<li class="listing_track">' + data[index].track + '</li>';
        tableListing += '</ul>';
        tableListing += '</li>';

        document.getElementById('timeTable').innerHTML += tableListing;

    }

}