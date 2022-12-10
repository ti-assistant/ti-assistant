import Cookies from 'js-cookie';

function genCookie(length) {
  let result = '';
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 return result;
}

export async function fetcher(url) {
  if (!Cookies.get("secret")) {
    Cookies.set("secret", genCookie(16));
  }
  const res = await fetch(url, {
    method: "GET",
    credentials: 'include',
  })
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

function getUpdatedEndpoint(url) {
  const update = url.substring(url.lastIndexOf('/') + 1);
  switch(update) {
    case "agendaUpdate":
      return "agendas";
    case "attachmentUpdate":
      return "attachments";
    case "cardUpdate":
      return "strategycards";
    case "factionUpdate":
      return "factions";
    case "objectiveUpdate":
      return "objectives";
    case "optionUpdate":
      return "options";
    case "planetUpdate":
      return "planets";
    case "stateUpdate":
      return "state";
  }
  console.log("Error");
  return "";
}

export async function poster(url, data, setUpdateTime) {
  data.timestamp = Date.now();
  setUpdateTime(getUpdatedEndpoint(url), data.timestamp);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const val = await res.json();

  if (res.status !== 200) {
    throw new Error(val.message);
  }
  return val;
}