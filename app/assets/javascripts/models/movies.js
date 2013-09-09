$(function() {
    _.templateSettings = {
    	interpolate: /\{\{=(.+?)\}\}/g,
    	escape: /\{\{-(.+?)\}\}/g,
    	evaluate: /\{\{(.+?)\}\}/g,
    };

	var Movie = Backbone.Model.extend({
	    urlRoot: 'http://cs3213.herokuapp.com/movies',
		defaults: {
			title: 'default title'
		},
		initialize: function() {
		}
	});


	//Movie list
	var MovieList = Backbone.Collection.extend({
		model: Movie,
		url: 'http://cs3213.herokuapp.com/movies.json',
	});
    
    var Movies = new MovieList;
    
    var MovieView = Backbone.View.extend({       
        events : {
            'click' : 'clicked'
        },
        clicked: function() {
           AppRouterInstance.navigate('movies/'+this.model.get("id"), true);
        },
        initialize: function () {
            _.bindAll(this, 'render', 'remove');
            this.model.bind('change', this.render);
        },
        render: function () {
            var template = _.template($('#movie-template').html(), {model: this.model.toJSON()});
            $(this.el).addClass('span3').html(template);
            return this;
        }
    });
    
    var SingleMovieView = Backbone.View.extend({        
        initialize: function () {
            _.bindAll(this, 'render', 'remove');
            //this.model.bind('change', this.render);
        },
        render: function () {
            var template = _.template($('#single-movie-template').html(), {model: this.model});
            $(this.el).html(template);
            return this;
        }
    });
    
    var CreateMovieView = Backbone.View.extend({        
        initialize: function () {
            _.bindAll(this, 'render', 'remove');
            //this.model.bind('change', this.render);
        },
        render: function () {
            var template = _.template($('#create-movie-template').html());
            $(this.el).html(template);
            return this;
        }
    });
    
    var AppView = Backbone.View.extend({
        el: $("#movies-div"),
        initialize: function () {
            _.bindAll(this, 'addOne', 'addAll', 'render');
            
            Movies.bind('reset', this.addAll);
            moviesToAdd = Movies.fetch({
                success: function(data) {
                    Movies.reset(data.models);
                }
            });
        },
        addOne: function (movie) {
            var view = new MovieView({ model: movie });
            $(this.el).append(view.render().el);
        },
        addAll: function () {
            Movies.each(this.addOne);
        },
        viewIndex: function() {
            $(this.el).empty();
            this.addAll();
        },
        viewSingleMovie: function(movie, reviews) {
            $(this.el).empty();
            var model = {movie: movie.toJSON(), reviews: reviews};
            var view = new SingleMovieView({model: model});
            $(this.el).append(view.render().el);
        },
        createMovie: function() {
            $(this.el).empty();
            var view = new CreateMovieView();
            $(this.el).append(view.render().el);
        }
    });
    
    // The AppRouter sets up various URLS to the functions.
    // Inside the respective function, they call the AppViewInstance to
    // remove the current view and load the correct view.
    var AppRouter = Backbone.Router.extend({
        routes: {
            "" : "index",
            "movies/:id" : "view_movie",
            "new_movie" : "new_movie",
        },
        index: function() {
            AppViewInstance.viewIndex();
        },
        view_movie: function(id) {
            var thisMovie = new Movie({id: id+".json"});
            thisMovie.fetch({
               success: function (thisMovie) {
                   $.ajax({
                       type: 'get',
                       cache: false,
                       url: 'http://cs3213.herokuapp.com/movies/'+thisMovie.get("id")+"/reviews.json",
                       dataType: 'json',
                       error: function(jqXHR, textStatus, error) {
                           console.log(textStatus + ": " + error);
                       },
                       success: function(thisMovieReviews, textStatus, jqXHR) {
                           AppViewInstance.viewSingleMovie(thisMovie, thisMovieReviews);
                       }
                   });
               }
            });
        },
        new_movie: function() {
            AppViewInstance.createMovie();
        }
    });

    var AppRouterInstance = new AppRouter();
    var AppViewInstance = new AppView();
    Backbone.history.start(); 
});