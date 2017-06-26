
var chat_messages = []
var user_list = []
var id_to_token = {}

for (var user in chat) {
    user_list.push(user);
    for (var i in chat[user])
        chat_messages.push(chat[user][i]);
}
user_list.sort(function(l, r) { return chat[r].length - chat[l].length });
chat_messages.sort(function(l, r) { return l[0] - r[0]; });

for (var i in chat_tokens) {
    id_to_token[chat_tokens[i][0]] = chat_tokens[i];
}

// location.-hash pseudo-navigation

$(window).on("hashchange", function() {
    applyNavParams();
});

var oldparams = {
    user: -1,
    msgid: -1,
    token: -1,
};
function applyNavParams() {
    let params = getNavParams();
    if (params.user != oldparams.user || params.token != oldparams.token)
        showFilteredMessages();
    if (params.user != oldparams.user) {
        if (params.user)
            showTokensByUser(params.user);
        else
            showTokens(chat_tokens);
    }
    if (params.msgid) {
        scrollToMessage(params.msgid);
    }
    oldparams = params;
}

function getNavParams() {
    if (!window.location.hash)
        return {};
    var hash = window.location.hash.substring(1).split("&");
    var params = {};
    for (let i in hash) {
        let pair = hash[i].split("=");
        if (pair && pair[0])
            params[pair[0]] = pair[1];
    }
    return params;
}

function setNavParams(params) {
    var str="";
    if (params) {
        str += "#";
        for (let i in params) {
            str += i+"="+params[i]+"&";
        }
    }
    window.location.hash = str;
}

function setTokenFilter(id) {
    var params = getNavParams();
    if (params.token) {
        if (!id)
            delete params.token;
    }
    if (id)
        params.token = id;
    setNavParams(params);
}

function scrollToMessage(id) {
    let $elem = $('.chat-message[data-msg-id="'+id+'"]');
    if ($elem)
        window.scrollTo({top: findElementPos($elem[0])});
}

function findElementPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    return curtop;
}

function hookUserClick() {
    $(".user-click").on("click", function(e) {
        var user = $(e.target).attr("data-user");
        if (user) {
            var params = {user: user};
            var msg_id = $(e.target).attr("data-msg-id");
            if (msg_id)
                params["msgid"] = msg_id;
            setNavParams(params);
        }
    });
}

function createUserList() {
    var $dom = $("#user-list");
    for (var i in user_list) {
        let user = user_list[i];
        $dom.append('<nobr><div class="user-entry user-click" data-user="'+user+'">' + user
                  + ' / ' + chat[user].length
                  //+ (user in chat_tokens_by_user ? (' / ' + chat_tokens_by_user[user].length) : '')
                  + '</div></nobr>'
                   );
    }
    hookUserClick();
}

function messageDiv(msg) {
    if (typeof(msg) == "string")
        return '<div class="chat-separator">' + msg + '</div>';
    var html
         = //'<a name="msg-'+msg[0]+'">'
           '<div class="chat-message" data-msg-id="'+msg[0]+'">'
         + '<span class="chat-user user-click" data-user="'+msg[2]+'" data-msg-id="'+msg[0]+'">' + msg[2] + '</span> '
         + '<span class="chat-date">' + (new Date(msg[1]*1000)).toISOString() + "</span> "
         + '<div class="chat-text">' + msg[3] + '</div>'
         + '</div>';
    if (msg.length > 5)
        html = '<div class="highlight">'+html+'</div>';
    return html;
}


function showMessages(messages, title) {
    var $dom = $("#chat-list");
    $dom.html('<h5>'+(title ? title : "messages")+'</h5>');
    for (var i in messages) {
        let msg = messages[i];
        $dom.append(messageDiv(msg));
    }
    hookUserClick();
}

function filterMessagesByUser(messin, user) {
    if (!user)
        return messin;
    var messout = [];
    for (let i in messin) {
        if (messin[i][2] == user)
            messout.push(messin[i]);
    }
    return messout;
}

function filterMessagesByTokenId(messin, id) {
    if (!id)
        return messin;
    id = parseInt(id);
    var messout = [];
    for (let i in messin) {
        if (messin[i][4].includes(id))
            messout.push(messin[i]);
    }
    return messout;
}

function showFilteredMessages() {
    let params = getNavParams();
    if (!params.user && !params.token) {
        showMessages(["..."]);
        return;
    }
    var messages = filterMessagesByUser(chat_messages, params.user);
    messages = filterMessagesByTokenId(messages, params.token);
    let orig_length = messages.length;

    // add some context before and after
    let ctxrad = params.token ? 1 : 3;
    var filtmessages = {};
    for (var i in messages) {
        var id = messages[i][0];
        for (var j=Math.max(0, id-ctxrad); j<Math.min(chat_messages.length, id+ctxrad+1); ++j) {
            j = parseInt(j);
            if (!(j in filtmessages)) {
                let msg = chat_messages[j];
                filtmessages[j] = [msg[0], msg[1], msg[2], msg[3], msg[4]];
            }
            if (j == id)
                filtmessages[j].push("highlight");
        }
    }
    var messages = [];
    var last_id = 0;
    for (var i in filtmessages) {
        if (filtmessages[i][0] > last_id + 1)
            messages.push("...")
        last_id = filtmessages[i][0];
        messages.push(filtmessages[i]);
    }
    var title = ""+orig_length+" messages";
    if (params.user)
        title += " by "+params.user;
    if (params.token)
        title += " with '"+(params.token in id_to_token ? id_to_token[params.token][1] : "UNKNOWN")+"'"
    showMessages(messages, title);
}


function showTokens(tokens, title) {
    var $dom = $("#token-list");
    $dom.html('<h5>'+(title ? title : "tokens")+'</h5>');
    for (var i in tokens) {
        let tok = tokens[i];
        var html = '<div class="token" data-id="'+tok[0]+'">'
                 + tok[1] + '<span class="right">' + tok[2] + '</span>'
                 + '</div>';
        $dom.append(html);
    }
    $(".token").on("click", function(e) {
        var id = $(e.target).attr("data-id");
        if (id)
            setTokenFilter(parseInt(id));
    });
}

function showTokensByUser(user) {
    var $dom = $("#token-list");
    $dom.html("<h5>tokens by "+user+"</h5>");
    if (!(user in chat_tokens_by_user))
        return;
    var tokens = chat_tokens_by_user[user];
    for (var i in tokens) {
        let tok = tokens[i];
        if (tok[0] in id_to_token) {
            var html = '<div class="token" data-id="'+tok[0]+'">'
                     + id_to_token[tok[0]][1] + '<span class="right">' + tok[1] + '</span>'
                     + '</div>';
            $dom.append(html);
        }
    }
    $(".token").on("click", function(e) {
        var id = $(e.target).attr("data-id");
        if (id)
            setTokenFilter(parseInt(id));
    });
}

$(function() {
    createUserList();
    applyNavParams();
    //showTokens(chat_tokens, "tokens");
});
