import {Context, SessionFlavor} from 'grammy';
import {Conversation, ConversationFlavor} from '@grammyjs/conversations';

interface SessionData {
  stage: number;
}

export type MyContext = Context &
  SessionFlavor<SessionData> &
  ConversationFlavor;
export type MyConversation = Conversation<MyContext>;

export const selectCallbackData = async ({
  ctx,
  callbackData,
  conversation,
  text,
  buttonText,
  link,
}: {
  ctx: MyContext;
  conversation: MyConversation;
  text: string;
  buttonText: string;
  callbackData: string;
  link: string;
}) => {
  await ctx.replyWithPhoto(link, {
    caption: text,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: buttonText,
            callback_data: callbackData,
          },
        ],
      ],
    },
  });
  let dataP1;
  while (dataP1 !== callbackData) {
    const {
      update: {
        callback_query: {data},
      },
    } = await conversation.waitFor('callback_query:data');
    dataP1 = data;
  }
};

export const replyWithFile = async ({
  ctx,
  url,
  button,
  text,
}: {
  ctx: MyContext;
  url: string;
  button: string;
  text: string;
}) => {
  const text2 = text.split(' ');
  const [first2, last2] = [text2.slice(0, -1), text2.slice(-1)];
  const [f2, l2] = [first2.join(' '), last2[0]];
  return await ctx.reply(`${f2} ${l2}`, {
    reply_markup: {inline_keyboard: [[{text: button.toUpperCase(), url}]]},
    entities: [
      {
        type: 'text_link',
        url,
        length: 1,
        offset: f2.length,
      },
    ],
  });
};
