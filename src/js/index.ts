import Discord from 'discord.js';
import fs from 'fs';
import path from 'path';
import configModule from 'config';
const config: Config = configModule.util.toObject(configModule);

const main = async () => {
  try {
    //  Discordのトークン取得
    const token = config.discordToken ? config.discordToken : process.env.NODE_ENV_DISCORD_TOKEN;
    if (!token) throw new Error('Discord認証トークンが指定されていません。');

    // 付与対象のメンバー読み込み
    const filepath = path.resolve('data/member.csv');
    const txt = await readFileText(filepath, 'UTF-8');
    /** 付与対象のメンバー */
    const members = txt.split('\n');
    if (members.length === 0) throw new Error('権限付与対象のメンバーが指定されていません。');

    // Discordログイン
    /** DiscordのClientオブジェクト */
    const client = new Discord.Client();
    await client.login(token);
    if (!client.user) throw new Error('ログインに失敗しました。');

    // 何か裏でいろいろしてるので準備完了を待つ
    await (async () => {
      return new Promise<void>((resolve, reject) => {
        client.once('ready', () => {
          console.log('Ready!');
          resolve();
        });
      });
    })();

    // 操作対象のサーバ取得
    const guild = await client.guilds.fetch(config.guildId);
    if (!guild) throw new Error('操作対象のサーバ情報を取得できません。');
    console.log(`サーバ名: ${guild.name}`);

    // オフライン勢も含めてサーバの全メンバーを取得する
    await guild.members.fetch();
    const guildFullMembers = guild.members.cache;

    // 全メンバーを確認
    console.log('メンバーを出力');
    let list = `"名前", "ID"\n`;
    for (const member of guildFullMembers) {
      const line = `"${member[1].user.tag}", "${member[1].user.id}"`
      list += `${line}\n`;
    }
    fs.writeFileSync("data/allmember.csv", list);

    // 付与対象に絞り込み
    const targetMember = guildFullMembers.filter((member) => {
      return members.includes(member.id);
    });

    // 操作対象として指定されているのにサーバにいない人をチェック
    for (const member of members) {
      if (member && !targetMember.get(member)) console.warn(`サーバにいない： ${member}`);
    }
    console.log('=============================');

    // 付与する権限の表示名を取得
    const role = guild.roles.cache.get(config.roleId);
    if (!role) throw new Error('操作対象のサーバに指定した権限が存在しません。');
    const roleName = role.name;

    // 付与する権限に既に割り当てられてる人
    console.log('既に割り当てられてる人');
    for (const member of role.members) {
      console.log(`"${member[1].user.id}", "${member[1].user.tag}"`);
    }
    console.log('=============================');

    // リストに合致したメンバーに権限付与
    const mangementType = config.roleRemove ? '削除' : '追加';
    console.log(`以下のメンバーについて ${roleName} の権限${mangementType}`);

    for (const member of targetMember) {
      console.log(`"${member[1].id}", "${member[1].user.tag}"`);
      if (config.roleRemove) {
        await member[1].roles.remove(role);
      } else {
        await member[1].roles.add(role);
      }
    }

    // ログアウト
    client.destroy();
  } catch (error) {
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
export const readFileText = (filePath: string, code: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, code, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

(() => {
  main();
})();
