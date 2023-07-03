export default { get, set, remove, clear };

function get(key) {
  let str = localStorage.getItem(key);
  let json = null;
  if (!str) {
    return str;
  }
  try {
    json = JSON.parse(str);
  } catch (e) {
    console.log(e);
  }
  if (!json || typeof json != "object") {
    return str;
  }
  if (!json.type || !json.data) {
    return json;
  }
  return json.data;
}
function set(key, value) {
  let type = typeof value;
  let json = {
    type,
    data: value,
  };
  localStorage.setItem(key,JSON.stringify(json));
}
function remove(key) {
  localStorage.removeItem(key);
}
function clear() {
  localStorage.clear();
}
