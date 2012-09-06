//Feader's configure page javascript
var DEF_URL = "http://feeds.bbci.co.uk/news/rss.xml", DEF_storyCount=12, DEF_autoPlay=true, DEF_autoPlayFreq=12, DEF_refreshInterval=30, DEF_hideStories=false;
var count=0;

var feedList;

function addFeedURL(num) {
	
	var URL = document.getElementById("URL_txt").value;
	if(URL=="http://" || URL=="https://") //Sanity check
	{return;}
	var elOptNew = document.createElement('option');
	  elOptNew.text = URL;
	  elOptNew.value = 'url' + num;
	  var elSel = document.getElementById('URL_list');

	  try {
	    elSel.add(elOptNew, null); // standards compliant; doesn't work in IE
	    document.getElementById("URL_txt").value="";
	  }
	  catch(ex) {
	    elSel.add(elOptNew); // IE only
	  }
}


function removeSelectedURL()
{
  var elSel = document.getElementById('URL_list');
  var i;
  for (i = elSel.length - 1; i>=0; i--) {
    if (elSel.options[i].selected) {
      elSel.remove(i);
    }
  }
}

function validateFields()
{
	var status=1;
	
	var storyCount=document.getElementById("storyCount").value;
	if(storyCount<1 || storyCount>30)
	{return status;}
	
	if(document.getElementById("autoPlay").checked==true)
	{
		var autoPlayFreq=document.getElementById("autoPlayFreq").value;
		if(autoPlayFreq<5 || autoPlayFreq>60)
		{return status;}
		
	}
	
	var refreshInterval=document.getElementById("refreshInterval").value;
	if(refreshInterval<10 || refreshInterval>240)
	{return status;}
	
	status=0;
	return status;
}


function saveOptions() {
	
	//validate all data
	var status = document.getElementById("status");
	var validation=validateFields();
	if(validation==1)
	{
		status.style.background = "#FF0000";
		status.innerHTML = "Error encountered while saving.";
		  setTimeout(function() {
		    status.innerHTML = "";
		  }, 4000);
		return;
	}

    //validation Passed
	var feedList = "";
	var urltxt = document.getElementById("URL_txt").value;
	
	var list = document.getElementById("URL_list");
	for(i = 0; i<list.length; i++)
	{
		feedList += list.options[i].text;
		if(i<list.length-1)
		 {
			feedList += ";";
		 }
	}
	
	var storyCount=document.getElementById("storyCount").value;
	var autoPlayFreq=document.getElementById("autoPlayFreq").value;
	var autoPlay=document.getElementById("autoPlay").checked;
	var refreshInterval=document.getElementById("refreshInterval").value;
	var hideStories=document.getElementById("hideStories").checked;
	
	
	localStorage["feedList"] = feedList;
	localStorage["storyCount"] = storyCount;
	localStorage["autoPlay"] = autoPlay;
	localStorage["autoPlayFreq"] = autoPlayFreq;
	localStorage["refreshInterval"] = refreshInterval;
	localStorage["hideStories"] = hideStories;
	//alert(feedList);
	
	
	// Update status to let user know options were saved.
	  status.style.background = "#2EE809";
	  status.innerHTML = "Settings saved.";
	  setTimeout(function() {
	    status.innerHTML = "";
	  }, 1250);
}

function restore_options() {
  var feedList = localStorage["feedList"];
  var storyCount = localStorage["storyCount"];
  var autoPlay = localStorage["autoPlay"];
  var autoPlayFreq = localStorage["autoPlayFreq"];
  var refreshInterval = localStorage["refreshInterval"];
  var hideStories = localStorage["hideStories"];
  
  if (!feedList) {
    feedList=DEF_URL;
  }

  if (!storyCount) {
    storyCount=DEF_storyCount;
  }

  if (!autoPlay) {
    autoPlay=DEF_autoPlay;
    
  }

  if (!autoPlayFreq) {
    autoPlayFreq=DEF_autoPlayFreq;
  }

  if (!refreshInterval) {
    refreshInterval=DEF_refreshInterval;
  }

  if (!hideStories) {
    hideStories=DEF_hideStories;

  }

  var list = feedList.split(";");
  for (var i = 0; i < list.length; i++) {
      
      var elOptNew = document.createElement('option');
	  elOptNew.text = list[i];
	  elOptNew.value = 'url' + i;
	  var elSel = document.getElementById('URL_list');

	  try {
	    elSel.add(elOptNew, null); // standards compliant; doesn't work in IE
	  }
	  catch(ex) {
	    elSel.add(elOptNew); // IE only
	  }
  }


  document.getElementById('storyCount').value=storyCount;
  if(autoPlay=="true")
  {document.getElementById('autoPlay').checked=true; }
  else
  {document.getElementById('autoPlay').checked=false; }
  document.getElementById('autoPlayFreq').value=autoPlayFreq;
  document.getElementById('refreshInterval').value=refreshInterval;
  if(hideStories=="true")
  {document.getElementById('hideStories').checked=true; }
  else
  {document.getElementById('hideStories').checked=false; }

  document.getElementById('URL_txt').value="http://";
}

function restoreALL()
{
	//from 'javascrypt' encryption library
	ce();	    	    	    	// Add time we got here to entropy
	mouseMotionEntropy(60);   	// Initialise collection of mouse motion entropy
	
	//restore options on page
	restore_options();
	restoreRIL();
}




//Event Listeners for buttons
document.addEventListener('DOMContentLoaded', function () {
  //document.querySelector('button').addEventListener('click', loadOptions);
  document.getElementById("addButton").addEventListener('click', function(){addFeedURL(count++)});
});
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("remButton").addEventListener('click', removeSelectedURL);
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("saveButton").addEventListener('click', saveOptions);
});

window.onload = restoreALL;