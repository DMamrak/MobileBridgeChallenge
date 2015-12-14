requirejs.config({
	baseUrl: 'js',
	paths: {
		// Models
		FileModel: 'models/file',
		// Collections
		Files: 'collections/files',
		Proxy: 'collections/proxy',
		//Views
		FileView   : 'views/file',
		ListView   : 'views/list',
		ActionsView: 'views/actions',
		EditorView : 'views/editor',
		AppView    : 'views/app'
	}
});

require(['AppView'], function(AppView){
	var app = new AppView();
});
