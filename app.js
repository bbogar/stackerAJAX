$(document).ready( function() {

	//Pull the input from the Unanswered Questions form
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

	//Pull the input from the Top Answerers form
	$('.inspiration-getter').submit(function(event){
		//zero out results from previous search
		$('.results').html('');
		//get the value of the tags the user submitted
		var tags = $(this).find("input[name='answerers']").val();
		getAnswerers(tags);
	})
});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};

// this function takes the answerer object returned by StackOverflow 
// and creates new result to be appended to DOM
var showAnswerer = function(answerer){

	// Clone the result template code
	var result = $(".templates .answerer").clone();

	// Set the answerers-name property in result
	var answererElem = result.find('.answerer-name a');
	answererElem.attr('href', answerer.user.link);
	answererElem.text(answerer.user.display_name);

	// Set the reputation property in result
	var reputation = result.find('.reputation-text');
	reputation.text(answerer.user.reputation);

	// Set the score property in result
	var score = result.find('.score-text');
	score.text(asnwerer.score);

	// Set the post-count property in result
	var postCount = result.find('.postCount-text');
	postCount.text(amswerer.post_count);

	return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
				   site: 'stackoverflow',
				   order: 'desc',
				   sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow 'inspiration getter'
var getAnswerers = function(tags){

	// the parameters we need to pass in our request to StackOverflow's API
	var request = {site: 'stackoverflow',
				   period: 'month'};

	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/" + tags + "/top-answerers",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})

	.done(function(result){
		var searchResults = showSearchResults(tags, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var answerer = showAnswerer(item);  //create showAnswerer function
			$('.results').append(answerer); 
		});
	})

	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};


