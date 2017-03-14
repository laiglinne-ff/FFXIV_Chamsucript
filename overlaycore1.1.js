var webs = null;
var QueryString = function () 
{
	// This function is anonymous, is executed immediately and 
	// the return value is assigned to QueryString!
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) 
	{
		var pair = vars[i].split("=");
			// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") 
		{
			query_string[pair[0]] = decodeURIComponent(pair[1]);
			// If second entry with this name
		} 
		else if (typeof query_string[pair[0]] === "string") 
		{
			var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
			query_string[pair[0]] = arr;
			// If third or later entry with this name
		} 
		else 
		{
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	} 
	return query_string;
}();

// check host (islocal)
if(wsUri.indexOf("@HOST_PORT@") > -1)
{
	wsUri = wsUri.replace(/ws:\/\/@HOST_PORT@/im, QueryString["HOST_PORT"]);
	wsUri = wsUri.replace(/\/+/ig, "/");
}

function dbg(v)
{
	this.debug = v;

	this.log = function(object)
	{
		if (this.debug)
			console.log(object);
	}
};

class ActWebsocketInterface
{
	constructor(uri, path = "MiniParse") {
		// url check
		var querySet = this.getQuerySet();
		if(querySet["HOST_PORT"] != undefined)
		{
		    uri = querySet["HOST_PORT"] + path;
		}
		this.uri = uri;
		this.id = null;
		this.activate = false;
		
		var This = this;
		document.addEventListener('onBroadcastMessage', function(evt) {
			This.onBroadcastMessage(evt);
		});
		document.addEventListener('onRecvMessage', function(evt) {
			This.onRecvMessage(evt);
		});
		window.addEventListener('message', function (e) 
		{
			if (e.data.type === 'onBroadcastMessage') 
			{
				This.onBroadcastMessage(e.data);
			}
			if (e.data.type === 'onRecvMessage') 
			{
				This.onRecvMessage(e.data);
			}
		});
	}
	connect() {
		if(this.websocket != undefined && this.websocket != null)
			this.close();
		this.activate = true;
		var This = this;
		this.websocket = new WebSocket(this.uri);
		this.websocket.onopen = function(evt) {This.onopen(evt);};
		this.websocket.onmessage = function(evt) {This.onmessage(evt);};
		this.websocket.onclose = function(evt) {This.onclose(evt);};
		this.websocket.onerror = function(evt) {This.onerror(evt);};
	}
	close() {
		this.activate = false;
		if(this.websocket != null && this.websocket != undefined)
		{
			this.websocket.close();
		}
	}
	onopen(evt) {
		// get id from useragent
		if(this.id != null && this.id != undefined)
		{
			this.set_id(this.id);
		}
		else
		{
			if(overlayWindowId != undefined)
			{
				this.set_id(overlayWindowId);
				self.id = overlayWindowId;
			}
			else
			{
				var r = new RegExp('[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}');
				var id = r.exec(navigator.userAgent);
				if(id != null && id.length == 1)
				{
					this.set_id(id[0]);
					self.id = id;
				}
			}
		}
	}
	onclose(evt) {
		this.websocket = null;
		if(this.activate)
		{
			var This = this;
			setTimeout(function() {This.connect();}, 5000);
		}
	}
	onmessage(evt) {
		if (evt.data == ".")
		{
			// ping pong
			this.websocket.send(".");
		}
		else
		{
			try{
				var obj = JSON.parse(evt.data);
				var type = obj["type"];
				if(type == "broadcast")
				{
					var from = obj["from"];
					var type = obj["msgtype"];
					var msg = obj["msg"];
					document.dispatchEvent(new CustomEvent('onBroadcastMessage', { detail: obj }));
				}
				if(type == "send")
				{
					var from = obj["from"];
					var type = obj["msgtype"];
					var msg = obj["msg"];
					document.dispatchEvent(new CustomEvent('onRecvMessage', { detail: obj }));
				}
				if(type == "set_id")
				{
					//document.dispatchEvent(new CustomEvent('onIdChanged', { detail: obj }));
				}
			}
			catch(e)
			{
			}
		}
	}
	onerror(evt) {
		this.websocket.close();
		console.log(evt);
	}
	getQuerySet() {
		var querySet = {};
		// get query 
		var query = window.location.search.substring(1);
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			try{
				var pair = vars[i].split('=');
				querieSet[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
			}
			catch(e)
			{
			}
		}
		return querySet;
	}
	
	
	broadcast(type, msg){
		var obj = {};
		obj["type"] = "broadcast";
		obj["msgtype"] = type;
		obj["msg"] = msg;
		this.websocket.send(JSON.stringify(obj));
	}

	send(to, type, msg){
		var obj = {};
		obj["type"] = "send";
		obj["to"] = to;
		obj["msgtype"] = type;
		obj["msg"] = msg;
		this.websocket.send(JSON.stringify(obj));
	}
	
	overlayAPI(type, msg){
		var obj = {};
		obj["type"] = "overlayAPI";
		obj["msgtype"] = type;
		obj["msg"] = msg;
		this.websocket.send(JSON.stringify(obj));
	}
	
	set_id(id){
		var obj = {};
		obj["type"] = "set_id";
		obj["id"] = id;
		this.websocket.send(JSON.stringify(obj));
	}

	onRecvMessage(e)
	{
	}
	
	onBroadcastMessage(e)
	{
	}
};

// ACTWebSocket 적용
class WebSocketImpl extends ActWebsocketInterface
{
    constructor(uri, path = "MiniParse") 
    {
        super(uri, path);
    }
    //send(to, type, msg)
    //broadcast(type, msg)
    onRecvMessage(e)
    {
        onRecvMessage(e);
    }

    onBroadcastMessage(e)
    {
        onBroadcastMessage(e);
    }
};

// string : StringObject.format(ObjectArray a)
// 사용예 : "{abc}{def}".format({abc:"wow", def:" awesome!"}); => return "wow awesome!";
String.prototype.format = function(a)
{
	var reg = /(\{([^}]+)\})/im;
	var matches = this.match(reg);
	var result = this;

	for(var i in a)
		result = result.replace("{"+i+"}", a[i]);

	return result;
};

String.prototype.contains = function(a)
{
	if(this.indexOf(a) > -1) return true;
	else return false;
};

String.prototype.replaceArray = function(a)
{
	var r = this;
	for(var i in a)
		while(r.contains(a[i].target))
			r = r.replace(a[i].target, a[i].replacement);

	return r;
};

Number.prototype.nanFix = function()
{
	return parseFloat(isNaN(this)?0:this);
};

Number.prototype.numFormat = new function()
{
    var str = "";
    var data = 0;

    try
    {
        if (data != Infinity && data != 0 && data != NaN)
        {
            var reg = /(^[+-]?\d+)(\d{3})/;
            var n = (this + "");
            while (reg.test(n)) n = n.replace(reg, "$1,$2");
            return n;
        }
        else
            return "0";
    }
    catch (ex)
    {
        return "0";
    }
};

// 이벤트 리스너를 자동으로 추가하도록 지정합니다.
// 사용할 스크립트의 맨 위에 선언해야 정상적으로 작동을 보장합니다.
if (document.addEventListener) 
{
	// Mozilla, Opera, Webkit 
	document.addEventListener("DOMContentLoaded", function () 
	{
		document.removeEventListener("DOMContentLoaded", arguments.callee, false);
		domReady();
	}, false);

    /* ACTWebSocket 적용 */
    window.onbeforeunload = function() 
    {
        webs.close();
    };
    
    window.addEventListener("unload", function() 
    {
        webs.close();
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

window.addEventListener('message', function (e) 
{
    if (e.data.type === 'onBroadcastMessage') 
    {
        onBroadcastMessage(e.data);
    }
    if (e.data.type === 'onRecvMessage') 
    {
        onRecvMessage(e.data);
    }
});

function domReady() 
{
    /* ACTWebSocket 적용 */
	try
	{
		webs = new WebSocketImpl(wsUri);
		webs.connect();
		console.log("Connecting...");
	}
	catch(ex)
	{
		console.log("[ERROR] : WebSocket has Error [] "+ex);
	}

	// Logline
	try { document.addEventListener('beforeLogLineRead', beforeLogLineRead); } catch (ex) { }
	try { document.addEventListener('onLogLineRead', onLogLineRead); } catch (ex) { }

	// On
	try { document.addEventListener('onOverlayDataUpdate', onOverlayDataUpdate); } catch (ex) { console.log("Core Error : onOverlayDataUpdate is not defined."); }
	try { document.addEventListener('onOverlayStateUpdate', onOverlayStateUpdate); } catch (ex) { }

    // ReadyEvent
    try { onDocumentLoad(); } catch(ex) { }
}

function onRecvMessage(e)
{
    if(e.detail.msgtype == "Chat")
    {
        document.dispatchEvent(new CustomEvent("onChatting",{detail:e.detail.msg}));
    }
    else
    {
        console.log(e.detail.msgtype+":"+e.detail.msg);
    }
}

/* 메세지 처리부 여기 있음 맨날 못찾음 눈깔 ㅄ색기양 스크롤 한참 굴리지 마라 */
function onBroadcastMessage(e)
{
    if(e.detail.msgtype == "CombatData")
    {
		lastCombatRaw = e.detail.msg;
		lastCombat = new Combatant({detail:lastCombatRaw}, sortKey);

		if (lastCombat != null && myName != "" && myName != undefined && myName != null)
		{
			lastCombat.Combatant["YOU"].displayName = myName;
		}

        document.dispatchEvent(new CustomEvent('onOverlayDataUpdate',{detail:lastCombatRaw}));
    }
    else
    {
        switch(e.detail.msgtype)
        {
            case "SendCharName":
                document.dispatchEvent(new CustomEvent("onCharacterNameRecive",{detail:e.detail.msg}));
				myName = e.detail.msg.charName;
                break;
            case "AddCombatant":
            
                break;
            case "RemoveCombatant":
            
                break;
            case "AbilityUse":
            
                break;
            case "Chat":
                document.dispatchEvent(new CustomEvent("onChatting",{detail:e.detail.msg}));
                break;
            default:
                console.log(e.detail.msgtype+":"+e.detail.msg);
                break;
        }
    }
}
// ACTWebSocket 적용 끝

function Person(e, p)
{
    this.parent = p;
    this.Class = "";
    for(var i in e)
    {
        if (i.indexOf("NAME") > -1) continue;
        if (i == "t" || i == "n") continue;
        var onlyDec = e[i].replace(/[0-9.,%]+/ig, "");
        if (onlyDec != "")
        {
            if (onlyDec == "---" || onlyDec == "--")
                this[i] = 0;
            else
                this[i] = e[i];
        }
        else
        {
            var tmp = parseFloat(e[i].replace(/[,%]+/ig, "")).nanFix().toFixed(underDot);
            if (e[i].indexOf("%") > 0)
                this[i] = parseFloat(tmp);
            else if (Math.floor(tmp) != tmp || e[i].indexOf(".") > 0)
                this[i] = parseFloat(tmp);
            else
                this[i] = parseInt(tmp).nanFix();
        }
    }

    try
    {
        this.maxhitstr = this.maxhit.substring(0, this.maxhit.indexOf("-"));
        this.maxhitval = parseInt(this.maxhit.substring(this.maxhit.indexOf("-") + 1).replace(/,/, "")).nanFix();
    }
    catch (ex)
    {
        this.maxhit = "?-0";
        this.maxhitstr = "";
        this.maxhitval = 0;
    }

    try
    {
        this.maxhealstr = this.maxheal.substring(0, this.maxheal.indexOf("-"));
        this.maxhealval = parseInt(this.maxheal.substring(this.maxheal.indexOf("-") + 1).replace(/,/, "")).nanFix();
    }
    catch (ex)
    {
        this.maxheal = "?-0";
        this.maxhealstr = "";
        this.maxhealval = 0;
    }

    if (this.DURATION <= 0)
    {
        // 
        this.dps = parseFloat((this.damage / this.parent.DURATION).nanFix().toFixed(underDot));
        this.hps = parseFloat((this.healed / this.parent.DURATION).nanFix().toFixed(underDot));

        this.DPS = Math.floor(this.dps);
        this.HPS = Math.floor(this.hps);

        this["DPS-k"] = Math.floor(this.dps / 1000);
        this["HPS-k"] = Math.floor(this.hps / 1000);

        for(var i in this)
        {
            if (this[i] == "∞")
                this[i] = 0;
        }
    }

    /* Jobname refactoring */
    if (this.Job != "")
        this.Class = this.Job.toUpperCase();

	this.petType = "Chocobo";
    this.isPet = false;
    this.role = "DPS";
    this.rank = 0;
    this.maxdamage = 0;
	this.displayName = this.name;
	this.isLower = false;

    // Give Job
	var vjob = this.Job;
	
	if (vjob != "") vjob = this.Job.toUpperCase();
    switch(vjob)
    {
        case "GLD" : this.Class = "PLD"; this.isLower = true; break;
        case "MRD" : this.Class = "WAR"; this.isLower = true; break;
        case "PUG" : this.Class = "MNK"; this.isLower = true; break;
        case "LNC" : this.Class = "DRG"; this.isLower = true; break;
        case "ROG" : this.Class = "NIN"; this.isLower = true; break;
        case "ARC" : this.Class = "BRD"; this.isLower = true; break;
        case "THM" : this.Class = "BLM"; this.isLower = true; break;
        case "ACN" : this.Class = "SMN"; this.isLower = true; break;
        case "CNJ" : this.Class = "WHM"; this.isLower = true; break;
    }

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

    /* DPS RECALCULATE */
    if(this.overHeal != undefined)
    {
        
    }

	this.color = {
		R:this.getColor().R,
		G:this.getColor().G,
		B:this.getColor().B
	}

	if(this.petType != "Chocobo")
	{
		this.color.R+= parseInt(this.color.R/3);
		this.color.G+= parseInt(this.color.G/3);
		this.color.B+= parseInt(this.color.B/3);
	}

    this.visible = true;
    this.original = {
        // 
        // dmg
        Damage:this.damage,
        Hits:this.hits,
        Misses:this.misses,
        Swings:this.swings,
        Crithits:this.crithits,
        Damagetaken:this.damagetaken,
        // heals
        Heals:this.heals,
        Healed:this.healed,
        Critheals:this.critheals,
        Healstaken:this.healstaken,
        DamageShield:this.damageShield,
        OverHeal:this.overHeal,
        AbsorbHeal:this.absorbHeal,
        // lastdps
        Last10DPS:this.Last10DPS,
        Last30DPS:this.Last30DPS,
        Last60DPS:this.Last60DPS,
        Last180DPS:this.Last180DPS,
    };

    // 펫인데 클래스도 있는데 오너가 없으면 YOU
    if (this.isPet && this.Class != "" && this.parent.users[this.petOwner] == undefined)
    {
        this.petOwner = "YOU";
    }

    for(var i in this.original)
    {
        if (i.indexOf("Last") > -1)
            this["merged"+i] = this[i];
        else
            this["merged"+i] = this[i.substr(0,1).toLowerCase()+i.substr(1)];
    }

	this.pets = {};
}

Person.prototype.returnOrigin = function()
{
    for(var i in this.original)
    {
        if (i.indexOf("Last") > -1)
            this["merged"+i] = this[i];
        else
            this["merged"+i] = this[i.substr(0,1).toLowerCase()+i.substr(1)];
    }
};

Person.prototype.merge = function(person)
{
	this.returnOrigin();
	this.pets[person.name] = person;

	for(var k in this.pets)
	{
		for(var i in this.original)
		{
			if (i.indexOf("Last") > -1)
				this["merged"+i] += this.pets[k].original[i];
			else
				this["merged"+i] += this.pets[k].original[i];
		}
	}

	Debug.log("merge "+this.name+" << "+person.name);

    this.recalculate();
};

// old version
Person.prototype.recalc = function()
{
    this.recalculate();
};

Person.prototype.recalculate = function()
{
    var dur = this.DURATION;
    if (dur == 0) dur = 1;

    this.dps = pFloat(this.mergedDamage / dur);
    this.encdps = pFloat(this.mergedDamage / this.parent.DURATION);
    this.hps = pFloat(this.mergedHealed / dur);
    this.enchps = pFloat(this.mergedHealed / this.parent.DURATION);

    this["DAMAGE-k"] = Math.floor(this.mergedDamage / 1000);
    this["DAMAGE-m"] = Math.floor(this.mergedDamage / 1000000);

    this.DPS = Math.floor(this.dps);
    this["DPS-k"] = Math.floor(this.dps / 1000);
    this.ENCDPS = Math.floor(this.encdps);
    this.ENCHPS = Math.floor(this.enchps);
    this["ENCDPS-k"] = Math.floor(this.encdps / 1000);
    this["ENCHPS-k"] = Math.floor(this.enchps / 1000);

    this["damage%"] = pFloat(this.mergedDamage / this.parent.Encounter.damage * 100);
    this["healed%"] = pFloat(this.mergedHealed / this.parent.Encounter.healed * 100);

    this["crithit%"] = pFloat(this.mergedCrithits / this.hits * 100);
    this["critheal%"] = pFloat(this.mergedCritheals / this.heals * 100);

    this.tohit = pFloat(this.mergedHits / this.mergedSwings * 100);
};

// 해당 유저의 직업에 따른 기본 지정 소울 크리스탈 색을 가져옵니다. 재정의하여 사용할 수도 있습니다.
// object : PersonObject.getColor(int r, int g, int b)
Person.prototype.getColor = function(r, g, b)
{
	if(jobColors[this.Class] != undefined)
	{
		if(r==undefined) var r = 0;
		if(g==undefined) var g = 0;
		if(b==undefined) var b = 0;
		return {"R":(jobColors[this.Class][0]+r), "G":(jobColors[this.Class][1]+g), "B":(jobColors[this.Class][2]+b)};
	}
	else
	{
		return {"R":240, "G":220, "B":110};
	}
};

Person.prototype.get = function(key)
{
	if (this.parent.summonerMerge)
	{
		switch (key)
		{
			case "damage" : key = "mergedDamage"; break;
			case "hits" : key = "mergedHits"; break;
			case "misses" : key = "mergedMisses"; break;
			case "swings" : key = "mergedSwings"; break;
			case "crithits" : key = "mergedCrithits"; break;
			case "damagetaken" : key = "mergedDamagetaken"; break;
			// heals
			case "heals" : key = "mergedHeals"; break;
			case "healed" : key = "mergedHealed"; break;
			case "critheals" : key = "mergedCritheals"; break;
			case "healstaken" : key = "mergedHealstaken"; break;
			case "damageShield" : key = "mergedDamageShield"; break;
			case "overHeal" : key = "mergedOverHeal"; break;
			case "absorbHeal" : key = "mergedAbsorbHeal"; break;
			// lastdps
			case "Last10DPS" : key = "mergedLast10DPS"; break;
			case "Last30DPS" : key = "mergedLast30DPS"; break;
			case "Last60DPS" : key = "mergedLast60DPS"; break;
			case "Last180DPS" : key = "mergedLast180DPS"; break;
		}
	}

	return this[key];
}

function Combatant(e, sortkey)
{
    if (sortkey == undefined) var sortkey = "encdps";
    if (lang == undefined) var lang = "ko";

    this.Encounter = {};
    this.Combatant = {};
    this.users = {};

    for (var i in e.detail.Combatant)
    {
        this.users[i] = true;
    }
    
    // 모든 Encounter 값을 가지고 있게끔
    for(var i in e.detail.Encounter)
    {
        if (i == "t" || i == "n") continue;
        var onlyDec = e.detail.Encounter[i].replace(/[0-9.,%]+/ig, "");
        if (onlyDec != "")
        {
            if (onlyDec == "---" || onlyDec == "--")
                this.Encounter[i] = 0;
            else
                this.Encounter[i] = e.detail.Encounter[i];
        }
        else
        {
            var tmp = parseFloat(e.detail.Encounter[i].replace(/[,%]+/ig, "")).nanFix().toFixed(underDot);
            if (e.detail.Encounter[i].indexOf("%") > 0)
                this.Encounter[i] = parseFloat(tmp);
            else if (Math.floor(tmp) != tmp || e.detail.Encounter[i].indexOf(".") > 0)
                this.Encounter[i] = parseFloat(tmp);
            else
                this.Encounter[i] = parseInt(tmp).nanFix();
        }
    }

    for(var i in e.detail.Combatant)
    {
        this.Combatant[i] = new Person(e.detail.Combatant[i], this);
    }

    /* Refresh parent */

    for(var i in e.detail.Combatant)
    {
        this.Combatant[i].parent = this;
    }

    /* Remove Enemy */

    var tmp = {};
    for(var i in this.Combatant)
    {
        if (this.Combatant[i].Class != "")
        {
            tmp[i] = this.Combatant[i];
        }
    }

    this.Combatant = tmp;

    /* Extra Value settings */
	this.maxdamage = 0; // for old versions
	this.maxValue = 0; // please use this value
	this.zone = this.Encounter.CurrentZoneName;
	this.title = this.Encounter.title;
	this.sortvector = true;
	this.duration = this.Encounter.duration;
    this.DURATION = this.Encounter.DURATION;
	this.summonerMerge = true;
	this.sortkey = sortkey;
	this.langpack = new Language(lang);
    this.isActive = e.detail.isActive;
	this.combatKey = this.Encounter.title.concat(this.Encounter.damage).concat(this.Encounter.healed);
    this.persons = this.Combatant;

    this.resort();
}

// Rank를 다시 부여하고 Combatant의 sortkey에 따라 다시 정렬합니다.
// 이 과정에서 maxValue (최대값)을 가져옵니다.
// 소환수 값 합산/해제 시 다시 호출할 때 사용합니다.
Combatant.prototype.rerank = function(vector)
{
    this.sort(vector);
};

Combatant.prototype.indexOf = function(person)
{
	var v = -1;
	for(var i in this.Combatant)
	{
		v++;
		if ( i == person)
			return v;
	}

	return v;
};

Combatant.prototype.sort = function(vector)
{
    if (vector != undefined) 
        this.sortvector = vector;

	if (this.summonerMerge)
	{
		switch (this.sortkey)
		{
			case "damage" : this.sortkey = "mergedDamage"; break;
			case "hits" : this.sortkey = "mergedHits"; break;
			case "misses" : this.sortkey = "mergedMisses"; break;
			case "swings" : this.sortkey = "mergedSwings"; break;
			case "crithits" : this.sortkey = "mergedCrithits"; break;
			case "damagetaken" : this.sortkey = "mergedDamagetaken"; break;
			// heals
			case "heals" : this.sortkey = "mergedHeals"; break;
			case "healed" : this.sortkey = "mergedHealed"; break;
			case "critheals" : this.sortkey = "mergedCritheals"; break;
			case "healstaken" : this.sortkey = "mergedHealstaken"; break;
			case "damageShield" : this.sortkey = "mergedDamageShield"; break;
			case "overHeal" : this.sortkey = "mergedOverHeal"; break;
			case "absorbHeal" : this.sortkey = "mergedAbsorbHeal"; break;
			// lastdps
			case "Last10DPS" : this.sortkey = "mergedLast10DPS"; break;
			case "Last30DPS" : this.sortkey = "mergedLast30DPS"; break;
			case "Last60DPS" : this.sortkey = "mergedLast60DPS"; break;
			case "Last180DPS" : this.sortkey = "mergedLast180DPS"; break;
		}
	}

    for (var i in this.Combatant)
    {
        if (this.Combatant[i].isPet && this.summonerMerge) 
        {
            this.Combatant[this.Combatant[i].petOwner].merge(this.Combatant[i]);
            this.Combatant[i].visible = false;
        }
		else
		{
            this.Combatant[i].visible = true;
		}
	}

    var tmp = [];
    var r = 0;

    for (var i in this.Combatant) tmp.push({key:this.Combatant[i][this.sortkey],val:this.Combatant[i]});

    this.Combatant = {};

    if (this.sortvector)
        tmp.sort(function(a, b){return b.key - a.key});
    else
        tmp.sort(function(a, b){return a.key - b.key});

    this.maxValue = tmp[0].key;
    this.maxdamage = tmp[0].key;

    for(var i in tmp)
    {
        this.Combatant[tmp[i].val.name] = tmp[i].val;
    }

	for (var i in this.Combatant)
	{
        if (!this.Combatant[i].visible) continue;

        this.Combatant[i].rank = r++;
        this.Combatant[i].maxdamage = this.maxdamage;
    }

    this.persons = this.Combatant;
};

// combatant 객체가 사용할 Language 객체를 재선언합니다.
// void : Combatant.changeLang(string lang)
// onLanguageChange 이벤트를 발생시킵니다. 변경시 해야 할 작업을 정해주면 됩니다.
Combatant.prototype.changeLang = function(lang)
{
	this.langpack = new Language(lang);
	document.dispatchEvent(new CustomEvent('onLanguageChange', {detail:{language:lang, combatant:this}}));
};

Combatant.prototype.AttachPets = function()
{
	this.summonerMerge = true;

	for(var i in this.Combatant)
	{
		this.Combatant[i].returnOrigin();
		this.Combatant[i].recalculate();
		this.Combatant[i].parent = this;
	}
}

Combatant.prototype.DetachPets = function()
{
	this.summonerMerge = false;

	for(var i in this.Combatant)
	{
		this.Combatant[i].returnOrigin();
		this.Combatant[i].recalculate();
		this.Combatant[i].parent = this;
	}
}

// old version function
Combatant.prototype.sortkeyChange = function(key)
{
    this.resort(key, true);
};

// old version function
Combatant.prototype.sortkeyChangeDesc = function(key)
{
    this.resort(key, false);
};

// using this
Combatant.prototype.resort = function(key, vector)
{
    if (key == undefined) 
        this.sortkey = activeSort(this.sortkey);
    else
        this.sortkey = activeSort(key);

    if (vector == undefined)
        vector = this.sortvector;

    this.sort(vector);
};

// language 객체 입니다.
function Language(l)
{
	if(l == undefined) var l = "ko";
	this.lang = l;
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

// 해당하는 언어의 값을 가져옵니다.
// string : LanguageObject.get(string v)
Language.prototype.get = function(v)
{
	try
	{
		return this[this.lang][v];
	}
	catch(ex)
	{
		return v;
	}
};

var oStaticPersons = [];

function activeSort(key, merge)
{
    if (key.indexOf("merged") > -1)
    {
        if (key.indexOf("Last") > -1)
        {
            key = key.replace(/merged/ig, "");
        }
        else
        {
            key = key.replace(/merged/ig, "");
            key = key.substr(0, 1).toLowerCase() + key.substr(1);
        }
    }

    if (key == "dmgPct")
        key = "damage%";
    
    if (key.indexOf("Pct") > -1 && key.indexOf("overHealPct") == -1)
        key = key.replace(/Pct/ig, "%");

    if (key == "encdps" || key == "dps")
        key = "damage";
    
    if (key == "enchps" || key == "hps")
        key = "healed";
    
    if (key == "maxhit")
        key = "maxhitval";
    
    if (key == "maxheal")
        key = "maxhealval";

    return key;
}

function staticPerson(e)
{
	var d = new Date();
	this.createTime = d.getTime();
	this.person = e;
	this.last180ARR = [];
	this.last180Copy = [];
	this.polygonPoints = [];
}

// bool : getLog(string e)
// e : combatKey
function getLog(e)
{
	for(var i in CombatLog)
	{
		if(CombatLog[i].combatKey == e && lastCombat.encounter.title != "Encounter")
		{
			lastCombat = CombatLog[i];
			document.dispatchEvent(new CustomEvent('onSuccessGetLog', {detail:{ combatant:CombatLog[i] }}));
			return true;
		}
	}
	return false;
}

function safeAdd (x, y)
{
    var a = (x & 0xFFFF) + (y & 0xFFFF);
    var b = (x >> 16) + (y >> 16) + (a >> 16);
    return (b << 16) | (a & 0xFFFF);
}

function hexColor(str)
{
    var str = str.replace("#", "");

    if (str.length == 6 || str.length == 3)
    {
        if (str.length == 6)
            return [parseInt(str.substr(0,2), 16), parseInt(str.substr(2,2), 16), parseInt(str.substr(4,2), 16)];
        else
            return [parseInt(str.substr(0,1), 16), parseInt(str.substr(1,1), 16), parseInt(str.substr(2,1), 16)];
    }
    else
    {
        return [0, 0, 0];
    }
}

function oHexColor(str)
{
    var data = hexColor(str);
    return {r:data[0], g:data[1], b:data[2]};
}

function oHexArgb(str)
{
    if (str.length < 8) return {a:0, r:0, g:0, b:0};
    var data = oHexColor(str.replace("#", "").substr(2,6));
    var rgb = str.replace("#", "");
    return {a:parseFloat((parseInt(rgb.substr(0,2), 16)/255).toFixed(2)), r:data.r, g:data.g, b:data.b};
}

// void : saveLog(Combatant e)
function saveLog(e)
{
	var exists = false;
	for(var i in CombatLog)
	{
		if(CombatLog[i].combatKey == e.combatKey)
			exists = true;
	}

	if(!exists)
	{
		CombatLog.push(e);
		document.dispatchEvent(new CustomEvent('onSuccessSaveLog', {detail:{ combatant:e }}));
	}
}

function pFloat(num)
{
    return parseFloat(num.nanFix().toFixed(underDot));
}

function loadSetting(key)
{
	var json = "";

	try
	{	
		json = localStorage.getItem(key);
		json = JSON.parse(json);
	}
	catch(ex)
	{
		return json;
	}

	return json;
}

function saveSetting(key, val)
{
	localStorage.setItem(key, JSON.stringify(val));
}

// ver 3.2
var instance = {
	"142":{"name":"다날란","region":"다날란","duty":"아마지나배 투기대회 결승전"},
	"143":{"name":"?","region":"?","duty":"성도 커르다스 방어전"},
	"149":{"name":"?","region":"?","duty":"★ 카르테노 평원: 외곽 유적지대"},
	"150":{"name":"모르도나","region":"모르도나","duty":"묵약의 탑"},
	"151":{"name":"?","region":"?","duty":"크리스탈 타워: 어둠의 세계"},
	"157":{"name":"라노시아","region":"라노시아","duty":"사스타샤 침식 동굴"},
	"158":{"name":"라노시아","region":"라노시아","duty":"브레이플록스의 야영지"},
	"159":{"name":"라노시아","region":"라노시아","duty":"방랑자의 궁전"},
	"160":{"name":"라노시아","region":"라노시아","duty":"시리우스 대등대"},
	"161":{"name":"다날란","region":"다날란","duty":"구리종 광산"},
	"162":{"name":"다날란","region":"다날란","duty":"할라탈리 수련장"},
	"163":{"name":"다날란","region":"다날란","duty":"카른의 무너진 사원"},
	"164":{"name":"검은장막 숲","region":"검은장막 숲","duty":"탐타라 묘소"},
	"166":{"name":"검은장막 숲","region":"검은장막 숲","duty":"하우케타 별궁"},
	"167":{"name":"검은장막 숲","region":"검은장막 숲","duty":"옛 암다포르 성"},
	"168":{"name":"커르다스","region":"커르다스","duty":"돌방패 경계초소"},
	"169":{"name":"검은장막 숲","region":"검은장막 숲","duty":"토토라크 감옥"},
	"170":{"name":"다날란","region":"다날란","duty":"나무꾼의 비명"},
	"171":{"name":"커르다스","region":"커르다스","duty":"제멜 요새"},
	"172":{"name":"커르다스","region":"커르다스","duty":"금빛 골짜기"},
	"174":{"name":"?","region":"?","duty":"크리스탈 타워: 고대인의 미궁"},
	"175":{"name":"라노시아","region":"라노시아","duty":"더 폴드"},
	"184":{"name":"라노시아","region":"라노시아","duty":"더 폴드 (매칭 파티)"},
	"186":{"name":"라노시아","region":"라노시아","duty":"더 폴드 (고정 소규모 파티)"},
	"188":{"name":"라노시아","region":"라노시아","duty":"방랑자의 궁전(어려움)"},
	"189":{"name":"검은장막 숲","region":"검은장막 숲","duty":"옛 암다포르 성(어려움)"},
	"190":{"name":"?","region":"?","duty":"방황하는 사령을 쓰러뜨려라!"},
	"191":{"name":"?","region":"?","duty":"독성 요괴꽃을 제거하라!"},
	"192":{"name":"?","region":"?","duty":"무법자 집단 '나나니단'을 섬멸하라!"},
	"193":{"name":"?","region":"?","duty":"대미궁 바하무트: 진성편 1"},
	"194":{"name":"?","region":"?","duty":"대미궁 바하무트: 진성편 2"},
	"195":{"name":"?","region":"?","duty":"대미궁 바하무트: 진성편 3"},
	"196":{"name":"?","region":"?","duty":"대미궁 바하무트: 진성편 4"},
	"202":{"name":"다날란","region":"다날란","duty":"이프리트 토벌전"},
	"206":{"name":"라노시아","region":"라노시아","duty":"타이탄 토벌전"},
	"207":{"name":"검은장막 숲","region":"검은장막 숲","duty":"선왕 모그루 모그 XII세 토벌전"},
	"208":{"name":"커르다스","region":"커르다스","duty":"가루다 토벌전"},
	"214":{"name":"?","region":"?","duty":"집단전 훈련을 완수하라!"},
	"215":{"name":"?","region":"?","duty":"관문을 돌파하고 최심부의 적을 쓰러뜨려라!"},
	"216":{"name":"?","region":"?","duty":"길거북을 사로잡아라!"},
	"217":{"name":"다날란","region":"다날란","duty":"카스트룸 메리디아눔"},
	"219":{"name":"?","region":"?","duty":"폭탄광 고블린 군단을 섬멸하라!"},
	"220":{"name":"?","region":"?","duty":"몽환의 브라크시오를 쓰러뜨려라!"},
	"221":{"name":"?","region":"?","duty":"오염원 몰볼을 쓰러뜨려라!"},
	"222":{"name":"?","region":"?","duty":"갱도에 나타난 요마 부소를 쓰러뜨려라!"},
	"223":{"name":"?","region":"?","duty":"무적의 부하를 조종하는 요마를 쓰러뜨려라!"},
	"224":{"name":"다날란","region":"다날란","duty":"마도성 프라이토리움"},
	"241":{"name":"라노시아","region":"라노시아","duty":"대미궁 바하무트: 해후편 1"},
	"242":{"name":"라노시아","region":"라노시아","duty":"대미궁 바하무트: 해후편 2"},
	"243":{"name":"라노시아","region":"라노시아","duty":"대미궁 바하무트: 해후편 3"},
	"244":{"name":"라노시아","region":"라노시아","duty":"대미궁 바하무트: 해후편 4"},
	"245":{"name":"라노시아","region":"라노시아","duty":"대미궁 바하무트: 해후편 5"},
	"281":{"name":"라노시아","region":"라노시아","duty":"진 리바이어선 토벌전"},
	"292":{"name":"다날란","region":"다날란","duty":"진 이프리트 토벌전"},
	"293":{"name":"라노시아","region":"라노시아","duty":"진 타이탄 토벌전"},
	"294":{"name":"커르다스","region":"커르다스","duty":"진 가루다 토벌전"},
	"295":{"name":"다날란","region":"다날란","duty":"극 이프리트 토벌전"},
	"296":{"name":"라노시아","region":"라노시아","duty":"극 타이탄 토벌전"},
	"297":{"name":"커르다스","region":"커르다스","duty":"극 가루다 토벌전"},
	"298":{"name":"?","region":"?","duty":"봄을 거느린 '봄 여왕'을 쓰러뜨려라!"},
	"299":{"name":"?","region":"?","duty":"불길한 진형을 짜는 요마를 섬멸하라!"},
	"300":{"name":"?","region":"?","duty":"세 거인족을 제압하여 유물을 지켜내라!"},
	"332":{"name":"다날란","region":"다날란","duty":"리트아틴 강습전"},
	"336":{"name":"라노시아","region":"라노시아","duty":"더 폴드"},
	"337":{"name":"라노시아","region":"라노시아","duty":"더 폴드 (매칭 파티)"},
	"348":{"name":"다날란","region":"다날란","duty":"알테마 웨폰 파괴작전"},
	"349":{"name":"다날란","region":"다날란","duty":"구리종 광산(어려움)"},
	"350":{"name":"검은장막 숲","region":"검은장막 숲","duty":"하우케타 별궁(어려움)"},
	"352":{"name":"라노시아","region":"라노시아","duty":"더 폴드 (고정 소규모 파티)"},
	"353":{"name":"?","region":"?","duty":"이벤트용 임무: 1"},
	"354":{"name":"?","region":"?","duty":"이벤트용 임무: 2"},
	"355":{"name":"?","region":"?","duty":"대미궁 바하무트: 침공편 1"},
	"356":{"name":"?","region":"?","duty":"대미궁 바하무트: 침공편 2"},
	"357":{"name":"?","region":"?","duty":"대미궁 바하무트: 침공편 3"},
	"358":{"name":"?","region":"?","duty":"대미궁 바하무트: 침공편 4"},
	"359":{"name":"라노시아","region":"라노시아","duty":"극 리바이어선 토벌전"},
	"360":{"name":"다날란","region":"다날란","duty":"할라탈리 수련장(어려움)"},
	"361":{"name":"라노시아","region":"라노시아","duty":"난파선의 섬"},
	"362":{"name":"라노시아","region":"라노시아","duty":"브레이플록스의 야영지(어려움)"},
	"363":{"name":"검은장막 숲","region":"검은장막 숲","duty":"옛 암다포르 시가지"},
	"364":{"name":"검은장막 숲","region":"검은장막 숲","duty":"극왕 모그루 모그 XII세 토벌전"},
	"365":{"name":"커르다스","region":"커르다스","duty":"돌방패 경계초소(어려움)"},
	"366":{"name":"?","region":"?","duty":"길가메시 토벌전"},
	"367":{"name":"다날란","region":"다날란","duty":"카른의 무너진 사원(어려움)"},
	"368":{"name":"?","region":"?","duty":"도름 키마이라 토벌전"},
	"369":{"name":"?","region":"?","duty":"하이드라 토벌전"},
	"371":{"name":"커르다스","region":"커르다스","duty":"얼음외투 대빙벽"},
	"372":{"name":"?","region":"?","duty":"크리스탈 타워: 시르쿠스 탑"},
	"373":{"name":"검은장막 숲","region":"검은장막 숲","duty":"탐타라 묘소(어려움)"},
	"374":{"name":"?","region":"?","duty":"진 라무 토벌전"},
	"375":{"name":"?","region":"?","duty":"극 라무 토벌전"},
	"376":{"name":"?","region":"?","duty":"외곽 유적지대(제압전)"},
	"377":{"name":"?","region":"?","duty":"진 시바 토벌전"},
	"378":{"name":"?","region":"?","duty":"극 시바 토벌전"},
	"380":{"name":"?","region":"?","duty":"대미궁 바하무트: 침공편(영웅) 1"},
	"381":{"name":"?","region":"?","duty":"대미궁 바하무트: 침공편(영웅) 2"},
	"382":{"name":"?","region":"?","duty":"대미궁 바하무트: 침공편(영웅) 3"},
	"383":{"name":"?","region":"?","duty":"대미궁 바하무트: 침공편(영웅) 4"},
	"387":{"name":"라노시아","region":"라노시아","duty":"사스타샤 침식 동굴(어려움)"},
	"394":{"name":"?","region":"?","duty":"투신 오딘 토벌전"},
	"396":{"name":"?","region":"?","duty":"진 길가메시 토벌전"},
	"416":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"구브라 환상도서관"},
	"420":{"name":"아발라시아 구름바다","region":"아발라시아 구름바다","duty":"거두지 않는 섬"},
	"421":{"name":"커르다스","region":"커르다스","duty":"커르다스 교황청"},
	"422":{"name":"?","region":"?","duty":"외곽 유적지대(섬멸전)"},
	"426":{"name":"?","region":"?","duty":"아씨엔 나브리알레스 토벌전"},
	"430":{"name":"아발라시아 구름바다","region":"아발라시아 구름바다","duty":"무한연속 박물함"},
	"431":{"name":"?","region":"?","duty":"봉인된 바위섬(쟁탈전)"},
	"432":{"name":"?","region":"?","duty":"진 라바나 토벌전"},
	"434":{"name":"커르다스","region":"커르다스","duty":"어스름 요새"},
	"435":{"name":"드라바니아 구름바다","region":"드라바니아 구름바다","duty":"용의 둥지"},
	"436":{"name":"?","region":"?","duty":"진 비스마르크 토벌전"},
	"437":{"name":"?","region":"?","duty":"나이츠 오브 라운드 토벌전"},
	"438":{"name":"아발라시아 구름바다","region":"아발라시아 구름바다","duty":"마과학 연구소"},
	"441":{"name":"고지 드라바니아","region":"고지 드라바니아","duty":"솜 알"},
	"442":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"기공성 알렉산더: 기동편 1"},
	"443":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"기공성 알렉산더: 기동편 2"},
	"444":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"기공성 알렉산더: 기동편 3"},
	"445":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"기공성 알렉산더: 기동편 4"},
	"446":{"name":"?","region":"?","duty":"극 라바나 토벌전"},
	"447":{"name":"?","region":"?","duty":"극 비스마르크 토벌전"},
	"448":{"name":"?","region":"?","duty":"극 나이츠 오브 라운드 토벌전"},
	"449":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"기공성 알렉산더: 기동편(영웅) 1"},
	"450":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"기공성 알렉산더: 기동편(영웅) 2"},
	"451":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"기공성 알렉산더: 기동편(영웅) 3"},
	"452":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"기공성 알렉산더: 기동편(영웅) 4"},
	"508":{"name":"드라바니아 구름바다","region":"드라바니아 구름바다","duty":"보이드의 방주"},
	"509":{"name":"?","region":"?","duty":"이벤트용 임무: 3"},
	"510":{"name":"라노시아","region":"라노시아","duty":"시리우스 대등대(어려움)"},
	"511":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"성 모샨 식물원"},
	"516":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"거꾸로 선 탑"},
	"517":{"name":"?","region":"?","duty":"마신 세피로트 토벌전"},
	"518":{"name":"라노시아","region":"라노시아","duty":"더 피스트 (8 대 8 / 매칭 파티)"},
	"519":{"name":"검은장막 숲","region":"검은장막 숲","duty":"옛 암다포르 시가지(어려움)"},
	"520":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"기공성 알렉산더: 율동편 1"},
	"521":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"기공성 알렉산더: 율동편 2"},
	"522":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"기공성 알렉산더: 율동편 3"},
	"523":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"기공성 알렉산더: 율동편 4"},
	"524":{"name":"?","region":"?","duty":"극 마신 세피로트 토벌전"},
	"525":{"name":"라노시아","region":"라노시아","duty":"더 피스트 (4 대 4 / 개인)"},
	"526":{"name":"라노시아","region":"라노시아","duty":"더 피스트 (4 대 4 / 고정 소규모 파티)"},
	"527":{"name":"라노시아","region":"라노시아","duty":"더 피스트 (4 대 4 / 개인)"},
	"528":{"name":"라노시아","region":"라노시아","duty":"더 피스트 (4 대 4 / 고정 소규모 파티)"},
	"529":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"기공성 알렉산더: 율동편(영웅) 1"},
	"530":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"기공성 알렉산더: 율동편(영웅) 2"},
	"531":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"기공성 알렉산더: 율동편(영웅) 3"},
	"532":{"name":"저지 드라바니아","region":"저지 드라바니아","duty":"기공성 알렉산더: 율동편(영웅) 4"},
	"533":{"name":"?","region":"?","duty":"4개국 합동훈련"},
	"537":{"name":"라노시아","region":"라노시아","duty":"범위 공격을 피하자!"},
	"538":{"name":"라노시아","region":"라노시아","duty":"콤보를 이어 적개심을 끌자!"},
	"539":{"name":"라노시아","region":"라노시아","duty":"실전에서 콤보를 사용해보자!"},
	"540":{"name":"라노시아","region":"라노시아","duty":"다수의 적에게서 적개심을 끌자!"},
	"541":{"name":"라노시아","region":"라노시아","duty":"실전에서 다수의 적과 싸워보자!"},
	"542":{"name":"라노시아","region":"라노시아","duty":"멀리서 적개심을 끌자!"},
	"543":{"name":"라노시아","region":"라노시아","duty":"적 지원군에 대처하자!"},
	"544":{"name":"라노시아","region":"라노시아","duty":"파티원과 협력하여 적을 물리치자!"},
	"545":{"name":"라노시아","region":"라노시아","duty":"파티원과 같은 적을 공격하자!"},
	"546":{"name":"라노시아","region":"라노시아","duty":"적의 공격을 피하면서 싸우자!"},
	"547":{"name":"라노시아","region":"라노시아","duty":"적 지원군에 대처하자!"},
	"548":{"name":"라노시아","region":"라노시아","duty":"특수 장치를 활용하며 싸우자!"},
	"549":{"name":"라노시아","region":"라노시아","duty":"파티원을 회복시키자!"},
	"550":{"name":"라노시아","region":"라노시아","duty":"다수의 파티원을 회복시키자!"},
	"551":{"name":"라노시아","region":"라노시아","duty":"적의 공격을 피하면서 싸우자!"},
	"552":{"name":"라노시아","region":"라노시아","duty":"마지막 훈련!"},
	"554":{"name":"?","region":"?","duty":"the Fields of Glory (Shatter)"},
	"555":{"name":"드라바니아 구름바다","region":"드라바니아 구름바다","duty":"소르 카이"},
	"556":{"name":"?","region":"?","duty":"금기도시 마하"},
	"557":{"name":"?","region":"?","duty":"난파선의 섬 (어려움)"},
	"558":{"name":"?","region":"?","duty":"아쿠아폴리스"},
	"559":{"name":"?","region":"?","duty":"the Final Steps of Faith"},
	"560":{"name":"?","region":"?","duty":"a Bloody Reunion"},
	"566":{"name":"?","region":"?","duty":"the Minstrel's Ballad: Nidhogg's Rage"},
}

var combatLog = [];
var combatants = [];
var curhp = 100;
var delayOK = true;
var jobColors = {
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

var lastCombatRaw = null;
var lastCombat = null;
var maxhp = 100;
var myID = 0;
var myName = "";
var underDot = 2;
var sortKey = "encdps";
