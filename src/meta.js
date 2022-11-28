
// {
//     TempWord.headWord, // 单词
//     TempWord.tranCN, // 翻译
//     TempWord.ukPhone, // 英音
//     TempWord.usPhone, // 美音
//     TempWord.pos, // 词性
//     TempWord.phrase, // 短语
//     TempWord.phraseCN, // 短语翻译
//     TempWord.sentence, // 例句
//     TempWord.sentenceCN, // 例句翻译
//     TempWord.question, // 问题
//     TempWord.explain, // 问题翻译
//     TempWord.choiceIndexOne, // 选项A
//     TempWord.choiceIndexTwo, // 选项B
//     TempWord.choiceIndexThree, // 选项C
//     TempWord.choiceIndexFour, // 选项D
//     TempWord.rightIndex, // 正确答案
// };




export const TABLE_NAME = "CET4_1";  // 当前书籍名字
export const WORD_NUMBER = 10;  // 当前单词数量
export const ENG_TYPE = 2;  // 英语类型1：美语，2：英语
export const AUTO_PLAY = 1;  // 英语自动发音


export const booksMap = [
    ["CET4_1", "四级核心词汇"],
    ["CET4_3", "四级完整词汇"],
    ["CET6_1", "六级核心词汇"],
    ["CET6_3", "六级完整词汇"],
    ["GMAT_3", "GMAT词汇"],
    ["GRE_2", "GRE词汇"],
    ["IELTS_3", "IELTS词汇"],
    ["TOEFL_2", "TOEFL词汇"],
    ["SAT_2", "SAT词汇"],
    ["KaoYan_1", "考研必考词汇"],
    ["KaoYan_2", "考研完整词汇"],
    ["Level4_1", "专四真题高频词"],
    ["Level4luan_2", "专四核心词汇"],
    ["Level8_1", "专八真题高频词"],
    ["Level8luan_2", "专八核心词汇"],
];
