let idBot    = "1298665334093516833";
let tokenBot = "...";
idBot = String(idBot).trim();
tokenBot = String(tokenBot).trim();
if (tokenBot.toLowerCase().startsWith("bot ")) {
  tokenBot = tokenBot.slice(4).trim();
}

const authBot = `Bot ${tokenBot}`;
const API  = "https://discord.com/api/v10";
const headers = { "Authorization": authBot, "Content-Type": "application/json" };
const GUILD_IDS = [
  // "666", tu laisse comme ca pour que le bot purge les slash sur tous les serveurs
];

async function checkBotIdentity() {
  const meRes = await fetch(`${API}/users/@me`, { headers });
  if (!meRes.ok) throw new Error(`-X /users/@me: ${meRes.status} ${await meRes.text()}`);
  const me = await meRes.json();
  console.log(`-> Bot: ${me.username} (${me.id})`);
  const appRes = await fetch(`${API}/oauth2/applications/@me`, { headers });
  if (!appRes.ok) throw new Error(`-X /oauth2/applications/@me: ${appRes.status} ${await appRes.text()}`);
}

async function purgeGlobal() {
  const url = `${API}/applications/${idBot}/commands`;
  const res = await fetch(url, { method: "PUT", headers, body: JSON.stringify([]) });
  if (!res.ok) throw new Error(`GL PUT [] -> ${res.status} ${await res.text()}`);
}

async function purgeGuild(guildId) {
  const url = `${API}/applications/${idBot}/guilds/${guildId}/commands`;
  const res = await fetch(url, { method: "PUT", headers, body: JSON.stringify([]) });
  if (!res.ok) throw new Error(`Guild ${guildId} PUT [] -> ${res.status} ${await res.text()}`);
}

(async () => {
  try {
    await checkBotIdentity();
    await purgeGlobal();
    for (const gid of GUILD_IDS) await purgeGuild(String(gid).trim());
    console.log("-> PLus de slash sur le bot");
  } catch (e) {
    console.error(e?.message || e);
    process.exit(1);
  }
})();
