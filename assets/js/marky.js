window.$ = window.jQuery = require('./assets/lib/jquery-2.1.3.min.js'); // comment for dev
require('./assets/lib/jquery-ui-1.11.4.custom/jquery-ui.min.js'); // comment for dev
var ipc = require('ipc'); // comment for dev

var items = [
	{"id":0,	"icon":"bandaid",	"name":"Zero",		"order":3,	"url":"10.100.49.100"},
	{"id":1,	"icon":"car",			"name":"One",			"order":0,	"url":"10.100.49.101"},
	{"id":2,	"icon":"diamond",	"name":"Two",			"order":1,	"url":"10.100.49.102"},
	{"id":3,	"icon":"print",		"name":"Three",		"order":2,	"url":"10.100.49.103"}
];


var animSpeed = 200;

function compare(a,b) {
  if (a.order < b.order)
     return -1;
  if (a.order > b.order)
    return 1;
  return 0;
}

function getObjByProp(arr, prop, attr) {
	for (var i = 0; i < arr.length; i++) {
	  if (arr[i][prop] == attr){
			return arr[i];
	  }
	}
}
var editMode = false;
function list_build() {
	items.sort(compare);
	$('#list').html('');
	if(items.length > 0) {
		$.each(items, function(index, item) {
	  	$('#list').append('<li data-id="'+ item.id +'"><div class="item_button"><i class="icon pe-7s-'+ item.icon +'"></i>'+ item.name +'</div><div class="item_edit"><div class="btn btn_item_edit"><i class="icon pe-7s-edit"></i></div><div class="btn btn_item_reorder"><i class="icon pe-7s-menu"></i></div></div></li>');
		});
		$('#list').sortable({
			handle: '.btn_item_reorder',
			axis: 'y'
		});
		if(editMode == true) {
			$('.item_button').css({'width': '154px'});
		}
	} else {
		$('#list').append('<li ><div class="item_addone"><i class="icon pe-7s-up-arrow"></i>Add an item to begin</div></li>');
	}
}

/*
 * About
 *
 */
var about_pane = false;
function toggle_about_pane() {
	if(about_pane == false) {
		$('#pane_list .content').css({'border-left': '1px solid #ededee'});
		$('#pane_list .content').animate({'left': '200px'}, animSpeed, function(event) {
			disable_editMode();
		});
		about_pane = true;
	} else {
		$('.pane .content').animate({'left': '0'}, animSpeed, function(event) {
			$('#pane_list .content').css({'border-left': 'none'});
		});
		about_pane = false;
	}	
}
$(document).on('click', '.btn_about', function(event) {
	event.preventDefault();
	toggle_about_pane();
});
$(document).on('click', '.steveostudios', function(event) {
	event.preventDefault();
	link_goto('http://steveostudios.tv');
});
/*
 * Edit Mode
 *
 */
function toggle_edit_mode() {
	if(items.length > 0 && about_pane == false) {
		if(editMode == false) {
			$('.item_button').animate({'width': '154px'}, animSpeed);
			editMode = true;
		} else {
			$('.item_button').animate({'width': '224px'}, animSpeed);
			editMode = false;
		}	
	}
}
function disable_editMode() {
	$('.item_button').css({'width': '224px'});
	editMode = false;
}
$(document).on('click', '.btn_edit', function(event) {
	event.preventDefault();
	toggle_edit_mode();
});


/*
 * Reorder Items
 *
 */
$('#list').on( "sortstop", function(event, ui) {
	var sorted_ids = $('#list').sortable('toArray', {attribute: 'data-id'});
	for (i = 0; i < sorted_ids.length; ++i) {
		var item_id = sorted_ids[i];
		getObjByProp(items, 'id', item_id).order = i;
	}
	items_save();
	list_build();
});

/*
 * Add a new item
 *
 */
$(document).on('click', '.btn_item_create', function(event) {
	event.preventDefault();
	if(about_pane == false) {
		item_update();
		$('.btn_item_remove').hide();
		$('.pane').animate({'left': '-250px'}, animSpeed);
	}
});

/*
 * Remove an item
 *
 */
function item_remove(id) {
	items.splice(id, 1);
	list_build();
	items_save();
	item_edit_clearfields();

	disable_editMode();
	$('.pane').animate({'left': '0'}, animSpeed);
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
	if(id == null) {
		var new_id = 0;
		if (items.length != 0) {
			for (i = 0; i < items.length; ++i) {
				if(parseInt(items[i].id) > new_id) {
	    		new_id = items[i].id;
				}
			}
			new_id++;
		}
		$('#inp_new').val('true');
		$('#inp_id').val(new_id);
		$('#inp_order').val(items.length);
	} else {
		var item = getObjByProp(items, 'id', id);
		$('#inp_new').val('false');
		$('#inp_id').val(item.id);
		$('#inp_order').val(item.order);
		$('#inp_name').val(item.name);
		$('#inp_icon').val(item.icon);
		$('.btn_select_icon').html('<i class="icon pe-7s-'+ item.icon +'"></i>');
		$('#icons #icon_'+ item.icon).addClass('selected');
		$('#inp_url').val(item.url);
	}
	$('.pane').animate({'left': '-250px'}, animSpeed);
}
$(document).on('click', '.btn_item_edit', function(event) {
	event.preventDefault();
	var id = $(this).parent().parent().data('id');
	item_update(id);
});

// Cancel Update
function item_edit_cancel() {
	disable_editMode();
	$('.pane').animate({'left': '0'}, animSpeed, function(event) {
		item_edit_clearfields();
	});
	
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
		"url": $('#inp_url').val()
	};
	if($('#inp_new').val() == 'true') {
		items.push(new_item);
	} else {
		items[$('#inp_id').val()] = new_item;
	}
	list_build();
	items_save();

	disable_editMode();
	$('.pane').animate({'left': '0'}, animSpeed, function(event) {
		item_edit_clearfields();
	});
}
$(document).on('click', '.btn_item_edit_confirm', function(event) {
	event.preventDefault();
	item_edit_confirm();
});

/*
 * Change Icon
 *
 */
function item_edit_select_icon() {
	var icon = $('#inp_icon').val();
	if (icon != '') {
		$('#pane_icons .content').animate({scrollTop: $('#icon_'+ icon).position().top - $('#pane_icons .content').height()/2 + $('#icon_moon').height()/2}, "slow");
	} else {
		$('#pane_icons .content').animate({scrollTop: 0}, "slow");
	}
	$('.pane').animate({'left': '-500px'}, animSpeed);
}
$(document).on('click', '.btn_select_icon', function(event) {
	event.preventDefault();
	item_edit_select_icon();
});

function item_edit_select_icon_confirm(icon) {
	$('#inp_icon').val(icon);
	$('.btn_select_icon').html('<i class="icon pe-7s-'+ icon +'"></i>');
	$('#icons #icon_'+ icon).addClass('selected');
	$('.pane').animate({'left': '-250px'}, animSpeed);
}
$(document).on('click', '#icons li', function(event) {
	event.preventDefault();
	var icon = $(this).attr('id').substring(5);
	item_edit_select_icon_confirm(icon);
});

// Clear Input fields
function item_edit_clearfields() {
	$('#inp_new').val('');
	$('#inp_id').val('');
	$('#inp_order').val('');
	$('#inp_name').val('');
	$('#inp_icon').val('');
	$('#inp_url').val('');
	$('.btn_item_remove').show();
	$('.btngroup_item_remove_areyousure').hide();
	$('.btn_select_icon').html('');
	$('#icons li').removeClass('selected');
}

$(document).on('click', '.item_button', function(event) {
	event.preventDefault();
	var id = $(this).parent().data('id');
	var item = getObjByProp(items, 'id', id);
	console.log(item.url);
  link_goto(item.url);
});
function link_goto(url) {
	var arg_send = {
		url: url
	}
	ipc.send('goto_link', arg_send);
}

function items_open() {
	ipc.send('open_linkfile'); // comment for dev
	console.log('opened: '+ new Date());
}
ipc.on('opened_linkfile', function(arg_receive) { // comment for dev
  items = arg_receive; // comment for dev
  list_build(); // comment for dev
}); // comment for dev

function items_save() {
	ipc.send('save_linkfile', items); // comment for dev
}
ipc.on('saved_linkfile', function(arg_receive) { // comment for dev
  console.log('saved: '+ new Date()); // comment for dev
}); // comment for dev

/*
 * Document Ready
 *
 */
$(function() {
	items_open();
	// list_build(); // uncomment for dev
});