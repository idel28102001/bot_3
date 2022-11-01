import {
  MyContext,
  MyConversation,
  replyWithFile,
  selectCallbackData,
} from '../common/utility';
import {texts} from '../common/texts';

export const firstConversation = async (
  conversation: MyConversation,
  ctx: MyContext
) => {
  await selectCallbackData({
    ctx,
    conversation,
    callbackData: texts.START.P1.CALLBACK_DATA,
    text: texts.START.P1.TEXT,
    buttonText: texts.START.P1.BUTTON.toUpperCase(),
    link: texts.START.P1.LINK,
  });
  await replyWithFile({
    ctx,
    url: texts.START.P2.LINK,
    text: texts.START.P2.TEXT,
  });
  await conversation.sleep(texts.START.P2.DELAY);
  await ctx.reply(texts.START.P3.TEXT, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: texts.START.P3.BUTTON.toUpperCase(),
            url: texts.START.P3.YOUTUBE_LINK,
          },
        ],
      ],
    },
  });
  await conversation.sleep(texts.START.P3.DELAY);
  await ctx.reply(texts.START.P4.TEXT);
  await conversation.sleep(texts.START.P4.DELAY);
  await ctx.reply(texts.START.P5.TEXT, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: texts.START.P5.BUTTON.toUpperCase(),
            url: texts.START.P5.LINK,
          },
        ],
      ],
    },
  });
  console.log('Он здесь');
};