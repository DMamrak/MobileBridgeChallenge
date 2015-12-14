define(['Files', 'Proxy', 'FileView'], function(Files, Proxy, FileView){
	var ListView = Backbone.View.extend({
		el: '#file_list',

		events: {
			'click'       : 'click',
			'click .order': 'order',
		},

		initialize: function(){
			this.listenTo(Files, 'sort', this.render);
			this.listenTo(Files, 'select deselect', this.select);
		},

		render: function(){
			$(this.el).find('tbody').empty();

			var _this = this;
			Proxy.each(function(item){
				_this.add(item)	
			}, this);
		},

		click: function(){
			return false;
		},

		add: function(file){
			var view = new FileView({model: file});
			$(this.el).find('tbody').append(view.render().el);
		},

		select: function(item){
			$(this.el).find('tbody tr').removeClass('info');
		},

		order: function(e){
			Files.order = Files.order =='asc' ? 'desc' : 'asc';
			Files.key  = $(e.target).data('value');

			$(this.el)
				.find('.order')
				.removeClass('asc desc');
			$(this.el)
				.find('.order[data-value="' + Files.key + '"]')
				.addClass(Files.order);

			Files.sort();

			return false;
		},

	});

	return new ListView();
});