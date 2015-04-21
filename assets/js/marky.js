var items = [
	{"id":0,	"icon":"bandaid",	"name":"Zero",		"order":3,	"type":"vnc",	"url":"10.100.49.100"},
	{"id":1,	"icon":"car",			"name":"One",	"order":0,	"type":"vnc",	"url":"10.100.49.101"},
	{"id":2,	"icon":"diamond",	"name":"Two",		"order":1,	"type":"vnc",	"url":"10.100.49.102"},
	{"id":3,	"icon":"print",		"name":"Three",	"order":2,	"type":"vnc",	"url":"10.100.49.103"}
];

function list_build() {
	$('#list').html('');
	$.each(items, function(index, item) {
  	$('#list').append('<li data-id="'+ item.id +'"><div class="item_button">'+ item.name +'</div><div class="item_edit"><div class="btn btn_item_edit">E</div><div class="btn btn_item_reorder">R</div></div></li>');
	});
}

/*
 * Add a new item
 *
 */
function item_create() {
	var new_item = {
		"id": $('#inp_id').val(),
		"icon": $('#inp_icon').val(),
		"name": $('#inp_name').val(),
		"order": $('#inp_order').val(),
		"type": $('#inp_type').val(),
		"url": $('#inp_url').val()
	};
	items.push(new_item);
	list_build();
	item_edit_clearfields();
}
$(document).on('click', '.btn_item_create', function(event) {
	event.preventDefault();
	item_create();
});

/*
 * Remove an item
 *
 */
function item_remove(id) {
	items.splice(id, 1);
	list_build();
	item_edit_clearfields();
}

$(document).on('click', '.btn_item_remove', function(event) {
	event.preventDefault();
	toggle_item_remove_areyousure();
});

$(document).on('click', '.btn_item_remove_cancel', function(event) {
	event.preventDefault();
	toggle_item_remove_areyousure();
});

$(document).on('click', '.btn_item_remove_confirm', function(event) {
	event.preventDefault();
	var id = $('#inp_id').val();
	item_remove(id);
});

function toggle_item_remove_areyousure() {
	$('.btn_item_remove').toggle();
	$('.btngroup_item_remove_areyousure').toggle();
}


/*
 * Edit an item
 *
 */
function item_update(id) {
	$('#inp_id').val(items[id].id);
	$('#inp_order').val(items[id].order);
	$('#inp_type').val(items[id].type);
	$('#inp_name').val(items[id].name);
	$('#inp_icon').val(items[id].icon);
	$('#inp_url').val(items[id].url);
}
$(document).on('click', '.btn_item_edit', function(event) {
	event.preventDefault();
	var id = $(this).parent().parent().data('id');
	console.log(id);
	item_update(id);
});

// Cancel Update
function item_edit_cancel() {
	item_edit_clearfields();
}
$(document).on('click', '.btn_item_edit_cancel', function(event) {
	event.preventDefault();
	item_edit_cancel();
});

// Confirm Update
function item_edit_confirm() {
	var new_item = {
		"id": $('#inp_id').val(),
		"icon": $('#inp_icon').val(),
		"name": $('#inp_name').val(),
		"order": $('#inp_order').val(),
		"type": $('#inp_type').val(),
		"url": $('#inp_url').val()
	};
	items[$('#inp_id').val()] = new_item;
	list_build();
	item_edit_clearfields();
}
$(document).on('click', '.btn_item_edit_confirm', function(event) {
	event.preventDefault();
	item_edit_confirm();
});

// Clear Input fields
function item_edit_clearfields() {
	$('#inp_id').val('');
	$('#inp_order').val('');
	$('#inp_type').val('');
	$('#inp_name').val('');
	$('#inp_icon').val('');
	$('#inp_url').val('');
}

/*
 * Document Ready
 *
 */
$(function() {
	list_build();
});