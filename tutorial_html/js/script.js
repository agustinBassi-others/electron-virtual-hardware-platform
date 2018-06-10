//JavaScript document

function ExcecuteAction (){
	//document.getElementsByTagName("p")[0].onclick=ShowAlert('Click en elemento 0');
	//document.getElementsByTagName("p")[1].onmouseover=ShowAlert("Mouse sobre elemento 1");
	//document.getElementsByTagName("p")[0].onclick=Alert;
	//document.getElementsByTagName("important").onclick=Alert;

	/*for (var i = 0; i < 3; i++){
		document.getElementsByTagName("p")[i].onclick=Alert;
	}*/

	//document.querySelector(".important").onclick=Alert;

	var elements = document.querySelectorAll("#principal p");
	for (var i = 0; i < elements.lenght; i++){
		
		elements[i].onclick=Alert;
	}
	
	document.getElementsByTagName("span")[0].onclick=Alert;
}

function Alert(){
	alert("alertMessage");	
}

function ShowAlert(alertMessage){
	alert(alertMessage);	
}

window.onload=ExcecuteAction;

