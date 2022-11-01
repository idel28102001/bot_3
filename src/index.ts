import * as dotenv from 'dotenv';
import {Bot, session} from 'grammy';
import {conversations, createConversation} from '@grammyjs/conversations';
import {MyContext} from './common/utility';
import {firstConversation} from './conversations/first-conversation';
import {texts} from './common/texts';
console.log('Бот запускается...');
dotenv.config();
const bot = new Bot<MyContext>(process.env.TOKEN || '');
bot.use(
  session({
    initial: () => ({stage: 1}),
  })
);

const clear = 0;

bot.use((ctx: MyContext, next) =>{
  next();
});

bot.callbackQuery(texts.START.P1.CALLBACK_DATA, async ctx => {
  console.log(ctx.from);
  if (clear) {
    return
  }
  if (ctx.session.stage>2) {
    return
  }
  try {
    await firstConversation(ctx);
  } catch (error) {
    console.log(error); 
  }
});  

bot.on('message', async ctx => {  
  if (clear) {
    return;
  }
  try {
    if (ctx.session.stage === 1) {
      await ctx.replyWithPhoto(texts.START.P1.LINK, {
        caption: texts.START.P1.TEXT,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: texts.START.P1.BUTTON.toUpperCase(),
                callback_data: texts.START.P1.CALLBACK_DATA,
              },
            ],
          ],
        },
      });
      ctx.session.stage = 2;
    }
  } catch (e) {
    console.log(e);
  }
});

bot.start();
console.log('Бот запущен');
