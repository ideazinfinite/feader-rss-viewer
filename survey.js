/**
 * Created with JetBrains WebStorm.
 * User: apps
 * Date: 11/5/12
 * Time: 9:55 PM
 * To change this template use File | Settings | File Templates.
 */

function loadSurveyFlag()
{
    //Retrieve survey status from localStorage
    surveyFlag = localStorage["surveyFlag"];
    if(surveyFlag!=1)
    {
        surveyFlag=DEF_surveyFlag; //DEFAULTING
    }
    console.log("surveyflag is " + surveyFlag);
    return surveyFlag;
}

function setSurveyFlag()
{
    //Retrieve survey status from localStorage
    localStorage["surveyFlag"]=1;
    surveyFlag = localStorage["surveyFlag"];
    console.log("surveyflag is " + surveyFlag);
}

function loadSurvey() {

    $(".innerContainer").hide(); //hide Pause/Refresh menu
    $(".divTitle").html("<form id='survey'><div class='question'><label>Are you satisfied with Feader so far?</label></div> <div class='fR pR choices'><input id='choiceYes'  type='radio' name='choice' value='yes'> <label for='choiceYes'> Yes </label> &nbsp;  <input id='choiceNo' type='radio' name='choice' value='no' >  <label for='choiceNo'> No</label> &nbsp;  <input id='choiceFirstTime'  type='radio' name='choice' value='firstTime'> <label for='choiceFirstTime'> Using first time </label><input type='hidden' name='q' value='Are you satisfied with Feader so far'> </div></form>");

    $("#choiceYes, #choiceNo, #choiceFirstTime").click(function(event){
        // setup some local variables
        var $form = $("#survey"),
        // let's select and cache all the fields
            $inputs = $form.find("input, select, button, textarea"),
        // serialize the data in the form
            serializedData = $form.serialize();

        // let's disable the inputs for the duration of the ajax request
        $inputs.attr("disabled", "disabled");
        //set SurveyFlag
        setSurveyFlag();

        // fire off the request to /form.php
        $.ajax({
            url: "http://www.chromerss.com/survey/form.php",
            type: "post",
            data: serializedData,
            // callback handler that will be called on success
            success: function(response, textStatus, jqXHR){
                // log a message to the console
                console.log("Survey success" + response);
            },
            // callback handler that will be called on error
            error: function(jqXHR, textStatus, errorThrown){
                // log the error to the console
                console.log(
                    "Survey error: "+
                        textStatus, errorThrown
                );
            },
            // callback handler that will be called on completion
            // which means, either on success or error
            complete: function(){
                // enable the inputs
                //$inputs.removeAttr("disabled");
                //The following two statements ensure the notification height shrinks after transitioning from multi-line title to single line
                document.body.style.height="20px";
                document.getElementsByTagName("html")[0].style.height="20px";
                $(".divTitle").html("<div class='question'>Great feedback, Thank You!</div><div class='choices'>Please re-launch to start using feader.</div>");
            }
        });

        // prevent default posting of form
        event.preventDefault();
    });
}


