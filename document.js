
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

function hookUserClick() {
    $(".user-click").on("click", function(e) {
        var user = $(e.target).attr("data-user");
        if (user) {
            showMessagesByUser(user);
            showTokensByUser(user);
        }
    });
}

function createUserList() {
    var $dom = $("#user-list");
    for (var i in user_list) {
        let user = user_list[i];
        $dom.append('<nobr><div class="user-entry user-click" data-user="'+user+'">' + user
                  + ' / ' + chat[user].length
                  + (user in chat_tokens_by_user ? (' / ' + chat_tokens_by_user[user].length) : '')
                  + '</div></nobr>'
                   );
    }
    hookUserClick();
}

function messageDiv(msg) {
    if (typeof(msg) == "string")
        return '<div>' + msg + '</div>';
    var html
         = '<div class="chat-message" >'
         + '<span class="chat-user user-click" data-user="'+msg[2]+'">' + msg[2] + '</span> '
         + '<span class="chat-date">' + (new Date(msg[1]*1000)).toISOString() + "</span> "
         + '<div class="chat-text">' + msg[3] + '</div>'
         + '</div>';
    if (msg.length > 5)
        html = '<div class="highlight">'+html+'</div>';
    return html;
}


function showMessages(messages, title) {
    var $dom = $("#chat-list");
    $dom.html(title ? '<h5>'+title+'</h5>' : '');
    for (var i in messages) {
        let msg = messages[i];
        $dom.append(messageDiv(msg));
    }
    hookUserClick();
}

function showMessagesByUser(user) {
    var filtmessages = {};
    for (var i in chat_messages) {
        i = parseInt(i);
        for (var j=Math.max(0, i-3); j<Math.min(chat_messages.length, i+4); ++j)
            if (chat_messages[i][2] == user)
                if (chat_messages[j][2] == user)
                    filtmessages[j] = chat_messages[j].concat(["highlight"]);
                else
                    filtmessages[j] = chat_messages[j];
    }
    var messages = [];
    var last_id = 0;
    for (var i in filtmessages) {
        if (filtmessages[i][0] > last_id + 1)
            messages.push("...")
        last_id = filtmessages[i][0];
        messages.push(filtmessages[i]);
    }
    showMessages(messages, "messages by "+user);
}

function showMessagesByTokenId(id) {
    var messages = [];
    for (var i in chat_messages) {
        if (chat_messages[i][4].includes(id))
            messages.push(chat_messages[i]);
    }
    showMessages(messages, "messages with &quot;"+id_to_token[id][1]+"&quot;");
}

function showTokens(tokens, title) {
    var $dom = $("#token-list");
    $dom.html(title ? '<h5>'+title+'</h5>' : '');
    for (var i in tokens) {
        let tok = tokens[i];
        var html = '<div class="token" data-id="'+tok[0]+'">'
                 + tok[1] + '<span class="right">' + tok[2] + '</span>'
                 + '</div>';
        $dom.append(html);
    }
    $(".token").on("click", function(e) {
        var id = parseInt($(e.target).attr("data-id"));
        showMessagesByTokenId(id);
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
        var id = parseInt($(e.target).attr("data-id"));
        showMessagesByTokenId(id);
    });
}

$(function() {
    createUserList();
    showTokens(chat_tokens, "tokens");
});
