define(['FileModel', 'Files'], function(FileModel, Files){
	var EditorView = Backbone.View.extend({
		el: '#file_editor',

		events: {
			'click'             : 'click',
			'submit form'       : 'submit',
			'click  .btn.save'  : 'save',
			'click  .btn.cancel': 'cancel',
		},

		initialize: function(){
			this.listenTo(Files, 'select', this.select);
			this.listenTo(Files, 'deselect', this.deselect);
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
				var file = new FileModel(data);
				Files.add(file);
				file.update(data);
			}
			if(this.action == 'edit'){
				this.selected.update(data);
				this.selected.trigger('deselect');
				Files.sort();
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

	return new EditorView();
});