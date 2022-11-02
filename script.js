const currentLongitude = document.getElementById("location__lon");
const currentlatitude = document.getElementById("location__lat");
const currentDateTime = document.getElementById("date__time");
const currentDateDay = document.querySelector(".date__day");
const peopleCont = document.querySelector(".ISS__people__container");
const peopleCount = document.querySelector(".people-count");

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ['January', 'February ', 'March ', 'March', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];



async function initMap() {
   let initialLat = 0;
   let initialLon = 0;
   getIssLocation();

   let opt = {
      zoom: 3,
      center: { lat: initialLat, lng: initialLon }
   }
   let map = new google.maps.Map(document.getElementById("map"), opt);
   let marker = new google.maps.Marker({
      position: { lat: 11, lng: 11 },
      map,
      title: "ISS",
      icon: 'ISS_ico.png'
   })

   setInterval(() => {
      getIssLocation();
      renderMarkers();
      currentDate();
   }, 5000);
   setTimeout(() => {
      renderMap();
      renderMarkers();
   }, 300)

   /* setInterval(() => {
      renderMap();
      getCountOfPeopleInSpace();

   }, 59950); */

   async function renderMarkers() {
      marker.setMap(null);
      marker = new google.maps.Marker({
         position: { lat: initialLat, lng: initialLon },
         map,
         title: "ISS",
         icon: 'ISS_ico.png'
      })
      marker.setMap(map);
   }

   function renderMap() {
      let opt = {
         zoom: 5,
         center: { lat: initialLat, lng: initialLon }
      }
      map = new google.maps.Map(document.getElementById("map"), opt);
   }

   async function getIssLocation() {

      let promise = await fetch("http://api.open-notify.org/iss-now.json");
      let props = await promise.json();
      currentLongitude.innerHTML = initialLon = +props.iss_position.longitude;
      currentlatitude.innerHTML = initialLat = +props.iss_position.latitude;
   }

   async function getCountOfPeopleInSpace() {
      let promise = await fetch("http://api.open-notify.org/astros.json");
      let props = await promise.json();

      peopleCont.innerHTML = '';
      let peopleOnISS = [];
      props.people.map(person => {
         if (person.craft === 'ISS') peopleOnISS.push(person);
      });

      for (let i = 0; i < peopleOnISS.length; i++) {
         const newElement = document.createElement("div");
         newElement.classList.add("ISS__person");
         const personName = document.createElement('p');
         personName.classList.add("person-name");
         personName.innerHTML = peopleOnISS[i].name;
         newElement.append(personName);
         peopleCont.append(newElement);
      }
      peopleCount.innerHTML = peopleOnISS.length;
   }

   function currentDate() {
      let currentDate = new Date();
      let day = currentDate.getDate();
      let dayOfWeek = '';
      let currMonth = '';
      let timeStr = `${currentDate.getHours()}:${currentDate.getMinutes() > 9
         ? currentDate.getMinutes()
         : '0' + currentDate.getMinutes()}`;

      for (let day of days) {
         if (days.indexOf(day) === currentDate.getDay()) {
            dayOfWeek = day;
         }
      }

      for (let month of months) {
         if (months.indexOf(month) === currentDate.getMonth()) {
            currMonth = month;
         }
      }

      currentDateTime.innerHTML = timeStr;
      currentDateDay.innerHTML = `${dayOfWeek}, ${day} ${currMonth.slice(0, 3)}, ${currentDate.getFullYear()}`;
   }

   currentDate();
   getCountOfPeopleInSpace();
}
