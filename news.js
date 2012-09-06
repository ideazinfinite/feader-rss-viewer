//Feader's main logic and methods
var DEF_URL = "http://feeds.bbci.co.uk/news/rss.xml", DEF_storyCount=12, DEF_autoPlay=true, DEF_autoPlayFreq=12, DEF_refreshInterval=30, DEF_rilEnabled=0, DEF_rilTrack = [], DEF_hideStories=false, DEF_storyTrack = [];
var rilKey="f04Abc02d4fR1fK331paNH7r45T8W97a";
$(document).ready(function () {
    var counter = 0,
        entrylist = [], urllist =  [], feedtitle = [], rilState = [], rilTrack = [], storyTrack = [],  //feedImg = [],
        links, linkarr;
    var traverseInterval, refreshInterval, success=0, paused=0;
    var storyCount, autoPlay, autoPlayFreq, refreshInterval, rilEnabled, rilUser, rilEncPass, hideStories;

    
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
	
	rilEnabled = localStorage["rilEnabled"];
	if(!rilEnabled || rilEnabled=="")
	{
		rilEnabled=DEF_rilEnabled;  //DEFAULTING
	}
	else
	{
		rilUser=localStorage["rilUser"];
	}
	
	if(!localStorage["rilTrack"] || localStorage["rilTrack"]=="")
	{
		//if RILTRACK storage property is accessed for the first time
		rilTrack=DEF_rilTrack;  //DEFAULTING
	}
	else
	{
		//if RILTRACK has data, it needs to be parsed as JSON
		rilTrack = JSON.parse(localStorage["rilTrack"]);
	}
	
	hideStories = localStorage["hideStories"];
	if(!hideStories || hideStories=="")
	{
		hideStories=DEF_hideStories;  //DEFAULTING
	}
	//console.log("hidestories? " + hideStories);
	if(!localStorage["storyTrack"] || localStorage["storyTrack"]=="")
	{
		//if storyTRACK storage property is accessed for the first time
		storyTrack=DEF_storyTrack;  //DEFAULTING
	}
	else
	{
		//if storyTRACK has data, it needs to be parsed as JSON
		storyTrack = JSON.parse(localStorage["storyTrack"]);
	}
	//console.log("storytrack now is: " + storyTrack);
	
}


function refreshFeeds(run)
{
	entrylist = [], urllist =  [], feedtitle = [], rilState = []; //feedImg = [];
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
   counter=0; //resetting counter to zero whenever feeds are refreshed

   //perform cache maintenance
   maintainTracks();

}

function maintainTracks()
{
	var x;
	if(storyTrack.length > 5000)
	{
		x = storyTrack.shift();
		//console.log("shifted element :" + x);
	}
	
	if(rilTrack.length > 5000)
	{
		x = rilTrack.shift();
		//console.log("shifted element :" + x);
	}
	


//	console.log("new storyTrack is: " + storyTrack);
//	console.log("storyTrack length is " + storyTrack.length);
	
}

 	
    function updatecontent()
    {
        $("#contenttitle").html(entrylist[counter]);
        $("#contentlink").attr("href", urllist[counter]);
        $("#feedtitle").html(feedtitle[counter]);
        //$("#feedImg").attr("src", feedImg[counter]);

        //ril Icon display/hide
         if(rilEnabled==1)
	     {
             if(rilState[counter]==0)
             {
	             $("#ril-read").hide();
	             $("#ril").show();
		     
             }
             else
             {
	             $("#ril").hide();
	             $("#ril-read").show();
             }
         }


        //The following two statements ensure the notification height shrinks after transitioning from multi-line title to single line
		document.body.style.height="20px";
		document.getElementsByTagName("html")[0].style.height="20px";
		//document.body.style.width="300px";
		//document.getElementsByTagName("html")[0].style.width="300px";
		
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
                       if(hideStories=="true")  //if hide clicked stories is enabled
				       {
					       //console.log("HIDE STORIES ENABLED");
					       if(storyTrack.indexOf(md5(field.link)) < 0)
				           {
                               entrylist.push(field.title);
                               urllist.push(field.link);
                               feedtitle.push(data.responseData.feed.title);
                               //feedImg.push(data.responseData.feed.image.url);
                       
                               //ril Check
			                   if(rilEnabled==1)
			                   {
				                   if(rilTrack.indexOf(md5(field.title)) >= 0)
				                   {
					                 //console.log("MD5 of " + field.title + " is " + md5(field.title));
					                 rilState.push(1);
					                 //console.log("title in rilTrack index");
					               }
				                   else
				                   {
					                 rilState.push(0);
					                 //console.log("title NOT FOUND in rilTrack index");
					               }

			                   }
			                   $("#next").css("display", "block");
		                       $("#previous").css("display", "block");
		                       $("#contentlink").css("display", "block");
		                       $("#feedtitle").css("display", "block");
		                       //$("#feedImg").css("display", "block");
		                       updatecontent();
			                 }
                       }
                       else   //if hide stories disabled
                       {
	                          //console.log("HIDE STORIES DISABLED");
	                       	  entrylist.push(field.title);
                              urllist.push(field.link);
                              feedtitle.push(data.responseData.feed.title);
                              //feedImg.push(data.responseData.feed.image.url);
                      
                              //ril Check
			                   if(rilEnabled==1)
			                   {
				                   if(rilTrack.indexOf(md5(field.title)) >= 0)
				                   {
					                 //console.log("MD5 of " + field.title + " is " + md5(field.title));
					                 rilState.push(1);
					                 //console.log("title in rilTrack index");
					               }
				                   else
				                   {
					                 rilState.push(0);
					                 //console.log("title NOT FOUND in rilTrack index");
					               }

			                   }
			                   $("#next").css("display", "block");
		                       $("#previous").css("display", "block");
		                       $("#contentlink").css("display", "block");
		                       $("#feedtitle").css("display", "block");
		                       //$("#feedImg").css("display", "block");
		                       updatecontent();

                       }
                       //console.log('for link ' + link + ", article is: " + field.title + "; length now is " + entrylist.length);


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

       	$("#ril").unbind('click').click(function () {   
			addToRIL(counter);
            //$("#ril").hide();
            //$("#ril-read").show();
			
        });

        $("#contentlink").unbind('click').click(function () {   
	        console.log("clicked on title")
	        
	        if(hideStories=="true")  //if hide clicked stories is enabled
		    {
	            storyTrack.push(md5(urllist[counter]));
                localStorage["storyTrack"] = JSON.stringify(storyTrack);
                //remove Story from ALL arrays
                urllist.splice(counter,1);
                entrylist.splice(counter,1);
                feedtitle.splice(counter,1);
            }
            if(rilEnabled==1)
            {
                rilState.splice(counter,1);
            }

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
			//$("#refresh").hide();
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

   //add link to RIL server and also cache link title
   function addToRIL(ctr)
   {
	
	   $.ajax({
        type: "POST",
        url: "https://readitlaterlist.com/v2/add",
        data: {
                apikey: rilKey,
                username: rilUser,
                password: Decrypt_text(localStorage["rilKey"],localStorage["rilEncPass"]),
                url: urllist[ctr],
                title: entrylist[ctr],
                ref_id: ""
             },
        async: true,
        //dataType: "json",
        success: function (data) { 
             if (data.replace(/^\s+|\s+$/g, '') == "200 OK") {
                //console.log(data);
                //PERFORM THIS ONLY AFTER SUCCESS CALL FROM RIL(POCKET) SERVERS
				rilState[ctr]=1;
				//console.log("title about to add is " + entrylist[counter] + " whose md5 is " + md5(entrylist[counter]));
				rilTrack.push(md5(entrylist[ctr]));
				localStorage["rilTrack"] = JSON.stringify(rilTrack);
				
				$("#ril").hide();
	            $("#ril-read").show();
             }
            else
              { console.log("RIL/Pocket Response NOT 200 " + data); }
              },
      error: function() {    $("#feedStatus").html(data); console.log(data);            }

         });
	   
	
   }

//---------------------- MAIN REGION --------------------------


//load feeds
refreshFeeds(0);


 // 7-second (or however long you want) timeout to check for errors, this will happen only once
setTimeout(function() {
    if (!success)
    {
        // Handle error accordingly
        console.log("Experiencing trouble connecting to servers");
        $("#feedStatus").html("Experiencing trouble connecting to servers, will retry...");
    }
}, 7000);

setRefreshInterval();


});
