# discordjs-addRole

どこかのサーバの誰かに何かの権限を付与する。

## 下準備1 パッケージインストール
```
yarn
```

## 下準備2 設定1
`config/default.json`に以下を適宜設定

| key | 説明 |
|---- |--|
| guildId   | 操作対象のサーバID |
| roleId   | 付与する権限のID |
| discordToken   | Discordの認証トークン。Configに無ければ環境変数 NODE_ENV_DISCORD_TOKEN を使用する |

## 下準備3 設定2
`data/member.csv`に権限付与対象のユーザIDを記載する。

1行1ユーザID。便宜上CSVということにしているがカンマ等が入ると上手く動作しなくなる。

## 実行
```
yarn start
```
