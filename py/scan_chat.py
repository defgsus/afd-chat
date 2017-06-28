# python 3+

# schlüpfer: https://defgsus.github.io/afd-chat/#user=Numesako&msgid=3817
# bogus link: file:///home/defgsus/prog/python/fun/afd-chat/index.html#user=Ramesa&msgid=8352&

import os
import re
import json
import datetime

if not os.path.exists("./3098700935.txt"):
    print("Grab the source from: https://linksunten.indymedia.org/de/system/files/data/2017/06/3098700935.txt")
    exit(-1)


def normalize_name(user):
    for i in ('\u202a', ):
        user = user.replace(i, "")
    user = "".join(user.split())
    return user

NAME_PARTS = ("goa", "bu", "da", "di", "lo",
              "me", "sa", "ko", "nu", "fi",
              "ba", "ra", "tu", "se", "bo")
USER_MAP = dict()
def get_user_name(user):
    user = normalize_name(user)
    leng = 2
    start = 0 if len(user) < 7 else 4
    while True:
        leng += 1
        name = "".join(NAME_PARTS[ord(c) % len(NAME_PARTS)] for c in user[start:start+leng])
        if name in USER_MAP:
            if USER_MAP[name] == user:
                break
        else:
            USER_MAP[name] = user
            break
    name = name[0].upper() + name[1:]
    return name

chat = []
chat_by_user = dict()
tokens = dict()
tokens_by_user = dict()

def split_tokens(msg):
    msg = msg.lower()
    for p in (",", ".", "?", "!", "/", ";"):
        msg = msg.replace(p, " %s " % p)
    return [x for x in msg.split() if x not in ignore_tokens]

def gather_tokens(msg):
    for tok in split_tokens(msg):
        if tok in tokens:
            tokens[tok]["count"] += 1
        else:
            tokens[tok] = {"id": len(tokens), "name": tok, "count": 1}

def to_token_ids(msg):
    return [tokens[tok]["id"] for tok in split_tokens(msg) if tok in tokens]

def count_tokens(msg, store):
    for tok in split_tokens(msg):
        if tok in tokens:
            if tok in store:
                store[tok]["count"] += 1
            else:
                store[tok] = {"id": tokens[tok]["id"], "name": tok, "count": 1}

with open("./ignore_tokens.json") as f:
    ignore_tokens = json.load(f)
    ignore_tokens = set(ignore_tokens)

with open("./3098700935.txt") as f:
    chattext = f.read()
    for i in ("\u202c", "\u202a"):
        chattext = chattext.replace(i, "")
    chattext = chattext.replace("hat die Gruppe erstellt", ": hat die Gruppe erstellt")
    chattext = chattext.replace("hat die Gruppe verlassen", ": hat die Gruppe verlassen")
    chattext = chattext.replace("05.02.17, 01:35:57: ‎Nachrichten, die Sie an diese Gruppe senden, sind jetzt mit Ende-zu-Ende-Verschlüsselung geschützt.\n", "")
    for r in (r"(hat) ([^:]+) (hinzugefügt)",
              r"(hat) ([^:]+) (entfernt)",
              r"(hat zu) ([^:]+) (gewechselt)"):
        chattext = re.sub(r, lambda m: ": %s %s %s" % (m.group(1), get_user_name(m.group(2)), m.group(3)), chattext)
    chattext = re.sub(r"(@4\d*)", lambda m: "@%s" % get_user_name(m.group(0)), chattext)

    count_msg = 0
    last_end = -1
    last_chat_obj = None
    for i, match in enumerate(re.finditer(r"(\d\d\.\d\d\.\d\d, \d\d:\d\d:\d\d):([^:]+)(.+)", chattext)):
        count_msg += 1
        date, handle, message = match.groups()
        if last_chat_obj and match.span()[0] > last_end + 2:
            last_chat_obj[3] += chattext[last_end:match.span()[0]]
        last_end = match.span()[1]

        date = datetime.datetime.strptime(date, "%d.%m.%y, %H:%M:%S").timestamp()
        handle = get_user_name(handle.strip())
        message = message.strip().strip(": ")

        gather_tokens(message)

        chat_obj = [i, date, handle, message]
        chat.append(chat_obj)
        last_chat_obj = chat_obj

        #print(match.groups())
        #if len(chat) > 5:
        #    break

        if handle in chat_by_user:
            chat_by_user[handle].append(chat_obj)
        else:
            chat_by_user[handle] = [chat_obj]

    print("%s users" % len(chat_by_user))
    print("%s messages" % count_msg)
    print("%s tokens" % len(tokens))

for c in chat:
    # generate token ids per message
    c.append(to_token_ids(c[3]))

    # tokens per user
    if c[2] not in tokens_by_user:
        tokens_by_user[c[2]] = dict()
    count_tokens(c[3], tokens_by_user[c[2]])

    # fit message for html output
    for p in ((">", "&gt;"), ("<", "&lt;"), ("\n", "<br/>"), ("\r", "<br/>")):
        c[3] = c[3].replace(p[0], p[1])
    c[3] = re.sub(r"https?://[^\s]*", lambda m: '<a href="%s">%s</a>' % (m.group(0), m.group(0)), c[3])

#users = sorted(chat_by_user.keys(), key=lambda x: -len(chat_by_user[x]))
#for user in users:
#    print("%4s [%s]" % (len(chat_by_user[user]), user))

## export

tokens_by_user = {user: sorted(tokens_by_user[user].values(), key=lambda t: -t["count"])[:500] for user in tokens_by_user}
tokens = sorted(tokens.values(), key=lambda t: -t["count"])

# limit data for development - webpack build takes forever...
if 1:
    tokens = tokens[:2000]
    chat = chat[:300]

if 1:
    with open("../frontend/js/chat-messages.js", "wt") as f:
        f.write("""
        export const chat_messages = %s;
        export const chat_users = %s; 
        """ % (
            json.dumps(chat),
            json.dumps(sorted([(user, len(chat_by_user[user])) for user in chat_by_user], key=lambda x: -x[1])),
        ))

if 1:
    with open("../frontend/js/chat-tokens.js", "wt") as f:
        f.write("""
        export function idToToken(id) { return (id in id_to_token_map) ? id_to_token_map[id] : null }
        export const chat_tokens = %s;
        export const id_to_token_map = %s;
        //export const chat_tokens_by_user = ;
        """ % (
            json.dumps(tokens),
            json.dumps({t["id"]: t["name"] for t in tokens}),
            #json.dumps(tokens_by_user),
        ))
