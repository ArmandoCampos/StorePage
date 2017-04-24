/*
	Armando Campos
	3/21/17 -4/24/17
*/
// Constants
const NONE = -1;

/**
	* Alarms, used for delayed events.
*/
class alarm {
	constructor(){
		this.time = NONE;
		this.func = NONE;
		this.param = NONE;
	}

	update(){
		this.tick();
		this.check();
	}

	tick(){
		if(this.time != NONE){
			this.time = this.time - 1;
		}
	}

	check(){
		if(valid(this.time)){
			if(this.time == 0){
				// Execute Function
				if(this.param == NONE){
					this.func();
				}else{
					this.func(this.param);
				}
				this.reset();
			}
		}
	}

	set(time, func, param){
		this.time = time;
		this.func = func;
		this.param = param;
	}

	reset(){
		this.time = NONE;
		this.func = NONE;
		this.param = NONE;
	}
}

/**
	* Alarm System, controls alarms.
*/
class alarm_system {
	constructor(num){
		this.alarms = [NONE];
		for(var i = 0; i < num; i++){
			this.alarms.push(new alarm());
		}
	}

	get_alarm(aID){
		return this.alarms[aID];
	}

	update(){
		// Update all Alarms
		for(var i = 0; i < this.alarms.length; i++){
			var alrm = this.get_alarm(i);
			if(alrm != NONE){
				// Alarm Exists
				alrm.update();
			}
		}
	}

	// Add to Specific Position
	set(aID, time, func, param){
		this.get_alarm(aID).set(time, func, param);
	}

	// Add to Unknown Position
	// Not recommended if using Specifics
	add(time, func, param){
		var open = 0;
		for(var i = 0; i < this.alarms.length; i++){
			var alrm = this.get_alarm(i);
			if(alrm != NONE){
				// Alarm Exists
				if(alrm.time == NONE)open = i;
			}
		}
		// Set Alarm
		this.get_alarm(open).set(time, func, param);
	}

	wipe(){
		for(var i = 0; i < this.alarms.length; i++){
			var alrm = this.get_alarm(i);
			if(alrm != NONE){
				// Alarm Exists
				alrm.reset();
			}
		}
	}
}

// Custom Radio Buttons
class rad {
	constructor(index){
		this.index = index;
		this.activated = false;
	}

	get active(){
		return this.activated;
	}
}

class rads {
	constructor(rID, num){
		this.rID = rID;
		this.num = num;
		this.radios = [];
		for(var i = 0; i < num; i++){
			//alert("in loop"+i);
			this.radios.push(new rad(i));
		}
	}
 
	all_inactive(){
		for(var i = 0; i < this.num; i++){
			if(this.radios[i].active())return false;
		}
		return true;
	}

	set(rad_id){
		this.radios[rad_id].activated = true;
		var rr = "rad"+String(this.rID)+String(rad_id);
		classOn(rr, "rad_on");
		classOff(rr, "rad_off");
	}

	reset_all(){
		for(var i = 0; i < this.num; i++){
			this.radios[i].activated = false;
			var rr = "rad"+String(this.rID)+String(i);
			classOn(rr, "rad_off");
			classOff(rr, "rad_on");
		}
	}

	find(){
		for(var i = 0; i < this.num; i++){
			if(this.radios[i].active)return i;
		}
		return undefined;
	}
}

function rads_add(numrads){
	for(var i = 0; i < numrads; i++){
		var rnum = getByID('rads'+i).childElementCount;
		SYSTEM.RADS[i] = new rads(i, rnum);
		//alert("created rads:"+i);
	}
}

function rad_activate(rads_id, rad_id){
	var rads = SYSTEM.RADS[rads_id];
	rads.reset_all();
	rads.set(rad_id);
}

function rad_default(rads_id, rad_id){
	rad_activate(rads_id, rad_id);
}

// [ - - General Methods - - ]
/**
	* Get Element by use of ID.
	* @param {String} name ID of Element.
*/
function getByID(name){
	return document.getElementById(name);
}

/**
	* Turn Element Class On.
	* @param {String} el Element Name.
	* @param {String} cc Class Name.
*/
function classOn(el, cc){
	var elmnt = $('#'+String(el));
	if(!elmnt.hasClass(cc)){
		elmnt.toggleClass(cc);
	}
}

/**
	* Turn Element Class Off.
	* @param {String} el Element Name.
	* @param {String} cc Class Name.
*/
function classOff(el, cc){
	var elmnt = $('#'+String(el));
	if(elmnt.hasClass(cc)){
		elmnt.toggleClass(cc);
	}
}

function imgChange(el, source){
	getByID(el).src = source;
}

/**
	* Get Random Integer.
	* @param {Number} max Maximum Integer.
*/
function random_int(max){
	return Math.floor(Math.random()*max);
}

/**
	* Check if a Value is defined.
	* @param value Value to Check.
*/
function valid(value){
	return (value != NONE);
}

/**
	* Remove Random Value from Array. Warning, Will not check for remaining values.
	* @param array Array to remove value from.
*/
function array_random_removal(array){
	var length = array.length;
	var pos = random_int(length);
	var val = array[pos];
	while(val == NONE){
		pos = random_int(length);
		val = array[pos];
	}
	array[pos] = NONE;
	return val;
}

/**
	* Convert entire array into a String.
	* @param array Array to convert into String.
*/
function array_write(array){
	var str = "[";
	for(var i = 0; i < array.length; i++){
		var ext = ", ";
		if(i == array.length-1)ext = "]";
		str+=String(array[i])+ext;
	}
	return str;
}

/**
	* Convert entire 2D array into a String.
	* @param array Array to convert into String.
*/
function array_write2D(array){
	var str = "[";
	for(var i = 0; i < array.length; i++){
		var ext = ", ";
		if(i == array.length-1)ext = "]";
		str+=array_write(array[i])+ext;
	}
	return str;
}

/**
	* Retrieve Radio Button Selection.
*/
function find_radio(field){
	var radios = document.getElementsByName(field);

	//'document.'+form+'.'+field;
	for(var i = 0; i < radios.length; i++){
		if(radios[i].checked)return radios[i].value;
	}
}

function set_text(id, text){
	getByID(id).innerHTML = text;
}

function get_text(id){
	return String(getByID(id).value);
}

// - - - - - - - - - - - - - - - - - - -
// [ - - Initialize System - - ]
var SYSTEM = {
	ALARM: new alarm_system(6),
	RADS:  [NONE, NONE],
	ITEM: NONE
}

/**
	* Initialize Events.
*/
function init(numrads){
	this.interval = setInterval(update, 60);
	//alert("hey");
	rads_add(numrads);
}

/**
	* Update Events.
*/
function update(){
	SYSTEM.ALARM.update();
}

/**
	* Next Button.
*/
function btn_nxt(){
	var size = SYSTEM.RADS[0].find();//find_radio("size");
	var color = SYSTEM.RADS[1].find();
	var quant = SYSTEM.RADS[2].find();
	var notif = false;
	var msg = NONE;
	if(quant == undefined){
		// Trigger Notification
		notif = true;
		msg = 0;
	}
	if(size == undefined){
		// Trigger Notification
		notif = true;
		if(quant == undefined){
			msg = 2;
		}else{
			msg = 1;
		}
	}
	if(color == undefined){
		// Trigger Notification
		notif = true;
		if(quant == undefined){
			if(size == undefined){
				msg = 6;
			}else{
				msg = 4;
			}
		}else{
			if(size == undefined){
				msg = 5;
			}else{
				msg = 3;
			}
		}
	}
	if(quant == 6){
		var custom = getByID("quantcustom").value;
		if(custom == "")msg = 7;
	}
	switch(msg){
		case NONE: break;
		case 0: // Name
			set_text("notif_invalid", "Quantity is invalid...");
			break;
		case 1: // Size
			set_text("notif_invalid", "Size is invalid...");
			break;
		case 2: // Name and Size
			set_text("notif_invalid", "Quantity and Size is invalid...");
			break;
		case 3: // Color
			set_text("notif_invalid", "Color is invalid...");
			break;
		case 4: // Name and Color
			set_text("notif_invalid", "Quantity and Color is invalid...");
			break;
		case 5: // Size and Color
			set_text("notif_invalid", "Size and Color is invalid...");
			break;
		case 6: // Name, Size, and Color
			set_text("notif_invalid", "Quantity, Size, and Color is invalid...");
			break;
		case 7:
			set_text("notif_invalid", "Quantity is Invalid...");
			break;
	}
	if(notif){
		// Notification: Invalid.
		if(SYSTEM.ALARM.alarms[1].time == NONE){
			notif_invalid();
		}
		
		SYSTEM.ALARM.set(1, 10, notif_invalid, NONE);
		// Exit
		return false;
	}
	// Approve Name
	var sz = "Small";
	switch(size){
		case 1: sz = "Medium"; break;
		case 2: sz = "Large"; break;
		case 3: sz = "XLarge"; break;
		case 4: sz = "2XLarge"; break;
	}
	// Reveal rest of Form
	classOn("purchaseform", "form_on");
	classOff("purchaseform", "form_off");
	classOn("b_nxt", "hide");
	// Exit
	form_update();
	return false;
	//alert("Name Submitted: "+name+", Size:"+sz);
}

function rad_color_get(colorID){
	// Returns string of color name
	var name = "white";
	switch(colorID){
		case 0: name = "white"; break;
		case 1: name = "red"; break;
		case 2: name = "orange"; break;
		case 3: name = "yellow"; break;
		case 4: name = "green"; break;
		case 5: name = "blue"; break;
	}
	return name;
}

function rad_quant_get(quantID){
	var name = "1";
	switch(quantID){
		case 0: name = "1"; break;
		case 1: name = "2"; break;
		case 2: name = "3"; break;
		case 3: name = "5"; break;
		case 4: name = "9"; break;
		case 5: name = "12"; break;
		case 6: name = get_text("i_quant"); break;
	}
	return name;
}

function item_type_get(itemID){
	var name = "Shirtdefault";
	switch(itemID){
		case 0: name = "T-Shirt"; break;
		case 1: name = "V-Neck Shirt"; break;
	}
	return name;
}

function node_color_activate(radsID, radID){
	rad_activate(radsID, radID);
	form_update();
}

function btn_submit(){
	return false;
}

/**
	* Notification: Invalid.
*/
function notif_invalid(){
	var notif = $('#notif_invalid');
	notif.toggleClass("invalid_off");
	notif.toggleClass("invalid_on");
}

/*
	NAVIGATION
*/

function navigate(pageID){
	var path = "index.html";
	switch(pageID){
		case 0: break;
		case 1: path = "about.html"; break;
	}
	// Go to Path
	document.location.href = path;
}

function btn_setitem(itemID){
	SYSTEM.ITEM = itemID;
	form_update();
}

function btn_form(){
	document.location.href = "form.html";
}

function form_update(){
	switch(SYSTEM.ITEM){
		case NONE:
			classOn("storeform", "form_off");
			classOff("storeform", "form_on");
			break;
		case 0:
		case 1:
			classOn("storeform", "form_on");
			classOff("storeform", "form_off");
			// Update Display Shirt Image
			imgChange("displayshirt", "assets/shirtsketch"+String(SYSTEM.ITEM)+String(rad_color_get(SYSTEM.RADS[1].find()))+".png");

			var quant = SYSTEM.RADS[2].find();
			//alert("quant:"+quant);
			if(quant == 6){
				classOff("quantcustom", "hide");
			}else{
				classOn("quantcustom", "hide");
			}
			var num = rad_quant_get(quant);
			var col = rad_color_get(SYSTEM.RADS[1].find());
			var type = item_type_get(SYSTEM.ITEM);
			set_text("selitem", "[ "+String(num)+" "+String(col)+" "+String(type)+"(s)"+" ]");
			break;
	}
}

/*
	Page Layout:
	X- Navigation
	X- Item Selection
	- Selection Form {
		X- Display Item
		X- Color Selection
		X- Size Selection
		X- Next Button
		- Purchase Form {
			X- Name Input
			- 
			X- Order Text
			X- Submit Button
		}
	}
*/
