import {API_KEY} from "./key.js";


const weatherApi= {
    key:API_KEY,
    baseUrl: "https://api.openweathermap.org/data/2.5/weather"
}
    
const box=document.querySelector('.box');
let inputSection=box.querySelector('.inputSection');
let alertBox= inputSection.querySelector('.alert');
let inputText=inputSection.querySelector('input');
let locationBtn=inputSection.querySelector('button');
let weatherBody=document.getElementById('weather-bodySection');
let backIcon=document.getElementById('icon');
let temp, min_temp, max_temp;

inputText.addEventListener('keypress', (event) =>{
    if(event.key =="Enter" && inputText!= "")
    {
        alertBox.textContent=" Gettting weather details..";
        alertBox.classList.add('pending');
        requestApi(inputText.value);
    }
});

locationBtn.addEventListener('click', ()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSucess, onError);
    }
    else{
        alert('Your browser do not support geolocation API');
    }
});

function onSucess(position)
{
    const lat=position.coords.latitude;
    const lon=position.coords.longitude;
    //https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
    let api=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApi.key}&units=metric`;
    fetch(api).then((response)=>{return response.json()}).then(result=> showWheather(result));
}

function onError(error)
{
    console.log(error.message);
    alertBox.textContent=error.message;
    alertBox.classList.add('error');
}

function requestApi (city)
{
    //"http://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}"
    let api=`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`;
    fetch(api).then((response)=>{return response.json()}).then(result=> showWheather(result));
}

function showWheather(info)
{
    console.log(info);
    if(info.cod==404)
    {
        alertBox.textContent="Please enter valid city name"
        alertBox.classList.replace('pending', 'error');
    }
    else{
        if(info.sys.country==undefined)
        {
            document.getElementById("city").innerText= `${info.name}`;
        }
        else
        {
            document.getElementById("city").innerText= `${info.name}, ${info.sys.country}`;
        }
        let id=info.weather[0].id;
        if(id==800)
            document.getElementById('condImage').src='images/clear.gif';
        else if(id>= 200 && id<=232)
            document.getElementById('condImage').src='images/thunderstorm.gif';
        else if (id>=600 && id <=622)
            document.getElementById('condImage').src='images/snow.gif';
        else if(id>=701 && id <=781)
            document.getElementById('condImage').src='images/haze.gif';
        else if(id>=801 && id <=804)
            document.getElementById('condImage').src='images/cloud.gif';
        else if((id>=300 && id <=321) || (id>=500 && id <=531))
            document.getElementById('condImage').src='images/rain.gif';

        temp= info.main.temp;
        min_temp= info.main.temp_min;
        max_temp= info.main.temp_max;
        document.getElementById("temp").innerText= `${Math.floor(info.main.temp)}°C`;
        document.getElementById("condition").innerText= `${info.weather[0].main}`;
        document.getElementById("humidity").innerText= `Humidity: ${info.main.humidity}%`;
        document.getElementById("wind").innerText= `Wind: ${info.wind.speed} Km/hr`;
        document.getElementById("pressure").innerText= `Pressure: ${info.main.pressure} mb`;
        document.getElementById("max-temp").innerText= `Max Temperature: ${Math.floor(info.main.temp_max)}°C`;
        document.getElementById("min-temp").innerText= `Min Temperature: ${Math.floor(info.main.temp_min)}°C`;

        alertBox.classList.remove('pending');
        weatherBody.classList.add('active');
        inputSection.classList.add('deactive');
        box.classList.add('active');
    }
}

backIcon.addEventListener('click', ()=>{
    inputSection.classList.remove('deactive');
    box.classList.remove('active');
});


document.getElementById('fahrenhit').addEventListener('click', (event)=>{
    const temp1=temp*1.8+32;
    const max_temp1=(max_temp)*1.8+32;
    const min_temp1=(min_temp)*1.8+32;
    document.getElementById("temp").innerText=`${Math.floor(temp1)}°F`;
    document.getElementById("max-temp").innerText=`Max Temperature: ${Math.floor(max_temp1)}°F`;
    document.getElementById("min-temp").innerText=`Min Temperature: ${Math.floor(min_temp1)}°F`;
    event.target.previousElementSibling.classList.remove('active');
    event.target.classList.add('active');
});

document.getElementById('celcius').addEventListener('click', (event)=>{
    document.getElementById("temp").innerText=`${Math.floor(temp)}°C`;
    document.getElementById("max-temp").innerText=`Max Temperature: ${Math.floor(max_temp)}°C`;
    document.getElementById("min-temp").innerText=`Min Temperature: ${Math.floor(min_temp)}°C`;
    event.target.nextElementSibling.classList.remove('active');
    event.target.classList.add('active');
});