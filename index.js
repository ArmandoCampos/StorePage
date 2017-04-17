/*
	Armando Campos
	3/21/17 - 3/31/17
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
	var name = getByID("i_name").value;
	var size = SYSTEM.RADS[0].find();//find_radio("size");
	var notif = false;
	if(name.length == 0){
		// Trigger Notification
		notif = true;
		set_text("notif_invalid", "Name is invalid...");
	}
	if(size == undefined){
		// Trigger Notification
		notif = true;
		if(name.length == 0){
			set_text("notif_invalid", "Name and Size is invalid...");
		}else{
			set_text("notif_invalid", "Size is invalid...");
		}
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
	// Exit
	return false;
	//alert("Name Submitted: "+name+", Size:"+sz);
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
			// Update Images
			for(var i = 0; i < 5; i++){
				imgChange("ishirt"+String(i), "assets/shirtsketch"+String(SYSTEM.ITEM)+".png");
			}
			break;
	}
}

/*
	Page Layout:
	X- Navigation
	X- Item Selection
	- Selection Form {
		- Color Selection
		X- Size Selection
		X- Next Button
		- Purchase Form {
			- 
			X- Submit Button
		}
	}
*/
