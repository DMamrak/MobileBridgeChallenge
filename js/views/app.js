define(['Files', 'Proxy', 'EditorView', 'ListView', 'ActionsView'], function(Files, Proxy, EditorView, ListView, ActionsView){
	var AppView = Backbone.View.extend({
		el: 'html',

		events: {
			'click'         : 'click',
			'click .btn.add': 'add',

			'change .show.all'      : 'showAll',
			'change .show.bookmarks': 'showBookmarks',
			'submit .filter'        : 'filter',
		},

		initialize: function(){
			this.listenTo(Files, 'select', this.select);
			this.listenTo(Files, 'deselect', this.deselect);
			Files.fetch();
			Files.sort();
		},
		
		click: function(){
			if(this.selected){
				this.selected.trigger('deselect');
			}
		},

		select: function(model){
			this.selected = model;
		},

		deselect: function(model){
			this.selected = null;
		},

		add: function(){
			if(this.selected){
				this.selected.trigger('deselect');
			}
			EditorView.show();
			return false;
		},

		showAll: function(e){
			Proxy.removeFilter('bookmarks');
			Files.sort();
		},

		showBookmarks: function(e){
			Proxy.filterBy('bookmarks', function(model){
				return model.get('marked');
			});
			Files.sort();
		},

		filter: function(e){
			var value    = $(e.target).find('input[type="text"]').val();
			// Checking if there's at least one wildcard symbol in the search string
			var wildcard = value.match(/\*/g);
			var escaped  = value
				// Escaping all special characters except asterisk
				.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&')
				// Replacing asterisks with "match any characters" regexp
				.replace(/\*/g, '.*');
			if(wildcard){
				// If there's at least one wildcard, adding "starts with" and "ends with" to the search string
				escaped = '^' + escaped + '$';
			}
			Proxy.filterBy('search', function(model){
				var regex = new RegExp(escaped, 'gi');
				var name  = model.get('name') + '.' + model.get('type');
				return regex.test(name);
			});
			Files.sort();
			return false;
		},

	});
	
	return AppView;
});



