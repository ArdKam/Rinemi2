export type Gloss = { fa: string; en: string };
export type Example = { word: string; reading: string; fa: string; en: string };

// Editorial seed content only. Independent human review is required before public release.
export const PERSIAN_GLOSSES: Record<string, Gloss> = {
  "日": { fa: "خورشید؛ روز", en: "sun; day" },
  "一": { fa: "یک", en: "one" },
  "国": { fa: "کشور", en: "country" },
  "会": { fa: "دیدار؛ جلسه", en: "meeting; gather" },
  "人": { fa: "انسان؛ شخص", en: "person" },
  "年": { fa: "سال", en: "year" },
  "大": { fa: "بزرگ", en: "large; big" },
  "十": { fa: "ده", en: "ten" },
  "二": { fa: "دو", en: "two" },
  "本": { fa: "کتاب؛ ریشه", en: "book; origin" },
  "中": { fa: "داخل؛ میانه", en: "inside; middle" },
  "長": { fa: "بلند؛ طولانی", en: "long" },
  "出": { fa: "بیرون‌آمدن؛ خروج", en: "exit; go out" },
  "三": { fa: "سه", en: "three" },
  "同": { fa: "یکسان؛ مشابه", en: "same; equal" },
  "時": { fa: "زمان؛ ساعت", en: "time; hour" },
  "事": { fa: "موضوع؛ کار", en: "matter; thing" },
  "自": { fa: "خود", en: "oneself" },
  "行": { fa: "رفتن؛ انجام‌دادن", en: "go; carry out" },
  "社": { fa: "شرکت؛ زیارتگاه", en: "company; shrine" },
  "見": { fa: "دیدن", en: "see; look" },
  "月": { fa: "ماه", en: "moon; month" },
  "金": { fa: "طلا؛ پول", en: "gold; money" },
  "学": { fa: "یادگیری؛ تحصیل", en: "study; learning" },
  "生": { fa: "زندگی؛ تولد", en: "life; birth" },
  "前": { fa: "جلو؛ پیش", en: "before; front" },
  "後": { fa: "بعد؛ پشت", en: "after; behind" },
  "東": { fa: "شرق", en: "east" },
  "水": { fa: "آب", en: "water" },
  "山": { fa: "کوه", en: "mountain" },
  "川": { fa: "رودخانه", en: "river" },
  "木": { fa: "درخت؛ چوب", en: "tree; wood" },
  "火": { fa: "آتش", en: "fire" },
  "雨": { fa: "باران", en: "rain" },
  "花": { fa: "گل", en: "flower" },
  "食": { fa: "خوردن؛ غذا", en: "eat; food" },
  "読": { fa: "خواندن", en: "read" },
  "書": { fa: "نوشتن", en: "write" },
  "語": { fa: "زبان؛ واژه", en: "language; word" },
  "電": { fa: "برق", en: "electricity" },
  "車": { fa: "خودرو؛ وسیلهٔ نقلیه", en: "car; vehicle" },
  "道": { fa: "راه؛ مسیر", en: "road; way" },
  "今": { fa: "اکنون؛ حالا", en: "now" },
  "家": { fa: "خانه؛ خانواده", en: "house; family" }
};

export const STARTER_CHARACTERS = [
  "日", "一", "国", "会", "人", "年", "大", "十", "二", "本",
  "中", "長", "出", "三", "同", "時", "事", "自", "行", "社",
  "見", "月", "金", "学", "生", "前", "後", "東", "水", "山",
  "川", "木", "火", "雨", "花", "食", "読", "書", "語", "電",
  "車", "道", "今", "家"
] as const;

export const EXAMPLES: Record<string, Example[]> = {
  "日": [
    { word: "日本", reading: "にほん", fa: "ژاپن", en: "Japan" },
    { word: "毎日", reading: "まいにち", fa: "هر روز", en: "every day" }
  ],
  "一": [{ word: "一つ", reading: "ひとつ", fa: "یک چیز", en: "one thing" }],
  "国": [{ word: "外国", reading: "がいこく", fa: "کشور خارجی", en: "foreign country" }],
  "会": [
    { word: "会う", reading: "あう", fa: "ملاقات کردن", en: "to meet" },
    { word: "会社", reading: "かいしゃ", fa: "شرکت", en: "company" }
  ],
  "人": [{ word: "日本人", reading: "にほんじん", fa: "فرد ژاپنی", en: "Japanese person" }],
  "年": [{ word: "今年", reading: "ことし", fa: "امسال", en: "this year" }],
  "大": [{ word: "大きい", reading: "おおきい", fa: "بزرگ", en: "big" }],
  "十": [
    { word: "十", reading: "じゅう", fa: "ده", en: "ten" },
    { word: "十月", reading: "じゅうがつ", fa: "ماه اکتبر", en: "October" }
  ],
  "二": [{ word: "二つ", reading: "ふたつ", fa: "دو چیز", en: "two things" }],
  "本": [
    { word: "本屋", reading: "ほんや", fa: "کتاب‌فروشی", en: "bookstore" },
    { word: "日本", reading: "にほん", fa: "ژاپن", en: "Japan" }
  ],
  "中": [{ word: "中", reading: "なか", fa: "داخل؛ میان", en: "inside; middle" }],
  "長": [{ word: "長い", reading: "ながい", fa: "بلند؛ طولانی", en: "long" }],
  "出": [{ word: "出口", reading: "でぐち", fa: "خروجی", en: "exit" }],
  "三": [{ word: "三つ", reading: "みっつ", fa: "سه چیز", en: "three things" }],
  "同": [{ word: "同じ", reading: "おなじ", fa: "یکسان", en: "same" }],
  "時": [{ word: "時間", reading: "じかん", fa: "زمان؛ مدت", en: "time; duration" }],
  "事": [
    { word: "事", reading: "こと", fa: "موضوع؛ مسئله", en: "matter; thing" },
    { word: "仕事", reading: "しごと", fa: "کار؛ شغل", en: "work; job" }
  ],
  "自": [{ word: "自分", reading: "じぶん", fa: "خود", en: "oneself" }],
  "行": [{ word: "行く", reading: "いく", fa: "رفتن", en: "to go" }],
  "社": [
    { word: "神社", reading: "じんじゃ", fa: "زیارتگاه شینتو", en: "Shinto shrine" },
    { word: "会社", reading: "かいしゃ", fa: "شرکت", en: "company" }
  ],
  "見": [{ word: "見る", reading: "みる", fa: "دیدن", en: "to see" }],
  "月": [{ word: "月", reading: "つき", fa: "ماه", en: "moon; month" }],
  "金": [
    { word: "金", reading: "きん", fa: "طلا", en: "gold" },
    { word: "お金", reading: "おかね", fa: "پول", en: "money" }
  ],
  "学": [
    { word: "学ぶ", reading: "まなぶ", fa: "یاد گرفتن", en: "to learn" },
    { word: "学校", reading: "がっこう", fa: "مدرسه", en: "school" }
  ],
  "生": [
    { word: "生きる", reading: "いきる", fa: "زندگی کردن", en: "to live" },
    { word: "学生", reading: "がくせい", fa: "دانش‌آموز؛ دانشجو", en: "student" }
  ],
  "前": [{ word: "午前", reading: "ごぜん", fa: "قبل از ظهر", en: "morning; a.m." }],
  "後": [{ word: "午後", reading: "ごご", fa: "بعدازظهر", en: "afternoon; p.m." }],
  "東": [
    { word: "東", reading: "ひがし", fa: "شرق", en: "east" },
    { word: "東京", reading: "とうきょう", fa: "توکیو", en: "Tokyo" }
  ],
  "水": [{ word: "水", reading: "みず", fa: "آب", en: "water" }],
  "山": [{ word: "山", reading: "やま", fa: "کوه", en: "mountain" }],
  "川": [{ word: "川", reading: "かわ", fa: "رودخانه", en: "river" }],
  "木": [{ word: "木", reading: "き", fa: "درخت؛ چوب", en: "tree; wood" }],
  "火": [{ word: "火", reading: "ひ", fa: "آتش", en: "fire" }],
  "雨": [{ word: "雨", reading: "あめ", fa: "باران", en: "rain" }],
  "花": [{ word: "花", reading: "はな", fa: "گل", en: "flower" }],
  "食": [
    { word: "食べ物", reading: "たべもの", fa: "غذا", en: "food" },
    { word: "食べる", reading: "たべる", fa: "خوردن", en: "to eat" }
  ],
  "読": [{ word: "読む", reading: "よむ", fa: "خواندن", en: "to read" }],
  "書": [{ word: "書く", reading: "かく", fa: "نوشتن", en: "to write" }],
  "語": [
    { word: "単語", reading: "たんご", fa: "واژه", en: "word" },
    { word: "日本語", reading: "にほんご", fa: "زبان ژاپنی", en: "Japanese language" }
  ],
  "電": [
    { word: "電気", reading: "でんき", fa: "برق", en: "electricity" },
    { word: "電車", reading: "でんしゃ", fa: "قطار برقی", en: "train" }
  ],
  "車": [{ word: "車", reading: "くるま", fa: "خودرو", en: "car" }],
  "道": [{ word: "道", reading: "みち", fa: "راه؛ مسیر", en: "road; way" }],
  "今": [{ word: "今", reading: "いま", fa: "اکنون", en: "now" }],
  "家": [
    { word: "家", reading: "いえ", fa: "خانه", en: "house" },
    { word: "家族", reading: "かぞく", fa: "خانواده", en: "family" }
  ]
};