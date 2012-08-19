//Feader's launcher script

var notification = webkitNotifications.createHTMLNotification(
'news.html'
);
// React when a browser action's icon is clicked.
chrome.browserAction.onClicked.addListener(function(tab) {
	//VERIFY IF ITS NOT ALREADY RUNNING
    if(chrome.extension.getViews({type:"notification"}).length == 0)
    {
	    notification.show();
    }
    else
    {
	    notification.cancel();
	    notification = webkitNotifications.createHTMLNotification(
		'news.html'
		);
	    notification.show();
    }

});
