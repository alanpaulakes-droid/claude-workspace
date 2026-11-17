/*** Bitácora — conector de sincronización (Google Apps Script) ***/
// 1) Cambia la CLAVE por una tuya (la misma que pondrás en la app).
// 2) Implementar > Nueva implementación > Aplicación web.
//    Ejecutar como: Yo   ·   Quién tiene acceso: Cualquiera
// 3) Copia la URL /exec y pégala en la app.
const CLAVE = 'CAMBIA-ESTA-CLAVE';
const ARCHIVO = 'bitacora-organizador.json';

function doPost(e){
  try{
    const req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if(req.secret !== CLAVE) return _out({error:'clave incorrecta'});
    if(req.action === 'load'){
      const f = _find(false);
      return _out({ok:true, data: f ? JSON.parse(f.getBlob().getDataAsString()) : null});
    }
    if(req.action === 'save'){
      _find(true).setContent(JSON.stringify(req.data || {}));
      return _out({ok:true});
    }
    return _out({error:'accion desconocida'});
  }catch(err){ return _out({error:String(err)}); }
}
function doGet(){ return _out({ok:true, info:'Bitacora sync activo'}); }

function _find(crear){
  const it = DriveApp.getFilesByName(ARCHIVO);
  if(it.hasNext()) return it.next();
  return crear ? DriveApp.createFile(ARCHIVO, '{}', 'application/json') : null;
}
function _out(o){
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}
