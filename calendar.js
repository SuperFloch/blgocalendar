var today = new Date();
var currentMonth = today.getMonth();
var monthCount = 12;
toggleSpoil();

showMonth(currentMonth);


function nextMonth(){
	currentMonth++;
	if(currentMonth >= monthCount){
		currentMonth = 0;
	}
	showMonth(currentMonth);
}
function previousMonth(){
	currentMonth--;
	if(currentMonth < 0){
		currentMonth = monthCount -1;
	}
	showMonth(currentMonth);
}

function toggleSpoil(){
	var spoilEnabled = !document.getElementById("spoilCheck").checked;
	var spoilSections = document.getElementsByClassName("spoil");
	for(var section of spoilSections){
		if(spoilEnabled){
			section.classList.remove("hidden");
		}else{
			section.classList.add("hidden");
		}
	}
	
	var hintSections = document.getElementsByClassName("hint");
	for(var section of hintSections){
		if(!spoilEnabled){
			section.classList.remove("hidden");
		}else{
			section.classList.add("hidden");
		}
	}
}

function showMonth(monthNumber){
	readFile(monthNumber,function(data){
		var dayZone = document.getElementById("calendarDiv");
		dayZone.innerHTML = "";
		
		document.getElementById("monthName").innerHTML = data.name;
		
		data.days.forEach(function(d){
			var dayContent = getDayContent(d);
			dayZone.appendChild(dayContent);
		});
		toggleSpoil();
	});
}

function getDayContent(dayInfo){
	
	var dayTemplate = document.getElementById("dayBlockTemplate");
	var eventClone = document.importNode(dayTemplate.content,true);
	eventClone.getElementById("dayPicture").src = "images/"+currentMonth+"/"+dayInfo.date+".jpg";
	
	//eventClone.getElementById("PictureName").innerHTML = dayInfo.name;
	eventClone.getElementById("PictureTheme").innerHTML = dayInfo.theme;
	eventClone.getElementById("PictureHint").innerHTML = dayInfo.hint + "...";
	//eventClone.getElementById("PictureLink").innerHTML = dayInfo.link;
	eventClone.getElementById("PictureComment").innerHTML = dayInfo.comment;
	eventClone.getElementById("dayNumber").innerHTML = dayInfo.date;
	
	return eventClone;
}

// CONNEXION AU JSON
function sendInfo(monthInfo){
	var myRequest = new XMLHttpRequest();
	myRequest.open('POST', '/jsonUpdate/'+monthInfo.id);
	myRequest.setRequestHeader("Content-Type", "application/json");
	myRequest.onreadystatechange = function () { 
		if (myRequest.readyState === 4) {
			var json = JSON.parse(myRequest.responseText);
			console.log(json);
		}
	};
	myRequest.send(JSON.stringify(monthInfo));
}

// Lis un fichier local
function readFile(monthNumber,callback){
	var myRequest = new XMLHttpRequest();
	myRequest.open('GET', '/json/'+monthNumber);
	myRequest.onreadystatechange = function () { 
		if (myRequest.readyState === 4) {
			var json = JSON.parse(myRequest.responseText);
			callback(json);
		}
	};
	myRequest.send();
}