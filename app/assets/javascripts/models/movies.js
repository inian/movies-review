// get value in cookie given the key
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$(function() {
    _.templateSettings = {
    	interpolate: /\{\{=(.+?)\}\}/g,
    	escape: /\{\{-(.+?)\}\}/g,
    	evaluate: /\{\{(.+?)\}\}/g,
    };
    
    var Review = Backbone.Model.extend({});
    var ReviewList = Backbone.Collection.extend({
        model: Review
    });

	var Movie = Backbone.Model.extend({
	    urlRoot: 'http://cs3213.herokuapp.com/movies',
		defaults: {
			title: 'default title'
		},
		initialize: function() { 
		    this.reviews = new ReviewList;
		    this.reviews.url = "http://cs3213.herokuapp.com/movies/" + this.id.toString().replace(".json", "") + "/reviews.json";
		}
	});


	//Movie list
	var MovieList = Backbone.Collection.extend({
		model: Movie,
		url: 'http://cs3213.herokuapp.com/movies.json',
	});
    
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
            this.model.bind('change', this.render);
        },
        render: function () {
            var template = _.template($('#single-movie-template').html(), {model: this.model.toJSON()});
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

    var Movies = new MovieList;    
    var AppView = Backbone.View.extend({
        el: $("#movies-div"),
        initialize: function () {
            _.bindAll(this, 'addOne', 'addAll', 'render');
            Movies.bind('reset', this.addAll);
        },
        addOne: function (movie) {
            var view = new MovieView({ model: movie });
            $(this.el).append(view.render().el);
        },
        addAll: function () {
            Movies.each(this.addOne);
        },
        viewIndex: function(num) {
            $(this.el).empty();
            Movies.fetch({
                data: $.param({page: num}),
                success: function(data) {
                    Movies.reset(data.models);
                }
            });
            var prevNum = num - 1;
            if (prevNum < 1) {
                prevNum = 1;
            }
            var nextNum = num + 1;
            $("#prevLink").attr("href", "/#page/"+prevNum);
            $("#nextLink").attr("href", "/#page/"+nextNum);
            $("#pagination").show();
        },
        viewSingleMovie: function(movie) {
            $(this.el).empty();
            var view = new SingleMovieView({model: movie});
            $(this.el).append(view.render().el);
            $("#pagination").hide();
        },
        createMovie: function() {
            $(this.el).empty();
            var view = new CreateMovieView();
            $(this.el).append(view.render().el);
            $("#pagination").hide();
        }
    });
    
    // The AppRouter sets up various URLS to the functions.
    // Inside the respective function, they call the AppViewInstance to
    // remove the current view and load the correct view.
    var AppRouter = Backbone.Router.extend({
        routes: {
            "" : "index",
            "page/:page" : "movies_pagination",
            "movies/:id" : "view_movie",
            "new_movie" : "new_movie",
            "review/create/:movie_id" : "create_review"
        },
        index: function() {
            AppViewInstance.viewIndex(1);
        },
        movies_pagination: function(page) {
            var pgNum = parseInt(page);
            if (pgNum < 1) {
                pgNum = 1; 
            }
            AppViewInstance.viewIndex(pgNum);
        },
        view_movie: function(id) {
            var thisMovie = new Movie({id: id+".json"});
            thisMovie.fetch({
               success: function (thisMovie) {
                   thisMovie.reviews.fetch({
                       success: function(thisMovieReviews) {
                           thisMovie.set("reviews", thisMovieReviews);
                           AppViewInstance.viewSingleMovie(thisMovie);
                       }
                   });
               }
            });
        },
        new_movie: function() {
            AppViewInstance.createMovie();
        },
        create_review: function(movie_id) {
            var token = getCookie("access_token");
            var comment = $.trim($("#review_comment").val());
            var score = $.trim($("#review_score").val());
            console.log(token);
            console.log(movie_id);
            var data = {
                'movie_id': movie_id,
                'score': score,
                'comment': comment,
                'access_token': token
            };
            var url = "http://cs3213.herokuapp.com/movies/" + movie_id + "/reviews.json";
            $.ajax({
                url:url,
                type:"POST",
                dataType:"json",
                headers: {'Content-Type':'application/json'},
                data:JSON.stringify(data),
                success: function(result) {
                    window.location.href = "/#movies/"+ movie_id;
                },
                error: function (xhr, status, err) {
                    console.log(xhr);
                }
            });
        }
    });

    var AppRouterInstance = new AppRouter();
    var AppViewInstance = new AppView();
    Backbone.history.start(); 
});