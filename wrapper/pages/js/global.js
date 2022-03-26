/***
 * this file has the general page stuff
 */

/**
 * set dark mode
 */
if ($.cookie("darkmode")) {
	toggleDarkMode()
}

function toggleDarkMode() {
	if($("html").hasClass("dark")) 
		$("html").removeClass("dark");
	else
		$("html").addClass("dark")
}