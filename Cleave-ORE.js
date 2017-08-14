var combatLog = [];
var combatants = [];
var curhp = 100;
var curzone = 0;

var lastCombatRaw = null;
var lastCombat = null;
var webs = null;

var maxhp = 100;
var myID = 0;
var underDot = 2;

var myName = "";
var sortKey = "encdps";

var delayOK = !0;
var diffcolor = !1;

var Debug = new dbg(false);

var jobColors = {
    "PLD": [200, 255, 255],
    "WAR": [200, 40, 30],
    "DRK": [130, 40, 50],
    "MNK": [180, 140, 20],
    "DRG": [50, 90, 240],
    "NIN": [80, 70, 90],
    "BRD": [180, 200, 80],
    "MCH": [130, 255, 240],
    "SMN": [40, 150, 0],
    "BLM": [100, 70, 150],
    "WHM": [200, 195, 170],
    "SCH": [60, 60, 160],
    "AST": [200, 130, 90],
    "LMB": [255, 204, 0]
};

var jobs = {
    "ADV":{"code":  0},
    "GLA":{"code":  1},
    "GLD":{"code":  1},
    "PGL":{"code":  2},
    "MRD":{"code":  3},
    "LNC":{"code":  4},
    "ARC":{"code":  5},
    "CNJ":{"code":  6},
    "THM":{"code":  7},
    /* CRAFTER */
    "CRP":{"code":  8},
    "BSM":{"code":  9},
    "ARM":{"code": 10},
    "GSM":{"code": 11},
    "LTW":{"code": 12},
    "WVR":{"code": 13},
    "ALC":{"code": 14},
    "CUL":{"code": 15},
    /* GATHERER */
    "MIN":{"code": 16},
    "BTN":{"code": 17},
    "FSH":{"code": 18},
    /* JOBS */
    "PLD":{"code": 19},
    "MNK":{"code": 20},
    "WAR":{"code": 21},
    "DRG":{"code": 22},
    "BRD":{"code": 23},
    "WHM":{"code": 24},
    "BLM":{"code": 25},
    /* ARR CLASS */
    "ACN":{"code": 26},
    /* ARR JOBS */
    "SMN":{"code": 27},
    "PLD":{"code": 28},
    /* WA! SHIVA! T13! NINJA-DA! */
    "ROG":{"code": 29},
    "NIN":{"code": 30},
    /* HW JOBS */
    "MCH":{"code": 31},
    "DRK":{"code": 32},
    "AST":{"code": 33},
    /* SB JOBS */
    "SAM":{"code": 34},
    "RDM":{"code": 35},
};

var icons = {
    "class":{
        "GLD":"062301",
        "GLA":"062301",
        "MRD":"062302",
        "PUG":"062303",
        "LNC":"062304",
        "ARC":"062305",
        "CNJ":"062306",
        "THM":"062307",
        "ACN":"062308",
        "ROG":"062309",
        "CRP":"062310",
        "BSM":"062311",
        "ARM":"062312",
        "GSM":"062313",
        "LTW":"062314",
        "WVR":"062315",
        "ALC":"062316",
        "CUL":"062317",
        "MIN":"062318",
        "BTN":"062319",
        "FSH":"062320"
    },
    "job":{
        "PLD":"062401",
        "MNK":"062402",
        "WAR":"062403",
        "DRG":"062404",
        "BRD":"062405",
        "WHM":"062406",
        "BLM":"062407",
        "SMN":"062408",
        "SCH":"062409",
        "NIN":"062400",
        "MCH":"062411",
        "DRK":"062412",
        "AST":"062413",
        "SAM":"062414",
        "RDM":"062415"
    },
    "crafter":{
        "CRP":"062502",
        "BSM":"062503",
        "ARM":"062504",
        "GSM":"062505",
        "LTW":"062506",
        "WVR":"062507",
        "ALC":"062508",
        "CUL":"062509"
    },
    "getherer":{
        "MIN":"062510",
        "BTN":"062511",
        "FSH":"062512"
    }
};

var advclass = [ "GLD", "GLA", "MRD", "PUG", "LNC", "ROG", "ARC", "THM", "ACN", "CNJ" ];
var advjob = [ "PLD", "PLD", "WAR", "MNK", "DRG", "NIN", "BRD", "BLM", "SMN", "WHM", "SCH", "MCH", "DRK", "AST", "SAM", "RDM" ];

var tanker = [ "PLD", "WAR", "DRK" ];
var healer = [ "WHM", "SCH", "AST" ];

var specialist = {
    "SMN":[ "에기", "카벙클", "EGI", "CARBUNCLE", "エギ", "カーバンクル" ],
    "SCH":[ "요정", "EOS", "SELENE", "フェアリー" ],
    "MCH":[ "포탑", "AUTOTURRET", "オートタレット" ],
    "LMB":[ "LIMIT BREAK", "リミット" ]
};

var chocoboskill = [ "초코 강타", "초코 방어", "초코 발차기", "초코 내려찍기", "초코 돌풍", "초코 돌격", "초코 쪼기", "초코 때리기", "초코 메디카", "초코 쇄도", "초코 케알", "초코 리제네", "チョコストライク", "チョコガード", "チョコキック", "チョコドロップ", "チョコブラスト", "チョコラッシュ", "チョコビーク", "チョコスラッシュ", "チョコメディカ", "チョコサージ", "チョコケアル", "チョコリジェネ", "Choco-frappe", "Choco-garde", "Choco-serres", "Choco-saut", "Choco-explosion", "Choco-ruée", "Choco-bec", "Choco-taillade", "Choco-médica", "Choco-ardeur", "Choco-soin", "Choco-récup", "Chocobo-Schlag", "Chocobo-Block", "Chocobo-Tritt", "Chocobo-Faller", "Chocobo-Knall", "Chocobo-Rausch", "Chocobo-Schnabel", "Chocobo-Hieb", "Chocobo-Reseda", "Chocobo-Quelle", "Chocobo-Vita", "Chocobo-Regena", "Choco Strike", "Choco Guard", "Choco Kick", "Choco Drop", "Choco Blast", "Choco Rush", "Choco Beak", "Choco Slash", "Choco Medica", "Choco Surge", "Choco Cure", "Choco Regen" ];

var QueryString = function() 
{
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) 
    {
        var pair = vars[i].split("=");
        if (typeof query_string[pair[0]] === "undefined") 
        {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
        } 
        else if (typeof query_string[pair[0]] === "string") 
        {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
        } 
        else 
        {
            query_string[pair[0]].push(decodeURIComponent(pair[1]))
        }
    }

    return query_string;
}();

var host_port = QueryString.HOST_PORT;

if(typeof(host_port) === "undefined")
{
    /* FOR LOCAL TEST */
    if (document.location.href.indexOf("file")>-1)
    {
        wsUri = "ws://127.0.0.1:10501/MiniParse";
    }
}
else
{
    while (host_port.endsWith('/')) 
    {
        host_port = host_port.substring(0, host_port.length - 1);
    }

    if (wsUri.indexOf("//") == 0) 
    {
        wsUri = wsUri.substring(2);
    }

    if (wsUri.indexOf("ws://") == 0 || wsUri.indexOf("wss://") == 0) 
    {
        if (host_port.indexOf("ws://") == 0 || host_port.indexOf("wss://") == 0)
            wsUri = wsUri.replace(/(ws|wss):\/\/@HOST_PORT@/im, host_port);
        else
            wsUri = wsUri.replace(/@HOST_PORT@/im, host_port);
    } 
    else 
    {
        if (host_port.indexOf("ws://") == 0 || host_port.indexOf("wss://") == 0)
            wsUri = wsUri.replace(/@HOST_PORT@/im, host_port);
        else
            wsUri = "ws://" + wsUri.replace(/@HOST_PORT@/im, host_port);
    }
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
	if(this.indexOf(a) > -1) return !0;
	else return !1;
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
		document.removeEventListener("DOMContentLoaded", arguments.callee, !1);
		domReady();
	}, !1);

    /* ACTWebSocket 적용 */
    window.onbeforeunload = function() 
    {
        webs.close();
    };
    
    window.addEventListener("unload", function() 
    {
        webs.close();
    }, !1);
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

function dbg(v)
{
	this.debug = v;

	this.log = function(object)
	{
		if (this.debug)
			console.log(object);
	}
};

function domReady() 
{
    /* ACTWebSocket 적용 */
	try
	{
		webs = new WebSocketImpl(wsUri);
		webs.connect();
	}
	catch(ex)
	{

	}

	// Logline
	try { document.addEventListener('beforeLogLineRead', beforeLogLineRead); } catch (ex) { }
	try { document.addEventListener('onLogLineRead', onLogLineRead); } catch (ex) { }

	// On
	try { document.addEventListener('onOverlayDataUpdate', onOverlayDataUpdate); } catch (ex) { console.log("Core Error : onOverlayUpdate is not defined."); }
	try { document.addEventListener('onOverlayStateUpdate', onOverlayStateUpdate); } catch (ex) { }

    // ReadyEvent
    try { onDocumentLoad(); } catch(ex) { }
}

class ActWebsocketInterface
{
    constructor(uri, path = "MiniParse")
    {
        var querySet = this.getQuerySet();
        this.uri = uri;
        this.id = null;
        this.activate = !1;
        var This = this;
        document.addEventListener('onBroadcastMessage', function(evt)
        {
            This.onBroadcastMessage(evt)
        });
        document.addEventListener('onRecvMessage', function(evt) {
            This.onRecvMessage(evt)
        });
        window.addEventListener('message', function(e)
        {
            if (e.data.type === 'onBroadcastMessage')
            {
                This.onBroadcastMessage(e.data)
            }
            if (e.data.type === 'onRecvMessage')
            {
                This.onRecvMessage(e.data)
            }
        })
    }
    connect()
    {
        if (typeof this.websocket != "undefined" && this.websocket != null)
            this.close();
        this.activate = !0;
        var This = this;
        this.websocket = new WebSocket(this.uri);
        this.websocket.onopen = function(evt)
        {
            This.onopen(evt);
        };
        this.websocket.onmessage = function(evt)
        {
            This.onmessage(evt);
        };
        this.websocket.onclose = function(evt)
        {
            This.onclose(evt);
        };
        this.websocket.onerror = function(evt)
        {
            This.onerror(evt);
        }
    }
    close() {
        this.activate = !1;
        if (this.websocket != null && typeof this.websocket != "undefined")
        {
            this.websocket.close();
        }
    }
    onopen(evt) {
        if (this.id != null && typeof this.id != "undefined")
        {
            this.set_id(this.id);
        }
        else
        {
            if (typeof overlayWindowId != "undefined")
            {
                this.set_id(overlayWindowId);
            }
            else
            {
                var r = new RegExp('[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}');
                var id = r.exec(navigator.userAgent);
                if (id != null && id.length == 1)
                {
                    this.set_id(id[0]);
                }
            }
        }
    }
    onclose(evt)
    {
        this.websocket = null;
        if (this.activate)
        {
            var This = this;
            setTimeout(function()
            {
                This.connect()
            }, 5000);
        }
    }
    onmessage(evt)
    {
        if (evt.data == ".")
        {
            this.websocket.send(".");
        }
        else
        {
            try
            {
                var obj = JSON.parse(evt.data);
                var type = obj.type;
                if (type == "broadcast")
                {
                    var from = obj.from;
                    var type = obj.msgtype;
                    var msg = obj.msg;
                    document.dispatchEvent(new CustomEvent('onBroadcastMessage',
                    {
                        detail: obj
                    }));
                }
                if (type == "send")
                {
                    var from = obj.from;
                    var type = obj.msgtype;
                    var msg = obj.msg;
                    document.dispatchEvent(new CustomEvent('onRecvMessage',
                    {
                        detail: obj
                    }));
                }
                if (type == "set_id") {}
            } catch (e) {}
        }
    }
    onerror(evt)
    {
        this.websocket.close();
        console.log(evt);
    }
    getQuerySet()
    {
        var querySet = {};
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++)
        {
            try
            {
                var pair = vars[i].split('=');
                querieSet[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
            catch (e) {}
        }
        return querySet;
    }
    broadcast(type, msg)
    {
        if (typeof overlayWindowId != 'undefined' && this.id != overlayWindowId)
        {
            this.set_id(overlayWindowId);
        }
        var obj = {};
        obj.type = "broadcast";
        obj.msgtype = type;
        obj.msg = msg;
        this.websocket.send(JSON.stringify(obj));
    }
    send(to, type, msg)
    {
        if (typeof overlayWindowId != 'undefined' && this.id != overlayWindowId)
        {
            this.set_id(overlayWindowId);
        }
        var obj = {};
        obj.type = "send";
        obj.to = to;
        obj.msgtype = type;
        obj.msg = msg;
        this.websocket.send(JSON.stringify(obj));
    }
    overlayAPI(type, msg)
    {
        var obj = {};
        if (typeof overlayWindowId != 'undefined' && this.id != overlayWindowId)
        {
            this.set_id(overlayWindowId)
        }
        obj.type = "overlayAPI";
        obj.to = overlayWindowId;
        obj.msgtype = type;
        obj.msg = msg;
        this.websocket.send(JSON.stringify(obj));
    }
    set_id(id)
    {
        var obj = {};
        obj.type = "set_id";
        obj.id = id;
        this.id = overlayWindowId;
        this.websocket.send(JSON.stringify(obj));
    }
    onRecvMessage(e) {}
    onBroadcastMessage(e) {}
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

function onRecvMessage(e)
{
    if (e.detail.msgtype == "Chat")
    {
        document.dispatchEvent(new CustomEvent("onChatting",
        {
            detail: e.detail.msg
        }));
    } 
    else
    {
        console.log(e.detail.msgtype + ":" + e.detail.msg);
    }
}

/* MESSAGE */
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
                document.dispatchEvent(new CustomEvent("onChatting",
                {
                    detail: e.detail.msg
                }));
                break;
            case "ChangeZone":
                //console.log(e.detail.msg);
                curzone = e.detail.msg.zoneID;
                break;
            default:
                console.log(e.detail.msgtype + ":" + e.detail.msg);
                break;
        }
    }
}

function Person(e, p)
{
    if(e == undefined) return;
    /* REWORK TAKEN VALUES */
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

    /* VARIABLES */
    this.parent = p;
    this.Class = "Unknown";
    this.PetType = "Unknown";
    this.role = "DPS";
    this.isPet = !1;
	this.isLower = !1;
    this.visible = !0;
    this.rank = 0;
    this.maxdamage = 0;
    this.color = {A:127, R:0, G:0, B:0}; // (Unknown color)
    this.displayName = this.name;
    this.displayNameWithInitial = {
        "original":this.name, 
        "firstinit":this.name, 
        "lastinit":this.name, 
        "fullinit":this.name
    };
    this.original = {
        Damage: this.damage,
        Hits: this.hits,
        Misses: this.misses,
        Swings: this.swings,
        Crithits: this.crithits,
        DirectHitCount: this.DirectHitCount,
        CritDirectHitCount: this.CritDirectHitCount,
        Damagetaken: this.damagetaken,
        Heals: this.heals,
        Healed: this.healed,
        Critheals: this.critheals,
        Healstaken: this.healstaken,
        DamageShield: this.damageShield,
        OverHeal: this.overHeal,
        AbsorbHeal: this.absorbHeal,
        Last10DPS: this.Last10DPS,
        Last30DPS: this.Last30DPS,
        Last60DPS: this.Last60DPS,
        Last180DPS: this.Last180DPS
    };

    /* FIX MAXHIT */
    try
    {
        this.maxhitstr = this.maxhit.substring(0, this.maxhit.indexOf("-"));
        this.maxhitval = parseInt(this.maxhit.substring(this.maxhit.indexOf("-") + 1).replace(/[,.]/, "")).nanFix();
    }
    catch (ex)
    {
        this.maxhit = "?-0";
        this.maxhitstr = "";
        this.maxhitval = 0;
    }

    /* FIX MAXHEAL */
    try
    {
        this.maxhealstr = this.maxheal.substring(0, this.maxheal.indexOf("-"));
        this.maxhealval = parseInt(this.maxheal.substring(this.maxheal.indexOf("-") + 1).replace(/[,.]/, "")).nanFix();
    }
    catch (ex)
    {
        this.maxheal = "?-0";
        this.maxhealstr = "";
        this.maxhealval = 0;
    }

    /* IF NAME HAVE SPACE, TO MAKE INITIAL NAME */
    if(this.name.indexOf(" ") > -1)
    {
        try
        {
            var d = this.name.split(" ");
            this.displayNameWithInitial.firstinit = d[0].substring(0, 1)+". "+d[1];
            this.displayNameWithInitial.lastinit = d[0]+" "+d[1].substring(0, 1)+".";
            this.displayNameWithInitial.fullinit = d[0].substring(0, 1)+". "+d[1].substring(0, 1)+".";
        }
        catch (ex)
        {

        }
    }

    /* FIX INFINITY */
    if (this.DURATION <= 0)
    {
        this.dps = parseFloat((this.damage / this.parent.DURATION).nanFix().toFixed(underDot));
        this.hps = parseFloat((this.healed / this.parent.DURATION).nanFix().toFixed(underDot));

        this.DPS = Math.floor(this.dps);
        this.HPS = Math.floor(this.hps);

        this["DPS-k"] = Math.floor(this.dps / 1000);
        this["HPS-k"] = Math.floor(this.hps / 1000);

        for(var i in this)
        {
            if (this[i] == "∞" || this[i] == "infinity")
                this[i] = 0;
        }
    }

    /* GIVE CLASS UPPER JOB AND CHECK PET TYPE */
    if(this.Job != "" && this.Job != null && this.Job != undefined)
    {
        this.Class = this.Job.toUpperCase();

        if(advclass.indexOf(this.Class) > -1)
        {
            this.Class = advjob[advclass.indexOf(this.Class)];
            this.isLower = !0;
        }

        if(tanker.indexOf(this.Class) > -1)
            this.role = "Tanker";
        else if(healer.indexOf(this.Class) > -1)
            this.role = "Healer";
    }
    
    
    if(this.Job == "")
    {
        for(var i in specialist)
        {
            for(var j in specialist[i])
            {
                if(this.name.toUpperCase().indexOf(specialist[i][j]) > -1)
                {
                    this.Class = i;
                    
                    if(i == "SMN")
                        this.petType = "Egi";
                    else if(i == "SCH")
                        this.petType = "Fairy";
                    else if(i == "MCH")
                        this.petType = "AutoTurret";

                    if(i != "LMB")
                    {
                        this.isPet = !0;
                        this.Job = "AVA";
                    }
                    else
                    {
                        this.Job = i;
                    }
                }
            }
        }
    }

    if (this.petOwner != "" && this.Class == "")
    {
        this.isPet = !1;
        this.Job = "CBO";
        this.Class = "CBO";
        this.petType = "Chocobo_Persons";
    }

    /* IF USING CHOCOBO SKILL, THIS PERSON IS CHOCOBO */
    if(chocoboskill.indexOf(this.maxhitstr) > -1 || chocoboskill.indexOf(this.maxhealstr) > -1)
    {
        this.isPet = !1;
        this.petType = "Chocobo_Persons";
        this.Class = "CBO";
        this.Job = "CBO";
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

	this.color = {
		R:this.getColor().R,
		G:this.getColor().G,
		B:this.getColor().B
	}

	if(this.petType != "Unknown" && this.petType != "Chocobo_Persons")
	{
		this.color.R+= parseInt(this.color.R/3);
		this.color.G+= parseInt(this.color.G/3);
		this.color.B+= parseInt(this.color.B/3);
	}
    
    if (this.isPet && this.Class != "" && this.parent.users[this.petOwner] == undefined) 
    {
        this.petOwner = "YOU";
    }

    for (var i in this.original) 
    {
        if (i.indexOf("Last") > -1)
            this["merged" + i] = this[i];
        else if (i == "CritDirectHitCount" || i == "DirectHitCount")
            this["merged" + i] = this[i];
        else 
            this["merged" + i] = this[i.substr(0, 1).toLowerCase() + i.substr(1)];
    }

    this.pets = {};
}

/* REGEON OF PERSON PROTOTYPE FUNCTIONS */
Person.prototype.returnOrigin = function()
{
    for(var i in this.original)
    {
        if (i.indexOf("Last") > -1)
            this["merged"+i] = this[i];
        else if (i == "CritDirectHitCount" || i == "DirectHitCount")
            this["merged"+i] = this[i];
        else
            this["merged"+i] = this[i.substr(0,1).toLowerCase()+i.substr(1)];
    }
};

Person.prototype.merge = function(person)
{
	this.returnOrigin();
    if(person.petType != "Chocobo_Persons")
    {
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

    this["DirectHit%"] = pFloat(this.mergedDirectHitCount / this.hits * 100);
    this["CritDirectHit%"] = pFloat(this.mergedCritDirectHitCount / this.hits * 100);

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
            case "damage":
                key = "mergedDamage";
                break;
            case "hits":
                key = "mergedHits";
                break;
            case "misses":
                key = "mergedMisses";
                break;
            case "swings":
                key = "mergedSwings";
                break;
            case "crithits":
                key = "mergedCrithits";
                break;
            case "DirectHitCount":
                key = "mergedDirectHitCount";
                break;
            case "CritDirectHitCount":
                key = "mergedCritDirectHitCount";
                break;
            case "damagetaken":
                key = "mergedDamagetaken";
                break;
            case "heals":
                key = "mergedHeals";
                break;
            case "healed":
                key = "mergedHealed";
                break;
            case "critheals":
                key = "mergedCritheals";
                break;
            case "healstaken":
                key = "mergedHealstaken";
                break;
            case "damageShield":
                key = "mergedDamageShield";
                break;
            case "overHeal":
                key = "mergedOverHeal";
                break;
            case "absorbHeal":
                key = "mergedAbsorbHeal";
                break;
            case "Last10DPS":
                key = "mergedLast10DPS";
                break;
            case "Last30DPS":
                key = "mergedLast30DPS";
                break;
            case "Last60DPS":
                key = "mergedLast60DPS";
                break;
            case "Last180DPS":
                key = "mergedLast180DPS";
                break;
        }
    }

    return this[key];
}

function Combatant(e, sortkey)
{
    if (sortkey == undefined) var sortkey = "encdps";
    if (lang == undefined) var lang = "ko";
    if (e == undefined) return;

    this.Encounter = {};
    this.Combatant = {};
    this.users = {};
    this.raw = {"detail":e.detail};

    for (var i in e.detail.Combatant)
    {
        this.users[i] = !0;
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
	this.sortvector = !0;
	this.duration = this.Encounter.duration;
    this.DURATION = this.Encounter.DURATION;
	this.summonerMerge = !0;
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
            case "damage":
                this.sortkey = "mergedDamage";
                break;
            case "hits":
                this.sortkey = "mergedHits";
                break;
            case "misses":
                this.sortkey = "mergedMisses";
                break;
            case "swings":
                this.sortkey = "mergedSwings";
                break;
            case "crithits":
                this.sortkey = "mergedCrithits";
                break;
            case "DirectHitCount":
                this.sortkey = "mergedDirectHitCount";
                break;
            case "CritDirectHitCount":
                this.sortkey = "mergedCritDirectHitCount";
                break;
            case "damagetaken":
                this.sortkey = "mergedDamagetaken";
                break;
            case "heals":
                this.sortkey = "mergedHeals";
                break;
            case "healed":
                this.sortkey = "mergedHealed";
                break;
            case "critheals":
                this.sortkey = "mergedCritheals";
                break;
            case "healstaken":
                this.sortkey = "mergedHealstaken";
                break;
            case "damageShield":
                this.sortkey = "mergedDamageShield";
                break;
            case "overHeal":
                this.sortkey = "mergedOverHeal";
                break;
            case "absorbHeal":
                this.sortkey = "mergedAbsorbHeal";
                break;
            case "Last10DPS":
                this.sortkey = "mergedLast10DPS";
                break;
            case "Last30DPS":
                this.sortkey = "mergedLast30DPS";
                break;
            case "Last60DPS":
                this.sortkey = "mergedLast60DPS";
                break;
            case "Last180DPS":
                this.sortkey = "mergedLast180DPS";
                break;
        }
    }

    for (var i in this.Combatant) 
    {
        if (this.Combatant[i].isPet && this.summonerMerge) 
        {
            this.Combatant[this.Combatant[i].petOwner].merge(this.Combatant[i]);
            this.Combatant[i].visible = !1;
        } 
        else 
        {
            this.Combatant[i].visible = !0;
        }
    }

    var tmp = new Array();
    var r = 0;
    for (var i in this.Combatant) tmp.push({ key: this.Combatant[i][this.sortkey], val: this.Combatant[i] });

    this.Combatant = {};

    if (this.sortvector) 
        tmp.sort(function(a, b) { return b.key - a.key });
    else 
        tmp.sort(function(a, b) { return a.key - b.key });

    this.maxValue = tmp[0].key;
    this.maxdamage = tmp[0].key;

    for (var i in tmp) 
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

Combatant.prototype.AttachPets = function()
{
	this.summonerMerge = !0;

	for(var i in this.Combatant)
	{
		this.Combatant[i].returnOrigin();
		this.Combatant[i].recalculate();
		this.Combatant[i].parent = this;
	}
}

Combatant.prototype.DetachPets = function()
{
	this.summonerMerge = !1;

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
    this.resort(key, !0);
};

// old version function
Combatant.prototype.sortkeyChangeDesc = function(key)
{
    this.resort(key, !1);
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
			return !1;
		}
	}
	return !0;
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
	var exists = !0;
	for(var i in CombatLog)
	{
		if(CombatLog[i].combatKey == e.combatKey)
			exists = !1;
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
