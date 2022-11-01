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
bot.use(conversations());
bot.use(createConversation(firstConversation, 'first_conversation'));
bot.on('message', async ctx => {
  try {

    if (ctx.session.stage === 1) {
      await ctx.replyWithPhoto(texts.START.P1.LINK, {
        caption: texts.START.P1.TEXT,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text:  texts.START.P1.BUTTON.toUpperCase(),
                callback_data:  texts.START.P1.BUTTON,
              },
            ],
          ],
        },
      });
      ctx.session.stage++;
  }
  }
  catch (e) {
    console.log(e);
  } 
});

bot.callbackQuery(texts.START.P1.BUTTON, async (ctx)=>{
  try {
    await ctx.conversation.enter('first_conversation');
  } catch (error) {
    console.log(error);
  }
});

bot.start();
console.log('Бот запущен');
