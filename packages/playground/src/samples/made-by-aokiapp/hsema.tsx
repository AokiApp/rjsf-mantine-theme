import { Sample } from '../Sample';
import { Type } from '@sinclair/typebox';
import { NamedNumberEnum, NamedStringEnum, ObjectIfThenElse } from './utils';
import { FieldProps, UiSchema } from '@rjsf/utils';
import { getDefaultRegistry } from '@rjsf/core';

const userIdentInfo = Type.Object(
  {
    lastName: Type.String({
      title: '姓',
    }),
    firstName: Type.String({
      title: '名',
    }),
    lastNameKana: Type.String({
      title: '姓(カナ)',
    }),
    firstNameKana: Type.String({
      title: '名(カナ)',
    }),
    sex: NamedNumberEnum(
      {
        // ISO 5218 conform
        0: '不明',
        1: '男性',
        2: '女性',
        9: 'その他',
      },
      {
        title: '性別',
      },
    ),
    birthDate: Type.String({
      title: '生年月日',
      format: 'date',
    }),
    postalCode: Type.String({
      title: '郵便番号',
      pattern: '^[0-9]{7}$',
    }),
    address: Type.String({
      title: '住所',
    }),
    tel: Type.String({
      title: '電話番号',
      pattern: '^0[0-9]{9,10}$',
    }),
  },
  {
    title: '',
    $id: '#/definitions/userIdentInfo',
  },
);

const definitions = {
  userIdentInfo,
};

const subjectEnum = NamedStringEnum(
  {
    japanese: '国語',
    mathematics: '数学',
    english: '英語',
    science: '理科',
    social: '社会',
  },
  {
    title: '受験科目',
  },
);
const schema = Type.Object(
  {
    basicInfo: Type.Object(
      {
        id: Type.String({
          title: '出願ID',
          description: '出願情報の主キー',
          pattern: '^[0-9]{12}$',
          readOnly: true,
        }),
        createdAt: Type.String({
          title: '申請送達日時',
          description: '申請情報の作成日時',
          format: 'date-time',
          readOnly: true,
        }),
        updatedAt: Type.String({
          title: '最終更新日時',
          description: '申請情報の最終更新日時',
          format: 'date-time',
          readOnly: true,
        }),
      },
      {
        title: '管理情報',
        description: '出願に対する管理上の事項です。',
      },
    ),
    acceptanceInfo: Type.Object(
      {
        acceptedAt: Type.String({
          title: '受理日時',
          description: '受理日時',
          format: 'date-time',
        }),
        status: NamedStringEnum(
          {
            received: '受付',
            awaitingReview: '審査待ち',
            reviewing: '審査中',
            awaitingTreatment: '対応待ち',
            approved: '承認',
            rejected: '却下',
          },
          {
            title: '申請状況',
            description: '申請の状況を選択してください。',
          },
        ),
      },
      {
        title: '受付情報',
        description: '受付に関する情報です。',
      },
    ),
    examinee: Type.Object(
      {
        userIdentInfo: Type.Ref(userIdentInfo, { title: '' }),
        ageOnRequest: Type.Number({
          title: '出願時年齢',
          readOnly: true,
        }),
        ageOnEnter: Type.Number({
          title: '入学時年齢',
          readOnly: true,
        }),
        ageOnGraduate: Type.Number({
          title: '卒業時年齢',
          readOnly: true,
        }),
      },
      { title: '受験者情報', description: '試験を受ける本人の情報を入力してください' },
    ),
    applicant: ObjectIfThenElse(
      Type.Object({
        type: NamedStringEnum(
          {
            sameAsExaminee: '受験者と同じ',
            other: '受験者と異なる',
          },
          {
            title: '申請者の有無',
          },
        ),
      }),
      Type.Object({
        type: Type.Literal('other'),
      }),
      Type.Object({
        userIdentInfo: Type.Ref(userIdentInfo, { title: '' }),
      }),
      {
        title: '申請者情報',
        description: '本申請書を提出し、連絡や書類の返送を受けるための連絡先を入力してください',
      },
    ),

    guardian: ObjectIfThenElse(
      Type.Object({
        type: NamedStringEnum(
          {
            independent: 'なし(独立生計主)',
            sameAsApplicant: '申請者と同じ',
            other: '申請者と異なる',
          },
          { title: '保護者の有無' },
        ),
      }),
      Type.Object({
        type: Type.Literal('other'),
      }),
      Type.Object({
        userIdentInfo: Type.Ref(userIdentInfo, { title: '' }),
      }),
      {
        title: '保護者情報',
        description: '保護者または成年後見人の情報を入力してください',
      },
    ),

    applicationInfo: Type.Object(
      {
        school: Type.String({
          title: '学校名',
        }),
        schoolCode: Type.String({
          title: '学校コード',
          pattern: '^[0-9]{8}$',
        }),
        department: Type.String({
          title: '学部/コース名',
          examples: ['普通科'],
        }),
        subdepartment: Type.Optional(
          Type.String({
            title: '学科/専攻等名',
          }),
        ),
        departmentCode: Type.String({
          title: '学科/専攻等コード',
          pattern: '^[0-9]{4}$',
        }),
        entranceType: NamedNumberEnum(
          {
            0: '一般入学',
            1: '編入学',
            2: '留学生入学',
            3: 'その他',
          },
          {
            title: '入学種別',
            examples: [0],
          },
        ),
        enterAt: Type.String({
          title: '入学年月',
          format: 'date',
        }),
        graduateAt: Type.String({
          title: '卒業年月',
          format: 'date',
        }),
      },
      {
        title: '出願情報',
        description: '申請書に記載される出願に関する情報を入力してください。',
      },
    ),
    examinationInfo: Type.Object(
      {
        room: Type.String({
          title: '試験会場',
        }),
        date: Type.String({
          title: '試験日',
          format: 'date',
        }),
        subject: Type.Array(subjectEnum, {
          title: '受験科目',
          description: '受験する科目を選択してください。',
          uniqueItems: true,
        }),
        subjQuestions: Type.Array(
          Type.Object({
            subject: subjectEnum,
            question: Type.String({
              title: '問題番号',
            }),
          }),
          {
            title: '受験科目と問題番号',
            description: '受験する科目と問題番号を入力してください。',
            uniqueItems: true,
          },
        ),
      },
      {
        title: '試験情報',
        description: '当日の試験に関する情報を入力してください。',
      },
    ),
    handicap: Type.Object(
      {
        isMild: Type.Optional(
          Type.Boolean({
            title: '軽症者特例',
            description: '軽症者特例を適用しますか?',
          }),
        ),
        vision: Type.Optional(
          NamedStringEnum(
            {
              braille: '点字、通常(点字回答,時間延長1.5x、通常ICプレイヤー使用)',
              brailleWithHelp: '点字、介助(点字回答,時間延長1.5x、試験監督CDプレイヤー使用)',
              lowVision: '低視力、通常(文字回答,時間延長1.3x、通常ICプレイヤー使用)',
              lowVisionWithHelp: '低視力、介助(文字回答,時間延長1.3x、試験監督CDプレイヤー使用)',
              lowVisionUtil: '視覚機能障害(文字回答,時間延長1.3x)',
              other: 'その他',
            },
            {
              title: '視覚',
            },
          ),
        ),
        hearing: Type.Optional(
          NamedStringEnum(
            {
              lowHearing: '60dB未満(リスニング免除)',
              other: 'その他',
            },
            {
              title: '聴覚',
            },
          ),
        ),
        physical: Type.Optional(
          NamedStringEnum(
            {
              checkAnsExt: 'チェック回答+延長',
              checkAns: 'チェック回答',
              agentExt: '代理回答+延長',
              agent: '代理回答',
              other: 'その他',
            },
            {
              title: '肢体不自由',
            },
          ),
        ),
        developmental: Type.Optional(
          NamedStringEnum(
            {
              other: 'その他',
            },
            {
              title: '発達障害',
            },
          ),
        ),
        needPreExamHelp: Type.Boolean({
          title: '試験前の配慮',
          description: '試験前に配慮が必要ですか?',
          default: true,
        }),
        description: Type.Optional(
          Type.String({
            title: '障害の特徴に関する自由記述欄',
            description: '障害について記入してください。',
          }),
        ),
        helps: Type.Optional(
          Type.String({
            title: '配慮内容に関する自由記述欄',
            description: '配慮内容について記入してください。',
          }),
        ),
      },
      {
        title: '配慮の有無',
        description: '受験上の配慮についての情報を入力してください。',
      },
    ),
    fee: Type.Object(
      {
        autoCalcValue: Type.Number({
          title: '自動計算額',
          readOnly: true,
        }),
        value: Type.Number({
          title: '金額',
        }),
        exception: Type.Array(
          NamedStringEnum({
            1: '障害者',
            2: '指定難病',
            3: '小児慢性',
            4: '世帯按分',
            5: '指定難病(都道府県指定)',
            6: '住民税非課税世帯',
            7: '低所得ランク',
            8: 'その他',
          }),
          {
            uniqueItems: true,
            title: '特例',
          },
        ),
      },
      {
        title: '受験料等',
        description: '受験料等に関する情報を入力してください。',
      },
    ),
    delay: ObjectIfThenElse(
      Type.Object({
        delayed: Type.Boolean({
          title: '遅延ですか?',
          description: '期日を過ぎた後の提出であれば選択してください。',
        }),
      }),
      Type.Object({
        delayed: Type.Literal(true),
      }),
      Type.Object({
        reason: Type.String({
          title: '遅延理由',
          description: '遅延の理由を選択してください。',
          examples: [
            '必要書類の送達遅延のため',
            '症状の悪化等により、申請書類の準備や提出に時間を要したため',
            '大規模災害に被災したこと等により、申請書類の提出に時間を要したため',
            'その他(記入して下さい)',
          ],
        }),
      }),
      {
        title: '遅延出願',
      },
    ),
    memo: Type.Object(
      {
        items: Type.Array(
          Type.Object({
            operatorName: Type.String({
              title: '操作者名',
            }),
            content: Type.String({
              title: '内容',
            }),
          }),
          {
            title: 'メモアイテム',
            description: 'メモのアイテムです。',
          },
        ),
      },
      {
        title: 'メモ・申し送り',
        description: '操作者別のメモや申し送りです。',
      },
    ),
  },
  {
    definitions,
  },
);

function UserIdentInfoField(props: FieldProps) {
  const ObjectField = getDefaultRegistry().fields.ObjectField;
  const newProps = {
    ...props,
    uiSchema: {
      ...props.uiSchema,
      'ui:classNames': classes.rowDir,
      address: {
        'ui:classNames': classes.fullWidth,
      },
    },
  };
  return <ObjectField {...newProps} />;
}

import classes from './components/hsema.module.css';

const uiSchema: UiSchema = {
  basicInfo: {
    'ui:classNames': classes.rowDir,
    id: {
      'ui:classNames': classes.fullWidth,
    },
  },
  acceptanceInfo: {
    'ui:classNames': classes.rowDir,
  },
  examinee: {
    'ui:classNames': classes.rowDir,
  },
  applicant: {
    'ui:widget': 'radio',
  },
  applicationInfo: {
    'ui:classNames': classes.rowDir,
    school: {
      'ui:classNames': classes.fullWidth,
    },
  },
  examinationInfo: {
    subjQuestions: {
      items: {
        'ui:classNames': classes.rowDir,
      },
    },
  },
  handicap: {
    description: {
      'ui:widget': 'textarea',
    },
    helps: {
      'ui:widget': 'textarea',
    },
  },
  fee: {
    'ui:classNames': classes.rowDir,
    exception: {
      'ui:widget': 'checkboxes',
    },
  },
  memo: {
    items: {
      items: {
        content: {
          'ui:widget': 'textarea',
        },
      },
    },
  },
};

const examples: Sample = {
  schema: schema,
  uiSchema,
  fields: { '#/definitions/userIdentInfo': UserIdentInfoField },
};

export default examples;
