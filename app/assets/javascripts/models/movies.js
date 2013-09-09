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
        }
    });
    
    var AppRouter = Backbone.Router.extend({
        routes: {
            "movies/:id" : "view_movie"
        },
        view_movie: function(id) {
            var thisMovie = new Movie({id: id+".json"});
            thisMovie.fetch({
               success: function (thisMovie) {
                   console.log(thisMovie.toJSON());
               }
            });
        }
    });

    var AppRouterInstance = new AppRouter();
    var AppViewInstance = new AppView();
    Backbone.history.start(); 
});