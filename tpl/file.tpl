<%
var map = {
	txt: 'Plain text',
	rtf: 'Reach text',
	doc: 'Microsoft Word',
};
%>
<td> <span class="glyphicon <%= marked ? 'glyphicon-star' : 'glyphicon-star-empty' %>"></span></td>
<td><%= name %>.<%= type %></td>
<td><%= map[type] %></td>
<td><%= size %></td>