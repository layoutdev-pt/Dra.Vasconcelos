import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do ficheiro .env
dotenv.config();

// O script necessita da SERVICE_ROLE_KEY para ignorar políticas de RLS no Storage
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Podes ajustar o nome do bucket se não for "media"
const BUCKET_NAME = process.env.BUCKET_NAME || 'media';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("ERRO: VITE_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidos no ficheiro .env");
  console.error("Adiciona a tua SUPABASE_SERVICE_ROLE_KEY no ficheiro .env para contornar o RLS.");
  process.exit(1);
}

// Inicializa o cliente do Supabase com a Service Role Key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Lista recursivamente todos os ficheiros dentro do bucket com paginação robusta
async function listAllFiles(bucketName, currentPath = '') {
  let allFiles = [];
  let offset = 0;
  const limit = 1000;
  
  while (true) {
    const { data, error } = await supabase.storage.from(bucketName).list(currentPath, {
      limit,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    });

    if (error) {
      console.error(`Erro ao listar path '${currentPath}':`, error.message);
      break;
    }

    if (!data || data.length === 0) {
      break;
    }

    for (const item of data) {
      // Pastas no Supabase list() tipicamente não têm ID ou não têm metadata
      if (!item.id && !item.metadata) {
        const subPath = currentPath ? `${currentPath}/${item.name}` : item.name;
        const subFiles = await listAllFiles(bucketName, subPath);
        // Correção 3: Prevenção de Call Stack Overflow através de concatenação
        allFiles = allFiles.concat(subFiles);
      } else {
        // É um ficheiro
        if (item.name !== '.emptyFolderPlaceholder') {
          const filePath = currentPath ? `${currentPath}/${item.name}` : item.name;
          allFiles.push({ ...item, filePath });
        }
      }
    }

    if (data.length < limit) {
      break;
    }

    offset += limit;
  }

  return allFiles;
}

// Processa o ficheiro, converte para WebP (máx 1920px) e faz o upload (File Masking)
async function processFile(bucketName, file) {
  console.log(`A processar: ${file.filePath}...`);

  const ext = file.name.split('.').pop().toLowerCase();
  
  // Correção 2: Proteger Vetores e GIFs animados de corrupção ou congelação
  const isSvgOrGif = file.metadata?.mimetype === 'image/svg+xml' || ext === 'svg' || file.metadata?.mimetype === 'image/gif' || ext === 'gif';
  if (isSvgOrGif) {
    console.log(`⏭️  Ignorado (Vetor SVG ou GIF animado intolerante ao processamento estático): ${file.filePath}`);
    return;
  }

  // Proteger imagens já em WebP, APENAS se forem matematicamente leves (< 500KB)
  const isWebp = file.metadata?.mimetype === 'image/webp' || ext === 'webp';
  const sizeInBytes = file.metadata?.size || 0;
  if (isWebp && sizeInBytes < 500000) {
    console.log(`⏭️  Ignorado (Já em formato WebP otimizado abaixo do limite de peso): ${file.filePath}`);
    return;
  }

  // Resgatar Falsos Negativos validando pela extensão quando o mimetype falha ou é genérico
  const isImageMime = file.metadata?.mimetype?.startsWith('image/');
  const isImageExt = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'bmp', 'tiff'].includes(ext);

  if (!isImageMime && !isImageExt) {
    console.log(`⏭️  Ignorado (Ficheiro não é imagem validada): ${file.filePath} (Mime: ${file.metadata?.mimetype}, Ext: ${ext})`);
    return;
  }

  try {
    // 1. Descarregar o ficheiro original para a memória
    const { data: fileData, error: downloadError } = await supabase.storage.from(bucketName).download(file.filePath);
    if (downloadError) throw downloadError;

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Usar o Sharp para redimensionar, corrigir a rotação (EXIF) e converter para WebP (quality: 80)
    // Correção 1: Aplicação de .rotate()
    const processedBuffer = await sharp(buffer)
      .rotate()
      .resize({
        width: 1920,
        withoutEnlargement: true, // Não aumentar imagens que sejam menores que 1920px
        fit: 'inside'             // Mantém o Aspect Ratio
      })
      .webp({ quality: 80 })
      .toBuffer();

    // 3. Upload com Mascaramento: Mesmo caminho, Upsert, forçando contentType e cacheControl
    const { error: uploadError } = await supabase.storage.from(bucketName).upload(file.filePath, processedBuffer, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: true
    });

    if (uploadError) throw uploadError;

    console.log(`✅ Sucesso: ${file.filePath}`);
  } catch (error) {
    console.error(`❌ Falha em: ${file.filePath} -> ${error.message || error}`);
  }
}

async function run() {
  console.log(`A iniciar migração no bucket: '${BUCKET_NAME}'`);
  console.log('A mapear ficheiros na base de dados...');
  const files = await listAllFiles(BUCKET_NAME);
  
  console.log(`Encontrados ${files.length} ficheiros. A iniciar processamento...`);
  
  // O processamento ocorre sequencialmente para não sobrecarregar a memória nem causar rate limits
  for (const file of files) {
    await processFile(BUCKET_NAME, file);
  }
  
  console.log('🎉 Migração concluída com sucesso!');
}

run();