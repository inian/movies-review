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
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		}
	});
	var Movies = new MovieList();
	m.Movie = Movies;

	var AppView = Backbone.View.extend({

		el: $("#movie_app"),

		itemTemplate: _.template($('#item-template').html()),

		initialize: function() {
			_.bindAll(this, 'addOne', 'addAll', 'render');

			Movies.bind('reset', this.addAll);
			moviesToAdd = Movies.fetch();
			Movies.reset(moviesToAdd);

		},
		 addOne: function (question) {
            var view = new MovieView({ model: question });
                          
            this.$("#movie-list").append(view.render().el);
        },

        addAll: function () {
            Movies.each(this.addOne);
        }
	});

	var App = new AppView;
	// SearchView = Backbone.View.extend({
	//        initialize: function(){
	// 		var Movies = new MovieList();

	// 		//fetching all movies
	// 		Movies.fetch();
	//            this.render();
	//        },
	//        render: function(){
	//            //Pass variables in using Underscore.js Template
	//            var variables = { search_label: "My Search" };
	//            // Compile the template using underscore
	//            var template = _.template( $("#search_template").html(), variables );
	//            // Load the compiled HTML into the Backbone "el"
	//            this.$el.html( template );
	//        },
	//        events: {
	//            "click input[type=button]": "doSearch"  
	//        },
	//        doSearch: function( event ){
	//            // Button clicked, you can access the element that was clicked with event.currentTarget
	//            alert( "Search for " + $("#search_input").val() );
	//        }
	//    });

	//     var search_view = new SearchView({ el: $("#search_container") });

});