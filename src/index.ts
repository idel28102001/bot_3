import * as dotenv from 'dotenv';
import {Bot, session} from 'grammy';
import {conversations, createConversation} from '@grammyjs/conversations';
import {MyContext} from './common/utility';
import {firstConversation} from './conversations/first-conversation';

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
  if (ctx.session.stage === 1) {
    await ctx.conversation.enter('first_conversation');
  }
  ctx.session.stage++;
});

bot.start();
