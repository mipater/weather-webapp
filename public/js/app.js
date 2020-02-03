const log = console.log

const weatherForm = document.querySelector('form')
const searchLocation = document.querySelector('form input')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    cleanMsgs()

    const location = searchLocation.value;
    const errorMsgEl = document.getElementById('emptyInputMsg')

    if (location !== null && location.length > 0) {
        fetch('/weather?address=' + location).then((response) => {
            response.json().then((data) => {
                if (!data.error)
                    showForecastData(data)
                else showErrorMsg(errorMsgEl, data.error)
            })
        })
    } else {
        showErrorMsg(errorMsgEl, "You have to insert a location first")
    }

})

showForecastData = (data) => {
    const forecastDataEl = document.getElementById("forecastData")
    const locationNameEl = document.getElementById("locationName")

    locationNameEl.textContent = data.locationName

    for (key in data["forecast"]) {
        var tr = document.createElement('tr'),
            th = document.createElement('th'),
            td = document.createElement('td');

        forecastDataEl.insertAdjacentElement('beforeend', tr)

        th.textContent = key
        td.textContent = data["forecast"][key]

        tr.insertAdjacentElement('beforeend', th)
        tr.insertAdjacentElement('beforeend', td)
    }

}

cleanMsgs = () => {
    const dataEl = document.getElementById("forecastData")
    const errorMsgEl = document.getElementById('emptyInputMsg')

    while (dataEl.firstChild) 
        dataEl.removeChild(dataEl.firstChild);
    
    deleteErrorMsg(errorMsgEl)
}

showErrorMsg = (e, m) => {
    e.textContent = m
    e.style.display = 'block'
}

deleteErrorMsg = (e) => {
    e.textContent = ""
    e.style.display = 'none'
}