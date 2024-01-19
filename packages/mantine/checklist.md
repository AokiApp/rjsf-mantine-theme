# チェックリスト

- [ ] description が props にあれば、それを使うし、なければ uiSchema.description || schema.description を使う
- id が適切についているか
- className が injectable な上に、適切についているか
  - ルール: `armt-<widget|field|template>-<name>` (armt is abbrev. Aokiapp Rjsf Mantine Theme)
- label に labelValue の制御ができるようになっているか, hideLabel が適切についているか
- ariaDescribeById が適切についているか
- getUiOptions が適切についているか
- error が適切についているか, hideError が適切についているか
- Propsの型定義は適切か
- 直接themeを参照しに行くのではなく、getWidgetなどを使っているか
