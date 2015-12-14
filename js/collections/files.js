define(['FileModel'], function(FileModel){
	var Files = Backbone.Collection.extend({
		model: FileModel,

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
				var file = new FileModel(data);
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

	return new Files();
});