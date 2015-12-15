requirejs.config({
	baseUrl: '',
	paths: {
		// Plugins
		text: 'js/lib/text',
		// Models
		FileModel: 'js/models/file',
		// Collections
		Files: 'js/collections/files',
		Proxy: 'js/collections/proxy',
		//Views
		FileView   : 'js/views/file',
		ListView   : 'js/views/list',
		ActionsView: 'js/views/actions',
		EditorView : 'js/views/editor',
		AppView    : 'js/views/app',
		// Templates
		FileTpl: 'tpl/file.tpl',
	}
});

require(['AppView'], function(AppView){
	var app = new AppView();
});
