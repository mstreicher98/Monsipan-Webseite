const fs=require('fs'),path=require('path'),sharp=require('sharp');
const [dir,out,cols=6]=process.argv.slice(2);
(async()=>{const files=fs.readdirSync(dir).filter(f=>/\.(webp|jpg|png)$/.test(f)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
const W=260,H=180,c=+cols,rows=Math.ceil(files.length/c);
const comps=await Promise.all(files.map(async(f,i)=>{const img=await sharp(path.join(dir,f)).resize(W,H-20,{fit:'cover'}).toBuffer();
const label=Buffer.from(`<svg width="${W}" height="20"><rect width="100%" height="100%" fill="#fff"/><text x="4" y="15" font-size="13" font-family="Arial">${f.slice(0,34)}</text></svg>`);
return [{input:img,left:(i%c)*W,top:Math.floor(i/c)*H},{input:label,left:(i%c)*W,top:Math.floor(i/c)*H+H-20}]}));
await sharp({create:{width:W*c,height:H*rows,channels:3,background:'#ddd'}}).composite(comps.flat()).jpeg({quality:70}).toFile(out);console.log(files.length)})();
