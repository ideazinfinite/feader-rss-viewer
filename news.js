//Feader's main logic and methods
var DEF_URL = "http://feeds.bbci.co.uk/news/rss.xml", DEF_storyCount=12, DEF_autoPlay=true, DEF_autoPlayFreq=12, DEF_refreshInterval=30;
$(document).ready(function () {
    var counter = 0,
        entrylist = [], urllist =  [], feedtitle = [], //feedImg = [],
        links, linkarr;
    var traverseInterval, refreshInterval, success=0, paused=0;
    var storyCount, autoPlay, autoPlayFreq, refreshInterval;

    
function retrieveSettings()
{
	//Retrieve Feed sources(links) from localStorage 
	links = localStorage["feedList"];
	if(!links || links=="")
	{
		links=DEF_URL; //DEFAULTING TO BBC NEWS
	}
	
	//Retrieve all settings from localStorage 
	storyCount = localStorage["storyCount"];
	if(!storyCount || storyCount=="")
	{
		storyCount=DEF_storyCount;  //DEFAULTING
	}
	autoPlay = localStorage["autoPlay"];
	if(!autoPlay || autoPlay=="")
	{
		autoPlay=DEF_autoPlay;  //DEFAULTING
	}
	autoPlayFreq = localStorage["autoPlayFreq"];
	if(!autoPlayFreq || autoPlayFreq=="")
	{
		autoPlayFreq=DEF_autoPlayFreq;  //DEFAULTING
	}
	refreshInterval = localStorage["refreshInterval"];
	if(!refreshInterval || refreshInterval=="")
	{
		refreshInterval=DEF_refreshInterval;  //DEFAULTING
	}
	
	
	
}

function refreshFeeds(run)
{
	entrylist = [], urllist =  [], feedtitle = []; //feedImg = [];
	if(run==1)
	{
		clearInterval(traverseInterval);
		console.log("Refreshing feeds...");
		$("#feedStatus").html("Refreshing feed(s)...");
	
	}
	else
	{
		$("#feedStatus").html("Loading feed(s)...");
	}
	
	//retrieve all settings from localstorage
	retrieveSettings();
    //console.log("links: " + links + ", count: " + storyCount);

    linkarr = links.split(';');
    
    for (x=0; x < linkarr.length; x++) {
      feeds(linkarr[x]);
   }
   setTraverseInterval();

}

 	
    function updatecontent()
    {
        $("#contenttitle").html(entrylist[counter]);
        $("#contentlink").attr("href", urllist[counter]);
        $("#feedtitle").html(feedtitle[counter]);
        //$("#feedImg").attr("src", feedImg[counter]);

        //The following two statements ensure the notification height shrinks after transitioning from multi-line title to single line
		document.body.style.height="50px";
		document.getElementsByTagName("html")[0].style.height="50px";
    }

    function feeds(link)
    {    var result;
        $.ajax({
	        type: "get",
	        url: "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + storyCount + "&callback=?",
            data: {
                    q: link,
                    output: "json_xml"
                 },
            async: false,
            dataType: "json",
            success: function (data) {
                 if (data.responseStatus == 200) {
	                success=1;
	                $("#feedStatus").html("");
                    $.each(data.responseData.feed.entries, function (_, field) {
                       entrylist.push(field.title);
                       urllist.push(field.link);
                       feedtitle.push(data.responseData.feed.title);
                       //feedImg.push(data.responseData.feed.image.url);

                       //console.log('for link ' + link + ", article is: " + field.title + "; length now is " + entrylist.length);

                       $("#next").css("display", "block");
                       $("#previous").css("display", "block");
                       $("#contentlink").css("display", "block");
                       $("#feedtitle").css("display", "block");
                       //$("#feedImg").css("display", "block");
                       updatecontent();
                       });
                    }
                  },
          error: function() {
	              console.log("Could not get one or more feeds");
                     }

             });


        $("#next").unbind('click').click(function () {
	        //console.log("Next clicked")
            calcNext();
            updatecontent();
        });

        $("#previous").unbind('click').click(function () {   
	        //console.log("Previous clicked")
            calcPrev();
            updatecontent();
        });

        $("#refresh").unbind('click').click(function () {   
	        console.log("Manual refresh clicked")
	       //If in pause state, then reset resume button back to pause state 
	       if(paused==1)
	        {
		      	$("#resume").hide();
	            $("#pause").show();
            }
            refreshFeeds(1);
        });

		$("#pause").unbind('click').click(function () {   
			paused=1;
            pauseTraversal();
            //$("#pause").attr('src',"play.png");
			$("#pause").hide();
			$("#resume").show();

        });

        $("#resume").unbind('click').click(function () {   
			paused=0;
            resumeTraversal();
            $("#resume").hide();
            $("#pause").show();
			
        });
  
    }

   function calcNext()
	{
		//console.log("calcNext called");
		if (counter < (entrylist.length - 1)) { 
            counter += 1;
        } else {
            counter = 0;
        }
	}
	
	function calcPrev()
	{
		if (counter === 0) { 
            counter = entrylist.length - 1;
        } else {
            counter -= 1;
        }
	}
	
	//auto-traverse all items at startup
	function setTraverseInterval()
	{
		if(autoPlay!="true") //check if autoPlay is set, if not hide play/pause controls
		{
			$("#resume").hide();
			$("#refresh").hide();
			$("#pause").hide();
			return;
		}
		
		traverseInterval = window.setInterval(function() {
		 calcNext(); updatecontent();
		}, autoPlayFreq*1000);
	}
	
	//auto-refresh feeds all time
	function setRefreshInterval()
	{
		
		refreshInterval = window.setInterval(function() {
		 console.log("auto-refreshing feeds (not first run)..."); refreshFeeds(1);
		}, refreshInterval*60000); //convert to milliseconds
	}
	
	//PAUSE traversal
	function pauseTraversal()
	{
		clearInterval(traverseInterval);
		clearInterval(refreshInterval);
		console.log("Paused")
		$("#feedStatus").html("Feeds paused");
	}
	//RESUME traversal (after being paused)
	function resumeTraversal()
	{
		setTraverseInterval();
		setRefreshInterval();
		console.log("Resumed")
		$("#feedStatus").html("");
	}


//---------------------- MAIN REGION --------------------------


//load feeds
refreshFeeds(0);


 // 5-second (or however long you want) timeout to check for errors, this will happen only once
setTimeout(function() {
    if (!success)
    {
        // Handle error accordingly
        console.log("Experiencing trouble connecting to servers");
        $("#feedStatus").html("Experiencing trouble connecting to servers, will retry...");
    }
}, 5000);

setRefreshInterval();


});
