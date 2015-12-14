define(['FileModel'], function(FileModel){
	var FileView = Backbone.View.extend({
		tagName: 'tr',

		model: FileModel,

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
	return FileView;
});