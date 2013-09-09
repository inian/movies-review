var m = {};

$(function() {
	var Movie = Backbone.Model.extend({
		defaults: {
			title: 'default title'
		},
		initialize: function() {
			console.log('Movie model creating');
		}
	});


	//Movie list
	var MovieList = Backbone.Collection.extend({
		model: Movie,
		url: 'http://cs3213.herokuapp.com/movies.json',
	});

	// var Movies = new MovieList();

	// //fetching all movies
	// Movies.fetch({
	// 	success: function(movie) {
	// 		console.log(movie);
	// 		// console.log(movie.models[1].get('title'));
	// 	}
	// });

	_.templateSettings = {
		interpolate: /\{\{=(.+?)\}\}/g,
		escape: /\{\{-(.+?)\}\}/g,
		evaluate: /\{\{(.+?)\}\}/g,
	};
	//View
	//Movie View
	var MovieView = Backbone.View.extend({

		tagName: "li",

		template: _.template($('#item-template').html()),

		initialize: function() {
			_.bindAll(this, 'render', 'remove');
			this.model.bind('change', this.render);
		},

		render: function() {
			//construct 
			
			$(this.el).html(this.model.get('title'));
			return this;
		}
	});
	var Movies = new MovieList();

	var AppView = Backbone.View.extend({

		el: $("#movie_app"),

		itemTemplate: _.template($('#item-template').html()),

		initialize: function() {
			_.bindAll(this, 'addOne', 'addAll', 'render');

			Movies.bind('reset', this.addAll);
			moviesToAdd = Movies.fetch({
				success: function(data) {
					console.log(data);
					Movies.reset(data.models);
				}
			});

		},
		 addOne: function (movie) {
            var view = new MovieView({ model: movie });
            this.$("#movie-list").append(view.render().el);
        },

        addAll: function () {
            Movies.each(this.addOne);
        }
	});

	var App = new AppView();
	
});