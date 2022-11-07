import {Context, SessionFlavor} from 'grammy';

export interface SessionData {
    stage: number;
    checked: boolean;
    isAdmin: boolean;
}

export const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));
export type MyContext = Context &
    SessionFlavor<SessionData>

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
