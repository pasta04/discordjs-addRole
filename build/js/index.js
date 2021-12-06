"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileText = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = tslib_1.__importDefault(require("discord.js"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const config_1 = tslib_1.__importDefault(require("config"));
const config = config_1.default.util.toObject(config_1.default);
const main = async () => {
    try {
        //  Discordのトークン取得
        const token = config.discordToken ? config.discordToken : process.env.NODE_ENV_DISCORD_TOKEN;
        if (!token)
            throw new Error('Discord認証トークンが指定されていません。');
        // 付与対象のメンバー読み込み
        const filepath = path_1.default.resolve('data/member.csv');
        const txt = await exports.readFileText(filepath, 'UTF-8');
        /** 付与対象のメンバー */
        const members = txt.split('\n');
        if (members.length === 0)
            throw new Error('権限付与対象のメンバーが指定されていません。');
        // Discordログイン
        /** DiscordのClientオブジェクト */
        const client = new discord_js_1.default.Client();
        await client.login(token);
        if (!client.user)
            throw new Error('ログインに失敗しました。');
        // 何か裏でいろいろしてるので準備完了を待つ
        await (async () => {
            return new Promise((resolve, reject) => {
                client.once('ready', () => {
                    console.log('Ready!');
                    resolve();
                });
            });
        })();
        // 操作対象のサーバ取得
        const guild = await client.guilds.fetch(config.guildId);
        if (!guild)
            throw new Error('操作対象のサーバ情報を取得できません。');
        console.log(`サーバ名: ${guild.name}`);
        // オフライン勢も含めてサーバの全メンバーを取得する
        await guild.members.fetch();
        const guildFullMembers = guild.members.cache;
        // 全メンバーを確認したい時は以下のコメントアウトを外す
        // console.log('メンバーは以下');
        // for (const member of guildFullMembers) {
        //   console.log(`"${member[1].user.id}", "${member[1].user.tag}"`);
        // }
        console.log('=============================');
        // 付与対象に絞り込み
        const targetMember = guildFullMembers.filter((member) => {
            return members.includes(member.id);
        });
        // 操作対象として指定されているのにサーバにいない人をチェック
        for (const member of members) {
            if (!targetMember.get(member))
                console.warn(`サーバにいない： ${member}`);
        }
        console.log('=============================');
        // 付与する権限の表示名を取得
        const role = guild.roles.cache.get(config.roleId);
        if (!role)
            throw new Error('操作対象のサーバに指定した権限が存在しません。');
        const roleName = role.name;
        // 付与する権限に既に割り当てられてる人
        // console.log('既に割り当てられてる人');
        // for (const member of role.members) {
        //   console.log(`"${member[1].user.id}", "${member[1].user.tag}"`);
        // }
        // リストに合致したメンバーに権限付与
        const mangementType = config.roleRemove ? '削除' : '追加';
        console.log(`以下のメンバーについて ${roleName} の権限${mangementType}`);
        for (const member of targetMember) {
            console.log(`"${member[1].id}", "${member[1].user.tag}"`);
            if (config.roleRemove) {
                await member[1].roles.remove(role);
            }
            else {
                await member[1].roles.add(role);
            }
        }
        // ログアウト
        client.destroy();
    }
    catch (error) {
        console.error('何かエラーがあった');
        console.error(error);
        process.exit();
    }
};
/**
 * awaitで囲いたいreadFile
 * @param filePath ファイルのパス
 * @param code 文字コード
 * @return 読み込んだ文字列
 */
const readFileText = (filePath, code) => {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(filePath, code, (err, data) => {
            if (err)
                reject(err);
            resolve(data);
        });
    });
};
exports.readFileText = readFileText;
(() => {
    main();
})();
//# sourceMappingURL=index.js.map