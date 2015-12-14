define(function(){
	var FileModel = Backbone.Model.extend({
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
	return FileModel;
});

