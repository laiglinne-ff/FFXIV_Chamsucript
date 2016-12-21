/* -- This Library License Under GNU GPL v2 
	@Author Laighlinne_ff
*/
function connectWebSocket(uri)
{
	websocket = new WebSocket(uri);

	websocket.onmessage = function(evt) 
	{
		if (evt.data == ".") 
		{
			websocket.send(".");
		}
		else 
		{
			onLogLineRead(evt.data);
		}
	};

	websocket.onclose = function(evt) 
	{ 
		console.log("re-connect...");
		setTimeout(function(){connectWebSocket(uri)}, 5000);
	};

	websocket.onerror = function(evt) 
	{
		console.log(evt);
		websocket.close();
	};
}

try
{
	if(wsUri !== undefined)
		connectWebSocket(wsUri);
}
catch(ex) { }

Number.prototype.nanFix = function()
{
	return (isNaN(this)?0:this);
}

String.prototype.format = function(a)
{
	var reg = /(\{([^}]+)\})/im;
	var matches = this.match(reg);
	var result = this;

	for(var i in a)
		result = result.replace("{"+i+"}", a[i]);

	return result;
}

String.prototype.newElement = function(a,b,c)
{
	var result = this;
	result = result.concat("<=".replace("=",a.toLowerCase()));
	for(var i in b)
	{
		result = result.concat(" ").concat(b[i].name.concat("=\"").concat(b[i].value.replace(/\"/ig, "\\\""))).concat("\"");
	}
	result = result.concat(">");
	result = result.concat(c);
	result = result.concat("</=>".replace("=", a.toLowerCase()));

	return result;
}

String.prototype.contains = function(a)
{
	if(this.indexOf(a) > -1) return true;
	else return false;
}

String.prototype.replaceArray = function(a)
{
	var r = this;
	for(var i in a)
		while(r.contains(a[i].target))
			r = r.replace(a[i].target, a[i].replacement);

	return r;
}

function Language(l)
{
	if(l == undefined) var l = "ko";
	this.ln = l;
	this.jp = {
		"PLD":"ナイト",
		"GLD":"剣術士",
		"WAR":"戦",
		"MRD":"斧術士",
		"DRK":"暗",
		
		"MNK":"モンク",
		"PGL":"格闘士",
		"DRG":"竜",
		"LNC":"槍術士",
		"NIN":"忍",
		"ROG":"双剣士",
		"BRD":"吟",
		"ARC":"弓術士",
		"MCH":"機",
		"SMN":"召",
		"THM":"呪術士",
		"BLM":"黒",
		
		"WHM":"白",
		"CNJ":"幻術士",
		"SCH":"学",
		"ACN":"巴術士",
		"AST":"占",
		"LMB":"リミット",
		"FAIRY":"FAIRY",
		"AUTOTURRET":"AUTOTURRET",
		"EGI":"EGI",
		"CHOCOBO":"CHOCOBO",
	};
	this.en = {
		"PLD":"PLD",
		"GLD":"GLD",
		"WAR":"WAR",
		"MRD":"MRD",
		"DRK":"DRK",
		
		"MNK":"MNK",
		"PGL":"PGL",
		"DRG":"DRG",
		"LNC":"LNC",
		"NIN":"NIN",
		"ROG":"ROG",
		"BRD":"BRD",
		"ARC":"ARC",
		"MCH":"MCH",
		"SMN":"SMN",
		"THM":"THM",
		"BLM":"BLM",
		
		"WHM":"WHM",
		"CNJ":"CNJ",
		"SCH":"SCH",
		"ACN":"ACN",
		"AST":"AST",
		"LMB":"LMB",
		"FAIRY":"FAIRY",
		"AUTOTURRET":"AUTOTURRET",
		"EGI":"EGI",
		"CHOCOBO":"CHOCOBO",
	};
	this.ko = {
		"PLD":"나이트",
		"GLD":"검술사",
		"WAR":"전사",
		"MRD":"도끼술사",
		"DRK":"암흑기사",
		
		"MNK":"몽크",
		"PGL":"격투사",
		"DRG":"류상",
		"LNC":"창술사",
		"NIN":"닌자",
		"ROG":"쌍검사",
		"BRD":"음유시인",
		"ARC":"궁술사",
		"MCH":"기공사",
		"SMN":"소환사",
		"THM":"주술사",
		"BLM":"흑마도사",
		
		"WHM":"백마도사",
		"CNJ":"환술사",
		"SCH":"학자",
		"ACN":"비술사",
		"AST":"점성술사",
		"LMB":"리미트",
		"FAIRY":"요정",
		"AUTOTURRET":"포탑",
		"EGI":"에기",
		"CHOCOBO":"초코보",
	};
}

Language.prototype.get = function(v)
{
	try
	{
		return this[this.ln][v];
	}
	catch(ex)
	{
		return v;
	}
}

function Person(e, c)
{
	this.isPet = false;
	this.combatant = e;
	this.maxdamage = 0;
	this.encounter = this.combatant.encounter;
	var char = e.combatants[c];
	this.langpack = new Language();

	this.name = char.name;
	this.duration = char.duration;
	this.DURATION = parseInt(char.DURATION).nanFix();
	this.damage = parseInt(char.damage).nanFix();
	this.hits = parseInt(char.hits).nanFix();
	this.crithits = parseInt(char.crithits).nanFix();
	this.misses = parseInt(char.misses).nanFix();
	this.hitfailed = parseInt(char.hitfailed).nanFix();
	this.swings = parseInt(char.swings).nanFix();
	this.maxhit = char.maxhit.substr(0, char.maxhit.indexOf("-"));
	this.maxHit = parseInt(char.MAXHIT.replace(/,/im, "")).nanFix();
	this.healed = parseInt(char.healed).nanFix();
	this.critheals = parseInt(char.critheals).nanFix();
	this.heals = parseInt(char.heals).nanFix();
	this.cures = parseInt(char.cures).nanFix();
	this.maxheal = char.maxheal.substr(0,char.maxheal.indexOf("-"));
	this.maxHeal = parseInt(char.MAXHEAL.replace(/,/im, "")).nanFix();
	this.damagetaken = parseInt(char.damagetaken).nanFix();
	this.healstaken = parseInt(char.healstaken).nanFix();
	this.powerdrain = parseInt(char.powerdrain).nanFix();
	this.powerheal = parseInt(char.powerheal).nanFix();
	this.kills = parseInt(char.kills).nanFix();
	this.deaths = parseInt(char.deaths).nanFix();
	this.Last10DPS = parseInt(char.Last10DPS).nanFix();
	this.Last30DPS = parseInt(char.Last30DPS).nanFix();
	this.Last60DPS = parseInt(char.Last60DPS).nanFix();
	this.Job = char.Job.toUpperCase();
	this.Class = char.Job.toUpperCase();
	this.ParryPct = parseInt(char.ParryPct.replace("%", "")).nanFix();
	this.BlockPct = parseInt(char.BlockPct.replace("%","")).nanFix();
	this.OverHealPct = parseInt(char.OverHealPct.replace("%","")).nanFix();
	this.damagetaken = parseInt(char.damagetaken).nanFix();
	this.healstaken = parseInt(char.healstaken).nanFix();
	this.healedPct = 0;
	this.invalidheal = parseInt(this.healed / 100 * this.OverHealPct).nanFix();
	this.validheal = parseInt(this.healed - this.invalidheal);
	this.colors = {
		"PLD":[200, 255, 255],
		"WAR":[200, 40, 30],
		"DRK":[130, 40, 50],
		
		"MNK":[180, 140, 20],
		"DRG":[50, 90, 240],
		"NIN":[80, 70, 90],
		"BRD":[180, 200, 80],
		"MCH":[130, 255, 240],
		"SMN":[40, 150, 0],
		"BLM":[100, 70, 150],
		
		"WHM":[200, 195, 170],
		"SCH":[60, 60, 160],
		"AST":[200, 130, 90],
		"LMB":[255, 204, 0]
	};

	this.mergedDamage = this.damage;
	this.mergedHealed = this.healed;
	this.mergedHits = this.hits;
	this.mergedMisses = this.misses;
	this.mergedSwings = this.swings;
	this.mergedHeals = this.heals;
	this.mergedCrithits = this.crithits;
	this.mergedCritheals = this.critheals;
	this.mergedLast10DPS = this.Last10DPS;
	this.mergedLast30DPS = this.Last30DPS;
	this.mergedLast60DPS = this.Last60DPS;
	this.mergedDamagetaken = this.damagetaken;
	this.mergedHealstaken = this.healstaken;
	this.validHeal = this.validheal;
	this.invalidHeal = this.invalidheal;
	this.OverHPct = this.OverHealPct;

	this.petOwner = "";
	this.petOwnerExists = false;
	this.petData = [];

	this.rank = 0;
	this.petType = "Chocobo";

	this.role = "DPS";

	if(this.Class != "")
	{
		switch(this.Class)
		{
			case "SCH": case "WHM": case "AST": this.role = "Healer"; break;
			case "PLD": case "WAR": case "DRK": this.role = "Tanker"; break;
		}
	}

	// globalization
	if(this.Class == "")
	{
		if(
			this.name.indexOf("에기") > -1 || this.name.indexOf("카벙클") > -1|| // KOR
			this.name.toUpperCase().indexOf("EGI") > -1|| this.name.toUpperCase().indexOf("CARBUNCLE") > -1|| // ENG
			this.name.indexOf("エギ") > -1|| this.name.indexOf("カーバンクル")> -1 // JPN
		)
		{
			this.Job = "AVA";
			this.Class = "SMN";
			this.isPet = true;
			this.petType = "Egi";
		}
		
		if(this.name.indexOf("요정") > -1 || // KOR
			this.name.toUpperCase().indexOf("EOS") > -1|| this.name.toUpperCase("SELENE") > -1 || // ENG
			this.name.indexOf("フェアリー") > -1 // JPN
		)
		{
			this.Job = "AVA";
			this.Class = "SCH";
			this.isPet = true;
			this.role = "Healer";
			this.petType = "Fairy";
		}

		if(this.name.indexOf("자동포탑") > -1 || // KOR 
			this.name.toUpperCase().indexOf("AUTOTURRET") > -1 || // ENG
			this.name.indexOf("オートタレット") > -1 // JPN
		)
		{
			this.Job = "AVA";
			this.Class = "MCH";
			this.isPet = true;
			this.petType = "AutoTurret";
		}

		if(this.name.toUpperCase().indexOf("LIMIT BREAK") > -1|| this.name.indexOf("リミット") > -1)
		{
			this.Job = "LMB";
			this.Class = "LMB";
		}
	}
	
	if(this.isPet)
	{
		var regex = /(?:.*?)\((.*?)\)/im;
		var matches = this.name.match(regex);
		if(regex.test(this.name)) // do not use Array.length 
		{
			this.petOwner = matches[1];
		}
	}

	switch(this.Job)
	{
		case "GLD" : this.Class = "PLD"; break;
		case "MRD" : this.Class = "WAR"; break;
		case "PUG" : this.Class = "MNK"; break;
		case "LNC" : this.Class = "DRG"; break;
		case "ROG" : this.Class = "NIN"; break;
		case "ARC" : this.Class = "BRD"; break;
		case "THM" : this.Class = "BLM"; break;
		case "ACN" : this.Class = "SMN"; break;
		case "CNJ" : this.Class = "WHM"; break;
	}

	this.R = this.getColor().R;
	this.G =  this.getColor().G;
	this.B =  this.getColor().B;

	if(this.petType != "Chocobo")
	{
		this.R+= parseInt(this.R/4);
		this.G+= parseInt(this.G/4);
		this.B+= parseInt(this.B/4);
	}

	//calcValues
	this.recalc();
	if(this.Job == "") 
	{
		this.isPet = true;
		this.Class = "Chocobo";
	}
	this.classname = this.langpack.get(this.Class.toUpperCase());
}

Person.prototype.getColor = function(r, g, b)
{
	if(this.colors[this.Class] != undefined)
	{
		if(r==undefined) var r = 0;
		if(g==undefined) var g = 0;
		if(b==undefined) var b = 0;
		return {"R":(this.colors[this.Class][0]+r), "G":(this.colors[this.Class][1]+g), "B":(this.colors[this.Class][2]+b)};
	}
	else
	{
		return {"R":240, "G":220, "B":110};
	}
}

Person.prototype.recalc = function()
{
	this.dmgPct = parseFloat(this.mergedDamage / parseInt(this.encounter.damage) * 100).nanFix().toFixed(underDot);
	this.dps = parseFloat(this.mergedDamage / this.DURATION).nanFix().toFixed(underDot);
	this.encdps = parseFloat(this.mergedDamage / parseInt(this.encounter.DURATION)).nanFix().toFixed(underDot);
	this.crithitPct = parseFloat(this.mergedCrithits / this.mergedHits * 100).nanFix().toFixed(underDot);
	this.tohit = parseFloat(this.mergedHits / this.mergedSwings * 100).nanFix().toFixed(underDot);
	this.healedPct = parseFloat(this.mergedHealed / parseInt(this.encounter.healed) * 100).nanFix().toFixed(underDot);
	this.enchps = parseFloat(this.mergedHealed / parseInt(this.encounter.DURATION)).nanFix().toFixed(underDot);
	this.crithealPct = parseFloat(this.mergedCritheals / this.mergedHeals * 100).nanFix().toFixed(underDot);
	this.healedPct = parseFloat(this.mergedHealed / this.encounter.healed * 100).nanFix().toFixed(underDot);
	this.OverHPct = parseFloat(this.invalidHeal / this.validHeal * 100).nanFix().toFixed(underDot);
}

Person.prototype.merge = function(p)
{
	//sum target data
	this.mergedDamage += p.damage;
	this.mergedHealed +=  p.healed;
	this.mergedHits += + p.hits;
	this.mergedMisses += p.misses;
	this.mergedSwings += p.swings;
	this.mergedHeals += p.heals;
	this.mergedCrithits += p.crithits;
	this.mergedCritheals += p.critheals;
	this.mergedLast10DPS += p.Last10DPS;
	this.mergedLast30DPS += p.Last30DPS;
	this.mergedLast60DPS += p.Last60DPS;
	this.mergedDamagetaken += p.damagetaken;
	this.mergedHealstaken += p.healstaken;
	this.validHeal += p.validheal;
	this.invalidHeal += p.invalidheal;

	this.recalc();
};

function Combatant(e, sortkey)
{
	if(sortkey === null || sortkey === undefined) var sortkey = "encdps";
	this.summonerMerge = true;
	this.sortkey = sortkey;
	this.combatants = e.detail.Combatant;
	this.encounter = e.detail.Encounter;
	this.persons = [];
	this.duration = this.encounter.duration;
	this.maxdamage = 0; // for old versions
	this.maxValue = 0; // please use this value
	this.zone = this.encounter.CurrentZoneName;
	this.title = this.encounter.title;
	this.noPetPersons = [];
	this.sortvector = true;
	this.data = e;

	this.combatKey = this.encounter.title.concat(this.encounter.damage).concat(this.encounter.healed);
	for(var p in e.detail.Combatant)
	{
		this.persons[p] = new Person(this, p);
	}

	for(var p in this.persons)
	{
		if(!this.persons[p].isPet)
			this.noPetPersons.push(this.persons[p].name);
	}

	for(var i in this.persons)
	{
		var p = this.persons[i];
		if(this.summonerMerge)
		{
			if(p.isPet && p.petOwner != "" && p.petType != "Chocobo")
			{
				if(this.getData(p.petOwner) !== null)
				{
					if(this.noPetPersons.indexOf(p.petOwner) > -1)
					{
						this.persons[p.petOwner].merge(p);
					}
					else
					{
						if(this.persons["YOU"].Class == p.Class)
						{
							p.petOwner = "YOU";
							this.persons["YOU"].merge(p);
						}
					}
				}
				this.persons[i].recalc();
			}
		}
	}
	this.rerank(this.sortvector);
}

Combatant.prototype.activeSort = function()
{
	var sortkey = this.sortKey;

	if (this.summonerMerge)
	{
		switch(sortkey)
		{
			case "damage" : sortkey = "mergedDamage"; break;
			case "healed" : sortkey = "mergedHealed"; break;
			case "hits" : sortkey = "mergedHits"; break;
			case "misses" : sortkey = "mergedHits"; break;
			case "swings" : sortkey = "mergedSwings"; break;
			case "heals" : sortkey = "mergedHeals"; break;
			case "crithits" : sortkey = "mergedCrithits"; break;
			case "critheals" : sortkey = "mergedCritheals"; break;
			case "Last10DPS" : sortkey = "mergedLast10DPS"; break;
			case "Last30DPS" : sortkey = "mergedLast30DPS"; break;
			case "Last60DPS" : sortkey = "mergedLast60DPS"; break;
			case "damagetaken" : sortkey = "mergedDamagetaken"; break;
			case "healstaken" : sortkey = "mergedHealstaken"; break;
		}
	}

	if (sortkey == "maxhit") sortkey = "maxHit";
	if (sortkey == "maxheal") sortkey = "maxHeal";

	return sortkey;
}

Combatant.prototype.rerank = function(asc)
{
	// sort methods
	if(asc == undefined || asc === null) var asc = true;

	var personNew = [];

	for(var i in this.persons)
	{
		personNew.push({kval:this.persons[i][this.sortkey], val:this.persons[i]});
	}
	
	if(asc)
		personNew.sort(function(a, b){return b.kval - a.kval;});
	else // descending
		personNew.sort(function(a, b){return a.kval - b.kval;});

	this.persons = [];
	for(var i in personNew)
	{
		this.persons.push(personNew[i].val);
	}

	// rework maxdamage to MaxValue
	var i = 0;
	this.maxValue = 0;
	for(var p in this.persons)
	{
		if(parseInt(this.persons[p][this.activeSort()]) > this.maxValue)
		{
			this.maxValue = parseInt(this.persons[p][this.activeSort()]);
		}

		this.maxdamage = this.maxValue;
		this.persons[p].maxdamage = this.maxValue;

		if(this.persons[p].isPet && this.persons[p].petOwner != "" && this.persons[p].petType != "Chocobo" && this.summonerMerge) continue;
		this.persons[p].rank = i++;
	}
}

Combatant.prototype.sortkeyChange = function(e)
{
	this.sortkey = e;
	this.rerank();
}

Combatant.prototype.getData = function(c)
{
	for(var i in this.persons)
	{
		if(this.persons[i].name == c)
			return this.persons[i];
	}
}

function isSrcEnable()
{
	try { return srcEnable; } catch(ex) { return false; }
}

function isEndEnable()
{
	try { return endEnable; } catch(ex) { return false; }
}

function isZoomEnable()
{
	try { return zoomEnable; } catch(ex) { return false; }
}

function takeScreenshot()
{
	if(isSrcEnable())
	{
		console.log("CaptureOverlay");
	}
	else
	{
		document.dispatchEvent(new CustomEvent('onScreenShotTaked', {detail:{ take:false, fileurl:"" }}));
	}
}

function endEncounter()
{
	if(isEndEnable())
	{
		console.log("EncounterEnd");
	}
	else
	{
		document.dispatchEvent(new CustomEvent('onEncounterEndExecuted', {detail:{ take:false }}));
	}
}

function zoomResize(size)
{
	if(isZoomEnable())
	{
		console.log("Zoom"+size);
	}
	else
	{
		document.dispatchEvent(new CustomEvent('onZoomSizeChanged', {detail:{take:false, zoomsize:0}}));
	}
}

if (document.addEventListener) 
{
	// Mozilla, Opera, Webkit 
	document.addEventListener("DOMContentLoaded", function () 
	{
		document.removeEventListener("DOMContentLoaded", arguments.callee, false);
		domReady();
	}, false);
}
else if (document.attachEvent) 
{
	// Internet Explorer
	document.attachEvent("onreadystatechange", function () 
	{
		if (document.readyState === "complete") 
		{
			document.detachEvent("onreadystatechange", arguments.callee);
			domReady();
		}
	});
}

function domReady() 
{
	// Before
	try { document.addEventListener('beforeLogLineRead', beforeLogLineRead); } catch (ex) { }

	// On
	try { document.addEventListener('onOverlayDataUpdate', onOverlayDataUpdate); } catch (ex) { console.log("Core Error : onOverlayUpdate is not defined."); }
	try { document.addEventListener('onOverlayStateUpdate', onOverlayStateUpdate); } catch (ex) { }
	try { document.addEventListener('onLogLineRead', onLogLineRead); } catch (ex) { }
	try { document.addEventListener('onScreenShotTaked', onScreenShotTaked); } catch (ex) { }
	try { document.addEventListener('onEncounterEndExecuted', onEncounterEndExecuted); } catch (ex) { }
	try { document.addEventListener('onZoomSizeChanged', onZoomSizeChanged); } catch (ex) { }
	try { document.addEventListener('onBinaryFileOpen', onBinaryFileOpen); } catch (ex) { }

	// File IO (miniparse Extension)
	try { document.addEventListener('openFileDialog', openFileDialog); } catch (ex) { }
	try { document.addEventListener('getFileList', getFileList); } catch (ex) { }
	try { document.addEventListener('getDirectoryList', getDirectoryList); } catch (ex) { }
	try { document.addEventListener('afterLoadFile', afterLoadFile); } catch (ex) { }
}

var lastCombat = null;
var sortKey = "encdps";
var underDot = 1;
var delayOK = true;