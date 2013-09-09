Movie = Backbone.Model.extend({
	urlRoot:'http://cs3213.herokuapp.com/movies',
	defaults: {
		title: 'default title'
	},
	initialize: function() {
		console.log('Movie model creating');
	}
});

//get a model here
var movie = new Movie({id: '14.json'});
movie.fetch({
	success: function (movie) {
		console.log(movie);
	}
});