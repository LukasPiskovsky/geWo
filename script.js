/****Section elements****/
const greeting = document.getElementById("greeting")
const searchEngine = document.getElementById("search-engine")
const toDoSection = document.getElementById("to-do")
const toDoOutput = document.getElementById("to-do-output")
const toDoForm = document.getElementById("to-do-container")
// let toDoInput = document.getElementById("to-do-input")
// let toDoButton = document.getElementById("to-do-button")
// let toDoDeadline = document.getElementById("to-do-deadline")
const weather = document.getElementById("weather")


/****Arrow rotation****/
let arrow = document.getElementById("arrow")
let settings = document.getElementById("settings")
let rotate = 0

arrow.addEventListener("click", function(){
        rotate += 180
        arrow.style.transform = `rotate(${rotate}deg)`
})

/****Form Settings****/
let form = document.getElementById("name-form")
let userName = localStorage.getItem("name") || "user"
form.name.value = userName
let isGreeting = JSON.parse(localStorage.getItem("greeting")) || false
let isGoogle = JSON.parse(localStorage.getItem("google")) || false
let isToDo = JSON.parse(localStorage.getItem("toDo")) || false

if(isGreeting){
    greeting.style.display = "block"
    form.greeting.checked = true
} else {
    greeting.style.display = "none"
    form.greeting.checked = false
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

console.log(isGoogle)

form.addEventListener("submit", function(event){
    // event.preventDefault()
    userName = event.target.name.value
    localStorage.setItem("name", userName)
    // alert(`Your name is set to: ${userName}`)
    isGreeting = event.target.greeting.checked;
    isGoogle = event.target.google.checked;
    isToDo = event.target.todo.checked;

    localStorage.setItem("greeting", JSON.stringify(isGreeting))
    localStorage.setItem("google", JSON.stringify(isGoogle))
    localStorage.setItem("toDo", JSON.stringify(isToDo))

})

/****Greeting****/

let date = new (Date)
let hours = date.getHours()
let day = date.getDay()
let dateJ = JSON.stringify(date).substring(1, 11)
let dateYear = dateJ.substring(0, 4)
let dateMonth = dateJ.substring(5, 7)
let dateDay = dateJ.substring(8, 10)
let dateToShow = `${dateDay}.${dateMonth}.${dateYear}`

let renderGreet = () => {
    /**Variably pro uchovani potrebnych datumu */

    console.log(dateToShow)
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

    console.log(day)

    let p = document.createElement("p")
    p.textContent = `${greetingText} ${userName} today is ${day} ${dateToShow}`
    greeting.appendChild(p)
}

renderGreet()

/****Search Engine****/


let renderSearchEngine = () => {

    let h2 = document.createElement("h2")
    h2.innerHTML = "Search by <a href='https://www.google.com' target='_blank'>google</a>"
    searchEngine.appendChild(h2)

    let div = document.createElement("div")
    div.className = "gcse-search"
    searchEngine.appendChild(div)
}

renderSearchEngine()

/****ToDo****/

let toDo = JSON.parse(localStorage.getItem("toDoList")) || []
/**add task**/
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

/**rendering todos**/
let h2 = document.createElement("h2")
h2.textContent = "To Do List"
toDoSection.prepend(h2)

let renderToDos = () => {
    toDoOutput.innerHTML = "";

    let ul = document.createElement("ul");
    toDoOutput.appendChild(ul);

    toDo.forEach((element, index) => {
        let li = document.createElement("li");

        let divContainer = document.createElement("div")
        divContainer.className = "div-container"

        let spanTask = document.createElement("span");
        spanTask.className = "to-do-span";
        spanTask.textContent = "Task: ";

        let taskText = document.createTextNode(element.task + " ");
        let deadlineText = document.createTextNode("");

        let spanDeadline = document.createElement("span");
        if(element.deadline != ".."){
            spanDeadline.className = "to-do-span";
            spanDeadline.textContent = "Deadline: ";

            deadlineText = document.createTextNode(element.deadline + " ");
        }
        let delButton = document.createElement("button");
        delButton.className = "del-button";
        delButton.textContent = "Delete";

        delButton.addEventListener("click", () => {
            toDo.splice(index, 1);
            localStorage.setItem("toDoList", JSON.stringify(toDo));
            renderToDos();
        });
        
        divContainer.appendChild(spanTask);
        divContainer.appendChild(taskText);
        divContainer.appendChild(spanDeadline);
        divContainer.appendChild(deadlineText);
        divContainer.appendChild(delButton);

        li.appendChild(divContainer);
        ul.appendChild(li);

    });
};
renderToDos()

/**deadline alert**/
setTimeout(()=>{
    toDo.forEach((element) =>{
        if(element.deadline == dateToShow){
        alert(element.task + " is due today!")
    }
    })
}, 1200)

/****Weather****/

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
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`)
            }

        let weatherData = await response.json()
        
        // let iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
        // let weatherImg = document.createElement('img')
        // weatherImg.src = iconUrl
        // weather.appendChild(weatherImg)
        
    }
    catch (error){
        console.log("Error fetching weather data:", error)
    }
}







/****Name-day****/
