# discordjs-addRole

どこかのサーバの誰かに何かの権限を付与する。

## 下準備 1 パッケージインストール

```
yarn
```

## 下準備 2 設定 1

`config/default.json`に以下を適宜設定

```json
{
  "roleRemove": false, // trueにすると逆に権限を削除します
  "guildId": "操作対象のサーバID",
  "roleId": "付与する権限のID",
  "discordToken": "Discordの認証トークン。Configに無ければ環境変数 NODE_ENV_DISCORD_TOKEN を使用する"
}
```

## 下準備 3 設定 2

`data/member.csv`に権限付与対象のユーザ ID を記載する。

1 行 1 ユーザ ID。便宜上 CSV ということにしているがカンマ等が入ると上手く動作しなくなる。

## 下準備 4

bot をサーバに登録
(v12 から？bot の token じゃないとログインに失敗するようになった)

- see: https://www.reddit.com/r/Discord_Bots/comments/7ttd58/get_missing_permissions_when_trying_to_add_a_role/dtf3ouh?utm_source=share&utm_medium=web2x&context=3

## 実行

```
yarn start
```
