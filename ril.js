var DEF_rilEnabled=0, DEF_rilUser="", DEF_rilPass="";
//var cipherKey;
var rilKey="f04Abc02d4fR1fK331paNH7r45T8W97a";

var success=0;
function authRIL(num) {
	var rilUser = document.getElementById("rilUser").value;
	var rilPass = document.getElementById("rilPass").value;
	
	var status = document.getElementById("status2");
	var pocketSave = document.getElementById("rilButton");
	var rilDisableButton = document.getElementById("rilDisableButton");
	$.ajax({
        type: "POST",
        url: "https://readitlaterlist.com/v2/auth",
        data: {
                apikey: rilKey,
                username: rilUser,
                password: rilPass
             },
        async: true,
        //dataType: "json",
        success: function (data) { 
             if (data.replace(/^\s+|\s+$/g, '') == "200 OK") {
                success=1;
                //console.log(data);
                //alert("Successful login");
                status.style.background = "#2EE809";
				status.innerHTML = "Pocket authentication successful.";
				  setTimeout(function() {
				    status.innerHTML = "";
				  }, 10000);
				pocketSave.disabled = true;
				pocketSave.innerHTML = "Saved";
                enableRIL();
                saveRILAuth(rilUser,rilPass);
                
                }
            else
              {success=0; disableRIL(); }
              },
      error: function() { success=0; disableRIL();
	          status.style.background = "#FF0000";
			  status.innerHTML = "Pocket authentication failed.";
			  setTimeout(function() {
			    status.innerHTML = "";
			  }, 8000);
	          //alert("Pocket Authentication failed");
              console.log("RIL Auth failed");
               rilDisableButton.disabled = true;
                 }

         });
}

function enableRIL()
{
	var rilDisableButton = document.getElementById("rilDisableButton");
	localStorage["rilEnabled"]=1;
	rilDisableButton.disabled = false;
}

function disableRIL()
{
	var rilDisableButton = document.getElementById("rilDisableButton");
	localStorage["rilEnabled"]=0;
	clearRILAuth();
	rilDisableButton.disabled = true;
}

function rilDisableButtonAction()
{
	var pocketSave = document.getElementById("rilButton");
	disableRIL();
	clearRIL();
	
	pocketSave.disabled = false;
	pocketSave.innerHTML = "Save";
}

function saveRILAuth(rilUser,rilPass)
{
	var encRilPass, rilPass1;
	cipherKey=Generate_key(cipherTxt);
	//alert(cipherKey);
	encRilPass = Encrypt_text(cipherKey,rilPass);
	//alert(encRilPass);
	localStorage["rilUser"]=rilUser;
	//localStorage["rilPass"]=encRilPass;
	rilPass1 = Decrypt_text(cipherKey,encRilPass);
	//alert(rilPass1);
	
	localStorage["rilKey"]=cipherKey;
	localStorage["rilEncPass"]=encRilPass;
}

function clearRILAuth()
{
	localStorage["rilUser"]="";
	localStorage["rilPass"]="";
	localStorage["rilKey"]="";
	localStorage["rilEncPass"]="";
	
	document.getElementById("rilUser").value = "";
	document.getElementById("rilPass").value = "";
}

function clearCachePrompt()
{
	var status = document.getElementById("status");
	status.style.background = "#FFF942";
	status.innerHTML = "<font color='black'>Are you sure you want to clear cache? <br/>(Cache involves viewed article history and articles added to your Pocket account)</font>";
	$("#clearCachePrompt").hide();
	$("#clearCache").show();
}

function clearCache()
{
	var status = document.getElementById("status");
	var cacheButton = document.getElementById("clearCache");
	
	localStorage["rilTrack"]="";
	localStorage["storyTrack"]="";
	
	status.style.background = "#2EE809";
	status.innerHTML = "Cache cleared.";
	setTimeout(function() {
	    status.innerHTML = "";
	  }, 7000);
	cacheButton.disabled = true;
	cacheButton.innerHTML = "Cache empty";
}



function restoreRIL() {
    var rilEnabled = localStorage["rilEnabled"];
    var rilUser = localStorage["rilUser"];
    var rilPass = localStorage["rilEncPass"];
    var rilDisableButton = document.getElementById('rilDisableButton');

      if (!rilEnabled) {
        rilEnabled=DEF_rilEnabled;
        disableRIL();
        clearRILAuth();
        rilDisableButton.disabled = true;
        return;
      }
     if (!rilUser || rilUser=="") {
        rilUser=DEF_rilUser;
        disableRIL();
        return;
      }
      if (!rilPass || rilPass=="") {
        rilPass=DEF_rilPass;
        disableRIL();
        return;
      }
    document.getElementById('rilUser').value=rilUser;
    document.getElementById('rilPass').value=Decrypt_text(localStorage["rilKey"],localStorage["rilEncPass"]);
    rilDisableButton.disabled = false;


//alert(Decrypt_text(localStorage["rilKey"],localStorage["rilEncPass"]));

}

//Event Listeners for buttons
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("rilButton").addEventListener('click', authRIL);
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("rilDisableButton").addEventListener('click', rilDisableButtonAction);
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("clearCachePrompt").addEventListener('click', clearCachePrompt);
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("clearCache").addEventListener('click', clearCache);
});

//window.onload = restoreRIL;