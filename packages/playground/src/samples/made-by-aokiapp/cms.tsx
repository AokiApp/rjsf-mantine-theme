import { Sample } from '../Sample';
import { Type } from '@sinclair/typebox';
import { NamedStringEnum } from './utils';
// JSON schema for Content Management System
const schema = Type.Object(
  {
    title: Type.String({
      title: 'タイトル',
      description: '人々の心を動かすタイトルをつけましょう。',
    }),
    subtitle: Type.Optional(
      Type.String({
        title: 'サブタイトル',
        description: 'サブタイトルをつけると、より一層読み手を惹きつけることができます。',
      }),
    ),
    tags: Type.Array(
      Type.String({
        title: '',
      }),
      {
        uniqueItems: true,
        title: 'タグ',
        description: 'タグをつけると、検索しやすくなります。',
      },
    ),
    body: Type.String({
      title: '本文',
      description: 'Markdownエディタ、またはビジュアルエディタで本文を入力してください。',
    }),
    images: Type.Array(
      Type.String({
        format: 'data-url',
      }),
      {
        uniqueItems: true,
        title: '画像',
        description: '本文中に挿入する画像を選択してください。画像は最大10枚まで挿入できます。',
      },
    ),
    thumbnail: Type.Optional(
      Type.String({
        title: 'サムネイル',
        description: '設定しない場合は、本文中の最初の画像がサムネイルになります。',
        format: 'data-url',
      }),
    ),
    publishedAt: Type.Optional(
      Type.String({
        title: '公開日時',
        description: '設定しない場合は、すぐに公開されます。',
        format: 'date-time',
      }),
    ),
    scope: NamedStringEnum(
      {
        public: '全世界から検索可能',
        publiclyAccessible: '公開(検索エンジンには表示しない)',
        linkOnly: 'リンクを知っている人にのみ',
        private: '自分のみ',
      },
      {
        title: '公開範囲',
        description: '公開範囲を設定します。',
      },
    ),
    price: Type.Optional(
      Type.Number({
        title: '価格',
        description: '価格を設定します。',
        minimum: 0,
      }),
    ),
  },
  {
    title: '',
  },
);

const uiSchema = {
  body: {
    'ui:widget': 'textarea',
  },
  tags: {
    'ui:options': {
      widget: 'PillInputWidget',
      punctuation: ',',
      removeOnBackspace: true,
    },
  },
  images: {
    'ui:options': {
      accept: 'image/*',
      filePreview: true,
    },
  },
  thumbnail: {
    'ui:options': {
      accept: 'image/*',
      filePreview: true,
    },
  },
  publishedAt: {
    'ui:widget': 'MantineDateTimeWidget',
  },
  scope: {
    'ui:widget': 'radio',
  },
  price: {
    'ui:options': {
      widget: 'updown',
      props: {
        prefix: '¥',
        thousandSeparator: ',',
      },
    },
  },
};

const examples: Sample = {
  schema: schema,
  uiSchema,
};

export default examples;
