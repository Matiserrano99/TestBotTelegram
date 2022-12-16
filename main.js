const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
require('dotenv').config();
const fs = require('fs');
const axios = require('axios');


const bot = new Telegraf(process.env.BOT_TOKEN);


bot.start((ctx)=> {
    const userFirstName = ctx.update.message.from.first_name;
    ctx.reply(`Hello ${userFirstName}`);
    console.log(ctx);
    console.log(ctx.update.message.from.first_name);
});
bot.help((ctx)=> {
    ctx.reply("Ask for help to another person...");
});

bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.hears('youtube', (ctx) => ctx.reply('Hey there'));

function random(number) {
    return Math.floor(Math.random() * (number + 1));
}


bot.command('random', (ctx)=>{
    ctx.reply(random(100) + ' tu numero');
});

bot.command('advancerandom', (ctx)=>{
    const message = ctx.update.message.text;
    const randomNumber = Number(message.split(' ')[1]);

    if(isNaN(randomNumber) || randomNumber <= 0){
        ctx.reply('Porfavor escribe un numero que sea valido');
    } else {
        ctx.reply(random(randomNumber) + '');
    }
})


const downloadImage = (url, image_path, ctx) =>
    axios({ url, responseType: 'stream' }).then(
        (response) =>
        new Promise((resolve, reject) => {
            response.data
            .pipe(fs.createWriteStream(image_path))
            .on("finish", () => {
                ctx.reply('almacenada correctamente');
                resolve();
            })
            .on('error', (e) => {
                ctx.reply('No pude almacenarla correctamente');
                reject(e);
            });
        })
    );

    bot.on('photo', (ctx)=> {
        const fileId = ctx.update.message.photo[1].file_id
    
        ctx.telegram.getFileLink(fileId).then((response)=>{
            downloadImage(response.href, './photo.jpg', ctx)
        })
        ctx.reply('Me has enviado una foto');
    })
    
    bot.command('sendphoto', (ctx)=> {
        ctx.replyWithPhoto({source: 'photo.jpg'});
    })
    
    



// bot.on(message('text'), (ctx)=> {
//     const msg = ctx.update.message.text;
//     if(msg.includes('melu')){
//         ctx.reply('La mas hermosa del mundo siempre. Por supuesto.');
//     }
    
// })




bot.launch();