import {AppDataSource} from "./database/data-source"
import {MyContext, SessionData} from "./common/utility";
import {Bot, session} from "grammy";
import {texts} from "./common/texts";
import * as dotenv from 'dotenv';
import {firstConversation} from "./conversations/first-conversation";
import {UserEntity} from "./entities/user.entity";
import {format} from 'date-fns'

dotenv.config()

const index = async () => {
    await AppDataSource.initialize();
    const bot = new Bot<MyContext>(process.env.TOKEN || '');
    bot.use(
        session({
            initial: (): SessionData => ({stage: 1, checked: false, isAdmin: false})
        })
    );

    const clear = 0;

    bot.use(async (ctx: MyContext, next) => {
        if (!ctx.session.checked) {
            const admins = JSON.parse(process.env.ADMINS || '[]');
            const user = await AppDataSource.manager.findOne(UserEntity, {where: {telegramId: ctx.from?.id.toString()}})
            if (!user) {
                if (ctx.from) {
                    const {id, username, first_name, last_name,} = ctx.from;
                    const user = AppDataSource.manager.create(UserEntity, {
                        telegramId: id.toString(),
                        first_name,
                        last_name,
                        username
                    });
                    await AppDataSource.manager.save(UserEntity, user);
                    ctx.session.isAdmin =
                        ctx.session.checked = admins.includes(ctx.from.username);
                }
            } else {
                ctx.session.stage = user.stage;
                ctx.session.checked = true;
                ctx.session.isAdmin =
                    ctx.session.checked = admins.includes(ctx?.from?.username);
            }
        }
        next();
    });

    bot.command('menu', async (ctx) => {
        if (!ctx.session.isAdmin) return;
        const toDay = format(new Date(), 'yyyy-MM-dd')
        const result = await AppDataSource.manager.query(`select s, count, stage
                                                          from (SELECT TO_CHAR("u"."createdAt", 'yyyy-MM-dd') AS "created",
                                                                       count(TO_CHAR("u"."createdAt", 'yyyy-MM-dd')),
                                                                       sum(CAST(("u".stage > 2) as INT))      as stage
                                                                FROM "user_entity" "u"
                                                                WHERE "u"."createdAt" > now()
                                                                    - interval '90 days'
                                                                GROUP BY created
                                                                ORDER BY created DESC) a
                                                                   FULL OUTER JOIN
                                                               (SELECT TO_CHAR(gs, 'yyyy-MM-dd') as s
                                                                from generate_series('${toDay}'
                                                                                         ::timestamp - interval '90 days',
                                                                                     now()::timestamp, interval
                                                                                     '1 day') as gs
                                                                ORDER BY gs DESC) b
                                                               on b.s = a.created;`).then(e => {
            console.log(e);
            return e.map((e: { s: string, count: string, stage: string }) => ({
                date: new Date(e.s),
                count: Number(e.count),
                stage: Number(e.stage)
            }))
        })
        const toCount = (acc: number, value: { stage: number, count: number }) => (acc + value.count);
        const toStage = (acc: number, value: { stage: number }) => (acc + value.stage);
        const for3Month = {
            all: result.reduce(toCount, 0),
            clicked: result.reduce(toStage, 0)
        }
        const forMonth = {
            all: result.slice(0, 30).reduce(toCount, 0),
            clicked: result.slice(0, 30).reduce(toStage, 0)
        }

        const forWeek = {
            all: result.slice(0, 7).reduce(toCount, 0),
            clicked: result.slice(0, 7).reduce(toStage, 0)
        }
        const forDay = {
            all: result.slice(0, 1).reduce(toCount, 0),
            clicked: result.slice(0, 1).reduce(toStage, 0)
        }
        const text = `Зашло за последние 90 дней: ${for3Month.all}/${for3Month.clicked}\nЗашло за последние 30 дней: ${forMonth.all}/${forMonth.clicked}\nЗашло за последние 7 дней: ${forWeek.all}/${forWeek.clicked}\nЗашло за сегодня: ${forDay.all}/${forDay.clicked}`;
        await ctx.reply(text);
    });

    bot.callbackQuery(texts.START.P1.CALLBACK_DATA, async ctx => {
        if (clear) {
            return;
        }
        if (ctx.session.stage > 2) {
            return;
        }
        try {
            await AppDataSource.manager.update(UserEntity, {telegramId: ctx.from.id.toString()}, {stage: 3});
            ctx.session.stage = 3;
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
}
index();

