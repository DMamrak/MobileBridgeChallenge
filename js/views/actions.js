define(['Files', 'EditorView'], function(Files, EditorView){
	var ActionsView = Backbone.View.extend({
		el: '.actions',

		events: {
			'click'          : 'click',
			'click .bookmark': 'bookmark',
			'click .edit'    : 'edit',
			'click .delete'  : 'delete',
		},

		initialize: function(){
			this.listenTo(Files, 'select', this.select);
			this.listenTo(Files, 'deselect', this.deselect);
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
			EditorView.show(this.selected);
			return false;
		},

		delete: function(e){
			this.selected.destroy();
			Files.trigger('deselect');
			return false;
		},
	});

	return new ActionsView();
});