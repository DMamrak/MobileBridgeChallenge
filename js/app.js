window.Filemanager = {
	Models: {},
	Collections: {},
	Controllers: {},
	Views: {},
};



Filemanager.Models.File = Backbone.Model.extend({
	defaults: function(){
		return {
			marked: false,
			name  : '',
			type  : '',
			text  : '',
			size  : 0
		};
	},

	update: function(data) {
		data.size = data.text.length;
		this.save(data);
	}
});



var FilesCollection = Backbone.Collection.extend({
	model: Filemanager.Models.File,

	localStorage: new Backbone.LocalStorage('Files'),

	initialize: function(){
		this.key    = 'name';
		this.order  = 'asc';
		var storage = localStorage['Files'];
		if(storage == undefined){
			var data = {
				name: 'readme',
				type: 'txt',
				text: 'This is a file, created on first app run.'
			};
			var file = new Filemanager.Models.File(data);
			this.add(file);
			file.update(data);
		}
	},

	comparator: function(a, b){
		var result = 0;
		if(a.get(this.key) > b.get(this.key)){
			result = this.order == 'asc' ? 1 : -1
		}
		if(a.get(this.key) < b.get(this.key)){
			result = this.order == 'asc' ? -1 : 1
		}
		return result;
	},

});

Filemanager.Collections.Files = new FilesCollection();
Filemanager.Collections.Proxy = new Backbone.Obscura(Filemanager.Collections.Files);



Filemanager.Views.File = Backbone.View.extend({
	tagName: 'tr',

	model: Filemanager.Models.File,

	template: _.template($('#row-tpl').html()),

	events: {
		'click': 'select'
	},

	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'deselect', this.deselect);
		this.listenTo(this.model, 'destroy', this.remove);
	},

	render: function(){
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
	},

	select: function(){
		this.model.trigger('select', this.model);
		$(this.el).addClass('info');
	},

	deselect: function(){
		$(this.el).removeClass('info');
	},
});



var ListView = Backbone.View.extend({
	el: '#file_list',

	events: {
		'click'       : 'click',
		'click .order': 'order',
	},

	initialize: function(){
		this.listenTo(Filemanager.Collections.Files, 'sort', this.render);
		this.listenTo(Filemanager.Collections.Files, 'select deselect', this.select);
	},

	render: function(){
		$(this.el).find('tbody').empty();

		var _this = this;
		Filemanager.Collections.Proxy.each(function(item){
			_this.add(item)	
		}, this);
	},

	click: function(){
		return false;
	},

	add: function(file){
		var view = new Filemanager.Views.File({model: file});
		$(this.el).find('tbody').append(view.render().el);
	},

	select: function(item){
		$(this.el).find('tbody tr').removeClass('info');
	},

	order: function(e){
		Filemanager.Collections.Files.order = Filemanager.Collections.Files.order =='asc' ? 'desc' : 'asc';
		Filemanager.Collections.Files.key  = $(e.target).data('value');

		$(this.el)
			.find('.order')
			.removeClass('asc desc');
		$(this.el)
			.find('.order[data-value="' + Filemanager.Collections.Files.key + '"]')
			.addClass(Filemanager.Collections.Files.order);

		Filemanager.Collections.Files.sort();

		return false;
	},

});

Filemanager.Views.List = new ListView();



var ActionsView = Backbone.View.extend({
	el: '.actions',

	events: {
		'click'          : 'click',
		'click .bookmark': 'bookmark',
		'click .edit'    : 'edit',
		'click .delete'  : 'delete',
	},

	initialize: function(){
		this.listenTo(Filemanager.Collections.Files, 'select', this.select);
		this.listenTo(Filemanager.Collections.Files, 'deselect', this.deselect);
	},

	click: function(){
		return false;
	},

	select: function(file){
		this.selected = file;
		$(this.el).find('.inactive').hide();
		$(this.el).find('.active').show();
		$(this.el).find('.file_name').text(file.get('name') + '.' + file.get('type'));
	},

	deselect: function(){
		this.selected = null;
		$(this.el).find('.inactive').show();
		$(this.el).find('.active').hide();
		$(this.el).find('.file_name').text('');
	},

	bookmark: function(e){
		var marked = this.selected.get('marked');
		this.selected.save({marked: !marked});
		return false;
	},

	edit: function(e){
		Filemanager.Views.Editor.show(this.selected);
		return false;
	},

	delete: function(e){
		this.selected.destroy();
		Filemanager.Collections.Files.trigger('deselect');
		return false;
	},
});

Filemanager.Views.Actions = new ActionsView();



var EditorView = Backbone.View.extend({
	el: '#file_editor',

	events: {
		'click'             : 'click',
		'submit form'       : 'submit',
		'click  .btn.save'  : 'save',
		'click  .btn.cancel': 'cancel',
	},

	initialize: function(){
		this.listenTo(Filemanager.Collections.Files, 'select', this.select);
		this.listenTo(Filemanager.Collections.Files, 'deselect', this.deselect);
	},

	click: function(){
		return false;
	}, 

	show: function(){
		this.action = this.selected ? 'edit' : 'add';
		this.data   = this.selected ? this.selected.toJSON() : {};
		this.fill(this.data);
		$('#file_editor').modal('show');
	},

	cancel: function(){
		this.fill({});
	},

	submit: function(){
		$('#file_editor').modal('hide');
		this.save();
		return false;
	},

	save: function(){
		var data = this.parse();
		if(this.action == 'add'){
			var file = new Filemanager.Models.File(data);
			Filemanager.Collections.Files.add(file);
			file.update(data);
		}
		if(this.action == 'edit'){
			this.selected.update(data);
			this.selected.trigger('deselect');
			Filemanager.Collections.Files.sort();
		}
		this.action = null;
		this.fill({});
	},

	parse: function(){
		var result = {};
		var form = $('#file_data')[0];
		_.each(form, function(input){
			var name = input.name;
			var value = input.value;
			result[name] = value;
		});
		return result;
	},

	fill: function(data){
		var form = $('#file_data')[0];
		_.each(form, function(input){
			var name = input.name;
			var value = data[name];
			if(value != undefined){
				input.value = value;
			}else{
				input.value = '';
			}
		});
	},

	select: function(file){
		this.selected = file;
	},

	deselect: function(){
		this.selected = null;
	},
});

Filemanager.Views.Editor = new EditorView();



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
		this.listenTo(Filemanager.Collections.Files, 'select', this.select);
		this.listenTo(Filemanager.Collections.Files, 'deselect', this.deselect);
		Filemanager.Collections.Files.fetch();
		Filemanager.Collections.Files.sort();
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
		Filemanager.Views.Editor.show();
		return false;
	},

	showAll: function(e){
		Filemanager.Collections.Proxy.removeFilter('bookmarks');
		Filemanager.Collections.Files.sort();
	},

	showBookmarks: function(e){
		Filemanager.Collections.Proxy.filterBy('bookmarks', function(model){
			return model.get('marked');
		});
		Filemanager.Collections.Files.sort();
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
		Filemanager.Collections.Proxy.filterBy('search', function(model){
			var regex = new RegExp(escaped, 'gi');
			var name  = model.get('name') + '.' + model.get('type');
			return regex.test(name);
		});
		Filemanager.Collections.Files.sort();
		return false;
	},

});

Filemanager.Views.App = new AppView();