if (wsUri != undefined && wsUri.indexOf("@HOST_PORT@") > -1)
{
    var reg = /^ws:\/\/@HOST_PORT@\/(.+)$/im;
    var match = wsUri.match(reg);
    wsUri = "ws://127.0.0.1:10501/"+match[1];
}

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
    webs = new WebSocketImpl(wsUri);
    webs.connect();

    document.addEventListener('onBroadcastMessage', onBroadcastMessage);
    document.addEventListener('onRecvMessage', onRecvMessage);

	// Logline
	try { document.addEventListener('beforeLogLineRead', beforeLogLineRead); } catch (ex) { }
	try { document.addEventListener('onLogLineRead', onLogLineRead); } catch (ex) { }

	// On
	try { document.addEventListener('onOverlayDataUpdate', onOverlayDataUpdate); } catch (ex) { console.log("Core Error : onOverlayUpdate is not defined."); }
	try { document.addEventListener('onOverlayStateUpdate', onOverlayStateUpdate); } catch (ex) { }

    // ReadyEvent
    try { onDocumentLoad(); } catch(ex) { }
}

// ACTWebSocket 적용
class WebSocketImpl extends ActWebsocketInterface
{
  constructor(uri, path = "MiniParse") {
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

var webs = null;

function onRecvMessage(e)
{

}

function onBroadcastMessage(e)
{
    if(e.detail.msgtype == "CombatData")
    {
        document.dispatchEvent(new CustomEvent('onOverlayDataUpdate', { detail: e.detail.msg }));
    }
    else
    {
        switch(e.detail.msgtype)
        {
            case "SendCharName":
                myID = e.detail.msg.charID;
                myName = e.detail.msg.charName;
                $("#myname").html(myName);
                if (combatants[myID] !== undefined && combatants[myID] !== null)
                {
                    var max = combatants[myID].max_hp;
                    myhpconvert(max, max);
                }
                break;
            case "AddCombatant":
                combatants[e.detail.msg.id] = e.detail.msg;
                if (e.detail.msg.id == myID)
                {
                    var max = combatants[e.detail.msg.id].max_hp;
                    myhpconvert(max, max);
                }
                break;
            case "RemoveCombatant":
                combatants[e.detail.msg.id] = null;
                break;
            case "AbilityUse":
                if (e.detail.msg.id == myID)
                {
                    var max = e.detail.msg.max_hp;
                    var cur = e.detail.msg.cur_hp;
                    myhpconvert(cur, max);
                }
                break;
        }
    }
}
// ACTWebSocket 적용 끝

function onOverlayDataUpdate(e)
{
    if (lastCombat != undefined)
        if (e.detail.Encounter.DPS == lastCombat.Encounter.DPS) return;
    lastCombat = new Combatant(e);
}

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
                this[i] = (tmp / 100);
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

    // Give Job
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

    this.recalculate();
};

Person.prototype.merge = function(person)
{
    for(var i in this.original)
    {
        if (i.indexOf("Last") > -1)
            this["merged"+i] = this[i] + person.original[i];
        else
            this["merged"+i] = this[i.substr(0,1).toLowerCase()+i.substr(1)] + person.original[i];
    }

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

    this.dps = pFloat(this.damage / dur);
    this.encdps = pFloat(this.damage / this.parent.DURATION);
    this.hps = pFloat(this.healed / dur);
    this.enchps = pFloat(this.healed / this.parent.DURATION);

    this["DAMAGE-k"] = Math.floor(this.damage / 1000);
    this["DAMAGE-m"] = Math.floor(this.damage / 1000000);

    this.DPS = Math.floor(this.dps);
    this["DPS-k"] = Math.floor(this.dps / 1000);
    this.ENCDPS = Math.floor(this.encdps);
    this.ENCHPS = Math.floor(this.enchps);
    this["ENCDPS-k"] = Math.floor(this.encdps / 1000);
    this["ENCHPS-k"] = Math.floor(this.enchps / 1000);

    this["damage%"] = pFloat(this.damage / this.parent.Encounter.damage);
    this["healed%"] = pFloat(this.healed / this.parent.Encounter.healed);

    this["crithit%"] = pFloat(this.crithits / this.hits);
    this["critheal%"] = pFloat(this.critheals / this.heals);

    this.tohit = pFloat(this.hits / this.swings);
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

function Combatant(e, sortkey)
{
    if (sortkey == undefined) var sortkey = "enchps";
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
                this.Encounter[i] = (tmp / 100);
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

    this.sort();
    console.log(this);
}

// Rank를 다시 부여하고 Combatant의 sortkey에 따라 다시 정렬합니다.
// 이 과정에서 maxValue (최대값)을 가져옵니다.
// 소환수 값 합산/해제 시 다시 호출할 때 사용합니다.
Combatant.prototype.rerank = function(vector)
{
    this.sort(vector);
};

Combatant.prototype.sort = function(vector)
{
    if (vector != undefined) 
        this.sortvector = vector;

    var tmp = [];
    var r = 0;

    for (var i in this.Combatant) tmp.push({key:this.Combatant[i][this.sortkey],val:this.Combatant[i]});

    this.Combatant = {};

    if (this.sortvector)
        tmp.sort(function(a, b){return b.key - a.key});
    else
        tmp.sort(function(a, b){return a.key - b.key});

    this.maxValue = this.maxdamage = tmp[0].key;

    for(var i in tmp)
    {
        this.Combatant[tmp[i].val.name] = tmp[i].val;
    }

    for (var i in this.Combatant)
    {
        this.Combatant[i].returnOrigin();
        if (this.Combatant[i].isPet && this.summonerMerge) 
        {
            this.Combatant[this.Combatant[i].petOwner].merge(this.Combatant[i]);
            this.Combatant[i].visible = false;
            continue;
        }
        this.Combatant[i].rank = r++;
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
    this.sortkey = activeSort(key);
    this.sort(vector);
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
    return parseFloat(num.toFixed(underDot));
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

var lastCombat = null;
var maxhp = 100;
var myID = 0;
var myName = "";
var underDot = 2;
var sortKey = "encdps";