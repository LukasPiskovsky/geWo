/****ELEMENTS****/
const form = document.getElementById("settings-form")
const modeSwitcher = document.getElementById("mode-switch")
const viewSwitcher = document.getElementById("view-switch")
const settingsSection = document.getElementById("section-settings")
const greeting = document.getElementById("greeting")
const weather = document.getElementById("weather")
const toDoSection = document.getElementById("to-do")
const toDoOutput = document.getElementById("to-do-output")
const toDoForm = document.getElementById("to-do-container")
const searchEngine = document.getElementById("search-engine")
// let toDoInput = document.getElementById("to-do-input")
// let toDoButton = document.getElementById("to-do-button")
// let toDoDeadline = document.getElementById("to-do-deadline")


/****SWITCHERS****/

//Mode
let dayModeIcon = "img/light_mode_white.png"
let nightModeIcon = "img/dark_mode_white.png"

modeSwitcher.src = localStorage.getItem("mode") || dayModeIcon

let updateMode = () => {
    if (modeSwitcher.src.includes(dayModeIcon)) {
        document.documentElement.style.setProperty('--main-color', 'oklch(40% 0.05 200)')  //oklch(30% 0.15 200)
        document.documentElement.style.setProperty('--minor-color', 'oklch(100% 0.03 210)') //oklch(30% 0.15 210)
        document.documentElement.style.setProperty('--bg-color', '#222')  //#eee
        document.documentElement.style.setProperty('--txt-color', '#fff')  //#fff
        document.documentElement.style.setProperty('--body-color', '#222')  //#fff
    } else if (modeSwitcher.src.includes(nightModeIcon)) {
        document.documentElement.style.removeProperty('--main-color')
        document.documentElement.style.removeProperty('--minor-color')
        document.documentElement.style.removeProperty('--bg-color')
        document.documentElement.style.removeProperty('--txt-color')
        document.documentElement.style.removeProperty('--body-color')
    }
}
updateMode()

modeSwitcher.addEventListener("click", (e) => {
    modeSwitcher.src = modeSwitcher.src.includes(dayModeIcon) ? nightModeIcon : dayModeIcon
    localStorage.setItem("mode", e.target.src)

    updateMode()
})

//view
let wideView = "img/splitscreen_wide.png"
let tallView = "img/splitscreen_tall.png"

viewSwitcher.src = localStorage.getItem("view") ?? wideView

let updateView = () =>{
    if(viewSwitcher.src.includes(tallView)){
        weather.className = "right"
        toDoSection.className = "right2"
    } else if(viewSwitcher.src.includes(wideView)){
        weather.className = ""
        toDoSection.className = ""
    }
}
updateView()

viewSwitcher.addEventListener("click", (e) => {
    viewSwitcher.src = viewSwitcher.src.includes(wideView) ? tallView : wideView
    localStorage.setItem("view", e.target.src)
    
    updateView()
})

/****SETTINGS****/
//Arrow Rotation
let arrow = document.getElementById("arrow")
let settings = document.getElementById("settings")
let rotate = 0

arrow.addEventListener("click", function(){
        rotate += 180
        arrow.style.transform = `rotate(${rotate}deg)`
})

//User name
let userName = localStorage.getItem("name") || "user"
form.name.value = userName

//What sections to display
let isGreeting = JSON.parse(localStorage.getItem("greeting")) ?? true
let isWeather = JSON.parse(localStorage.getItem("weather")) ?? true
let isGoogle = JSON.parse(localStorage.getItem("google")) ?? true
let isToDo = JSON.parse(localStorage.getItem("toDo")) ?? true

if(isGreeting){
    greeting.style.display = "block"
    form.greeting.checked = true
} else {
    greeting.style.display = "none"
    form.greeting.checked = false
}

if(isWeather){
    weather.style.display = "flex"
    form.weather.checked = true
} else {
    weather.style.display = "none"
    form.weather.checked = false
}

if(isGoogle){
    searchEngine.style.display = "block"
    form.google.checked = true
} else {
    searchEngine.style.display = "none"
    form.google.checked = false
}

if(isToDo){
    toDoSection.style.display = "flex"
    form.todo.checked = true
} else {
    toDoSection.style.display = "none"
    form.todo.checked = false
}

form.addEventListener("submit", function(event){
    // event.preventDefault()
    userName = event.target.name.value
    localStorage.setItem("name", userName)
    // alert(`Your name is set to: ${userName}`)
    isGreeting = event.target.greeting.checked;
    isWeather = event.target.weather.checked
    isGoogle = event.target.google.checked;
    isToDo = event.target.todo.checked;

    localStorage.setItem("greeting", JSON.stringify(isGreeting))
    localStorage.setItem("weather", JSON.stringify(isWeather))
    localStorage.setItem("google", JSON.stringify(isGoogle))
    localStorage.setItem("toDo", JSON.stringify(isToDo))

})

/****GREETING****/
// Creating date
let date = new (Date)
let hours = date.getHours()
let day = date.getDay()
let dateJ = JSON.stringify(date).substring(1, 11)
let dateYear = dateJ.substring(0, 4)
let dateMonth = dateJ.substring(5, 7)
let dateDay = dateJ.substring(8, 10)
let dateToShow = `${dateDay}.${dateMonth}.${dateYear}`

let renderGreet = () => {

    let greetingText = null 
    /**Urceni dne */
    switch (day){
        case 0: day = "Monday";
        break;
        case 1: day = "Tuesday";
        break;
        case 2: day = "Wednesday";
        break;
        case 3: day = "Thursday";
        break;
        case 4: day = "Friday";
        break;
        case 5: day = "Saturday";
        break;
        case 6: day = "Sunday";
        break;
        default: day = "Nice day"
        break;
    }
    /**Urceni pozdravu podle hodiny */
    if(hours < 12){
        greetingText = "Good morning"
    } else if(hours > 12 && hours < 18){
        greetingText = "Good afternoon"
    } else {
        greetingText = "Good evening"
    }

    let p = document.createElement("p")
    p.textContent = `${greetingText} ${userName} today is ${day} ${dateToShow}`
    greeting.appendChild(p)
}

renderGreet()

/****TODO****/

//toDo array
let toDo = JSON.parse(localStorage.getItem("toDoList")) || []

//adding task
toDoForm.addEventListener("submit", (event) => {
    event.preventDefault()
    console.log("Form submitted");
    let task = event.target.task.value
    let deadline = event.target.deadline.value

    let deadlineYear = deadline.substring(0, 4)
    let deadlineMonth = deadline.substring(5, 7)
    let deadlineDay = deadline.substring(8, 10)
    let deadlineToShow = `${deadlineDay}.${deadlineMonth}.${deadlineYear}`
    toDo.push({task: task, deadline: deadlineToShow})

    event.target.task.value = ""
    event.target.deadline.value = ""

    localStorage.setItem("toDoList", JSON.stringify(toDo))

    renderToDos()
})

//rendering h2
let h2 = document.createElement("h2")
h2.textContent = "To Do List"
toDoSection.prepend(h2)

//rendering toDos
let renderToDos = () => {
    toDoOutput.innerHTML = "";

    let ul = document.createElement("ul");
    toDoOutput.appendChild(ul);

    toDo.forEach((element, index) => {
        let li = document.createElement("li");

        let divContainer = document.createElement("div")
        divContainer.className = "div-container"

        let taskContainer = document.createElement("div")
        let spanTask = document.createElement("span");
        spanTask.className = "to-do-span";
        spanTask.textContent = "Task: ";

        let taskText = document.createElement("p")
        taskText.textContent = element.task + " "

        let deadLineContainer = document.createElement("div")
        let deadlineText = document.createElement("p");
        let spanDeadline = document.createElement("span");

        if(element.deadline != ".."){
            spanDeadline.className = "to-do-span";
            spanDeadline.textContent = "Deadline: ";
            deadlineText.textContent = element.deadline + " ";


        }
        let delButton = document.createElement("button");
        delButton.className = "del-button";
        delButton.textContent = "Delete";

        delButton.addEventListener("click", () => {
            toDo.splice(index, 1);
            localStorage.setItem("toDoList", JSON.stringify(toDo));
            renderToDos();
        });
        taskContainer.appendChild(spanTask)
        taskContainer.appendChild(taskText)
        deadLineContainer.appendChild(spanDeadline)
        deadLineContainer.appendChild(deadlineText)
        divContainer.appendChild(taskContainer)
        divContainer.appendChild(deadLineContainer);
        divContainer.appendChild(delButton);

        li.appendChild(divContainer);
        ul.appendChild(li);

    });
};
renderToDos()

//deadline alert
setTimeout(()=>{
    toDo.forEach((element) =>{
        if(element.deadline == dateToShow){
        alert(element.task + " is due today!")
    }
    })
}, 1200)

/****WEATHER****/
let latitude = ""
let longitude = ""

navigator.geolocation.getCurrentPosition(getLatLon);

function getLatLon(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  getWeatherApi()
}

let apiKey = "d63691526aaf91878f9bbcb823a1f8cb"

let getWeatherApi = async function (){
    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`)
            }

        let weatherData = await response.json()
        //icon
        let iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

        let weatherImg = document.createElement('img')
        weatherImg.src = iconUrl
        // City
        let cityName = weatherData.name
        //temperature
        let currentTemp = Math.round(weatherData.main.temp)
        let temperature = document.createElement("p")
        temperature.textContent = `Current temperature in ${cityName} is ${currentTemp}°C`
        //append
        weather.appendChild(temperature)
        weather.appendChild(weatherImg)
        console.log(weatherData)
    }
    catch (error){
        console.log("Error fetching weather data:", error)
    }
}




/****TRASHBAG****/



/****SEARCH ENGINE****/
// let renderSearchEngine = () => {

//     let h2 = document.createElement("h2")
//     h2.innerHTML = "Search by <a href='https://www.google.com' target='_blank'>google</a>"
//     searchEngine.appendChild(h2)

//     let div = document.createElement("div")
//     div.className = "gcse-search"
//     searchEngine.appendChild(div)
// }

// renderSearchEngine()


/****HEIGHT OF SETTING SECTION****/
//setings height
// let documentHeight = Math.max(
//     document.body.scrollHeight,
//     document.documentElement.scrollHeight,
//     document.body.offsetHeight,
//     document.documentElement.offsetHeight,
//     document.body.clientHeight,
//     document.documentElement.clientHeight
//   );
// let usedHeight = 110
// let settingsHeight = documentHeight - usedHeight

// console.log(settingsHeight)

// settingsSection.style.height = `${settingsHeight}px`


