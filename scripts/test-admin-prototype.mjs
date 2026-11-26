import fs from "node:fs";
const html=fs.readFileSync("admin/index.html","utf8");
const js=fs.readFileSync("admin/js/admin.js","utf8");
const sql=fs.readFileSync("database/schema.sql","utf8");
const checks=[
 ["admin page has responsive viewport and disclaimer",html.includes('name="viewport"')&&html.includes("prototipo")],
 ["dashboard and CRUD form controls are present",["recordList","recordForm","recordTitle","recordSlug","recordContent","recordState"].every(x=>html.includes(x))],
 ["CRUD actions are implemented",["newEntry","data-edit","data-delete","form.addEventListener(\"submit\""].every(x=>js.includes(x))],
 ["content is escaped before insertion",js.includes("function escapeHtml")&&js.includes("escapeHtml(r.title)")],
 ["slug validation exists",js.includes("^[a-z0-9]+(?:-[a-z0-9]+)*$")],
 ["all content sections have labels",["noticias","lista","ejes","agenda","transparencia","galeria","memoria","comunidad","contacto","ajustes"].every(x=>js.includes(x))],
 ["the complementary fifth axis is represented in demo",js.includes("length:5")&&js.includes("eje-")&&js.includes("complementario")],
 ["demo explicitly warns about temporary non-persistence",html.includes("no se guardan al recargar")&&html.includes("ni se publican en el sitio")],
 ["D1 schema defines CMS user, session, entries, versions and audit",["admin_users","admin_sessions","cms_entries","cms_versions","cms_audit_log"].every(x=>sql.includes("CREATE TABLE IF NOT EXISTS "+x))]];
for(const [label,ok] of checks){console.log((ok?"PASS":"FAIL")+" "+label);if(!ok)process.exitCode=1;}
if(!process.exitCode)console.log("ADMIN PROTOTYPE SMOKE TESTS PASSED");
