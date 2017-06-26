# python 3+
"""
05.02.17, 11:15:08: ‪+49 1577 3250282‬: Grüß dich Uwe😉
05.02.17, 11:15:49: ‪+49 173 3990034‬: Das sind Worte, welche gestützt gehören ...
05.02.17, 11:15:59: ‪+49 173 3274732‬: Zu Niedersachsen:
Der "umstrittene Landesvorsitzende" bekommt bei der Wahl 85% der Stimmen.
Da stellt sich mir die Frage, von welcher Seite die Streitigkeiten im LV Niedersachsen medial derart befeuert wurden, wenn das Ergebnis solch deutliche Sprache spricht.
Warum nur sehe ich in der Außenwirkung beider Landesverbände klare Parallelen?
05.02.17, 11:16:15: ‪+49 173 3990034‬: Burgfrieden!
05.02.17, 11:16:41: ‪+49 171 9955502‬: Hallo Daniel, schön das du hier bist und Arno danke ich ausdrücklich für das Wort zum Sonntag!
05.02.17, 11:16:42: ‪+49 173 3990034‬: 👍🏻
05.02.17, 11:18:25: ‪+49 1522 2380886‬: Das ist richtig.
05.02.17, 11:18:59: ‪+49 173 3990034‬: In alle Richtungen
"""
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
    for p in (",", ".", "?", "!", "/", ";"):
        msg = msg.replace(p, " %s " % p)
    return [x.lower() for x in msg.split()]

def gather_tokens(msg):
    for tok in split_tokens(msg):
        if tok in tokens:
            tokens[tok][2] += 1
        else:
            tokens[tok] = [len(tokens), tok, 1]

def to_token_ids(msg):
    return [tokens[tok][0] for tok in split_tokens(msg) if tok in tokens]

def count_tokens(msg, store):
    for tok in split_tokens(msg):
        if tok in tokens:
            if tok in store:
                store[tok][1] += 1
            else:
                store[tok] = [tokens[tok][0], 1]


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

tokens_by_user = {user: sorted(tokens_by_user[user].values(), key=lambda t: -t[1])[:500] for user in tokens_by_user}
tokens = sorted(tokens.values(), key=lambda t: -t[2])[:1000]

with open("afd-chat.js", "wt") as f:
    f.write("""
    var chat = %s;
    var chat_tokens = %s;
    var chat_tokens_by_user = %s;
    """ % (
        json.dumps(chat_by_user),
        json.dumps(tokens),
        json.dumps(tokens_by_user),
    ))
