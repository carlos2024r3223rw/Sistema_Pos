const mysql = require('mysql2/promise');
const { GOOGLE_IMG_SCRAP } = require('google-img-scrap');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const DB_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sistema_pos'
};

const UPLOADS_DIR = path.join(__dirname, '../uploads/productos');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

async function downloadImage(url, filepath) {
  try {
    const response = await axios({ url, responseType: 'stream', timeout: 5000 });
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filepath);
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    throw error;
  }
}

async function run() {
  console.log("Conectando a BD...");
  const connection = await mysql.createConnection(DB_CONFIG);
  
  const [rows] = await connection.execute('SELECT id, nombre, imagen FROM productos');
  console.log(`Encontrados ${rows.length} productos.`);

  let actualizados = 0;

  for (const prod of rows) {
    // Si ya tiene una imagen local o es la de coca cola que subio manual, la saltamos a menos que sea placehold
    if (prod.imagen && !prod.imagen.includes('placehold.co') && fs.existsSync(path.join(__dirname, '../', prod.imagen))) {
        continue;
    }

    console.log(`Buscando imagen para: ${prod.nombre}`);
    try {
      const res = await GOOGLE_IMG_SCRAP({
        search: prod.nombre + " producto transparente png",
        limit: 1
      });

      if (res && res.result && res.result.length > 0) {
        const imgUrl = res.result[0].url;
        const ext = imgUrl.split('.').pop().split('?')[0].toLowerCase() || 'jpg';
        const finalExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
        
        const filename = `prod_${prod.id}_${Date.now()}.${finalExt}`;
        const filepath = path.join(UPLOADS_DIR, filename);
        
        await downloadImage(imgUrl, filepath);
        
        const dbPath = `uploads/productos/${filename}`;
        await connection.execute('UPDATE productos SET imagen = ? WHERE id = ?', [dbPath, prod.id]);
        console.log(`[OK] Descargada: ${filename}`);
        actualizados++;
      } else {
        console.log(`[WARN] No se encontró imagen para ${prod.nombre}`);
      }
    } catch (e) {
      console.log(`[ERR] Error con ${prod.nombre}: ${e.message}`);
    }
    
    // Pequeño delay para no saturar a Google
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`¡Proceso finalizado! ${actualizados} imágenes actualizadas.`);
  await connection.end();
}

run().catch(console.error);
