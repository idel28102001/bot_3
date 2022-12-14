import {MyContext, replyWithFile, sleep} from '../common/utility';
import {texts} from '../common/texts';

export const firstConversation = async (ctx: MyContext) => {
    ctx.session.stage = 3;
    await replyWithFile({
        ctx,
        url: texts.START.P2.LINK,
        text: texts.START.P2.TEXT,
        button: texts.START.P2.BUTTON,
    });
    await sleep(texts.START.P2.DELAY);
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
        parse_mode: 'HTML',
    });
    ctx.session.stage = 4;
    await sleep(texts.START.P3.DELAY);
    await ctx.reply(texts.START.P4.TEXT, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: texts.START.P4.BUTTON.toUpperCase(),
                        url: texts.START.P4.YOUTUBE_LINK,
                    },
                ],
            ],
        },
    });
    ctx.session.stage = 5;
    await sleep(texts.START.P4.DELAY);
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
    ctx.session.stage = 3;
};
