$(function() {
    _.templateSettings = {
    	interpolate: /\{\{=(.+?)\}\}/g,
    	escape: /\{\{-(.+?)\}\}/g,
    	evaluate: /\{\{(.+?)\}\}/g,
    };

	var Movie = Backbone.Model.extend({
		defaults: {
			title: 'default title'
		},
		initialize: function() {
			//console.log('Movie model creating');
		}
	});


	//Movie list
	var MovieList = Backbone.Collection.extend({
		model: Movie,
		url: 'http://cs3213.herokuapp.com/movies.json',
	});
    
    var Movies = new MovieList;
    
    var MovieView = Backbone.View.extend({
        // template: _.template($('#movie-template').html()),
        
        events : {
            'click' : 'clicked'
        },
        clicked: function() {
           console.log(this.model.get("title") + ' was clicked');
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

        itemTemplate: _.template($('#movie-template').html()),

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

    var App = new AppView;
});