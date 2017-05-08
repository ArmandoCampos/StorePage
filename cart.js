/*
	Armando Campos
	5/8/17
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

function isNumber(str){
	return !/\D/.test(str);
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

function save(key, value){
	localStorage[key] = value;
}

function load(key){
	return localStorage[key];
}

//


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


function rad_color_get(colorID){
	// Returns string of color name
	var name = "white";
	switch(colorID){
		case "0":
		case 0: name = "white"; break;
		case "1":
		case 1: name = "red"; break;
		case "2":
		case 2: name = "orange"; break;
		case "3":
		case 3: name = "yellow"; break;
		case "4":
		case 4: name = "green"; break;
		case "5":
		case 5: name = "blue"; break;
		case "6":
		case 6: name = "black"; break;
	}
	return name;
}


function item_type_get(itemID){
	var name = "Shirtdefault";
	switch(itemID){
		case "0":
		case 0: name = "T-Shirt"; break;
		case "1":
		case 1: name = "V-Neck Shirt"; break;
		case "2":
		case 2: name = "Long Sleeve"; break;
	}
	return name;
}


function page_load(){
	var col = load("col"), type = load("type");
	var str = "[ $"+load("price")+" - "+load("num")+" "+rad_color_get(col)+" "+item_type_get(type)+"(s)"+" ]";
	set_text("ttip_item", str);
	imgChange("displayshirt", "assets/shirtsketch"+String(type)+String(rad_color_get(col))+".png");
}
