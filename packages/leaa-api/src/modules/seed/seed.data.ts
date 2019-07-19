// prettier-ignore
import { Article } from '@leaa/common/entrys';
import { CreateArticleInput } from '@leaa/common/dtos/article';
import { CreateCategoryInput } from '@leaa/common/dtos/category';

export const permissionsSeed = [
  { name: 'Playground', slug: 'playground.root' },
  //
  { name: 'User List', slug: 'user.footerMenu-list' },
  { name: 'User Item', slug: 'user.footerMenu-item' },
  { name: 'User Create', slug: 'user.create' },
  { name: 'User Update', slug: 'user.update' },
  { name: 'User Delete', slug: 'user.delete' },
  //
  { name: 'Role List', slug: 'role.footerMenu-list' },
  { name: 'Role Item', slug: 'role.footerMenu-item' },
  { name: 'Role Create', slug: 'role.create' },
  { name: 'Role Update', slug: 'role.update' },
  { name: 'Role Delete', slug: 'role.delete' },
  //
  { name: 'Permission List', slug: 'permission.footerMenu-list' },
  { name: 'Permission Item', slug: 'permission.footerMenu-item' },
  { name: 'Permission Create', slug: 'permission.create' },
  { name: 'Permission Update', slug: 'permission.update' },
  { name: 'Permission Delete', slug: 'permission.delete' },
  //
  { name: 'Category List', slug: 'category.footerMenu-list' },
  { name: 'Category Item', slug: 'category.footerMenu-item' },
  { name: 'Category Create', slug: 'category.create' },
  { name: 'Category Update', slug: 'category.update' },
  { name: 'Category Delete', slug: 'category.delete' },
  //
  { name: 'Article List', slug: 'article.footerMenu-list' },
  { name: 'Article Item', slug: 'article.footerMenu-item' },
  { name: 'Article Create', slug: 'article.create' },
  { name: 'Article Update', slug: 'article.update' },
  { name: 'Article Delete', slug: 'article.delete' },
];

// prettier-ignore
export const rolesSeed = [
  { name: 'Admin', slug: 'admin' },
  { name: 'Staff', slug: 'staff' },
];

// prettier-ignore
export const usersSeed = [
  { email: 'admin@admin.com', name: 'admin', password: 'h8Hx9qvPKoHMLQgj', status: 1 },
  { email: 'staff@staff.com', name: 'staff', password: '7PkQGjvHMMkoo4RZ', status: 1 },
  { email: 'disabled@disabled.com', name: 'disabled', password: 'uUB3YGrdL3gJZYij', status: 0 },
];

const randomSersSeedData = [];

for (let i = 0; i < 100; i += 1) {
  const name = `RANDOM_USER_${i.toString().padStart(4, '0')}`;

  randomSersSeedData.push({
    email: `${name}@RRRR.com`,
    name,
    password: Math.random()
      .toString(36)
      .slice(-8),
    status: 1,
  });
}

export const randomSersSeed = randomSersSeedData;

// prettier-ignore
export const roleAddPermissionsSeed = [
  { roleSlug: 'admin', permissionSlugs: permissionsSeed.map(p => p.slug) }, // allpermissions
  { roleSlug: 'staff', permissionSlugs: permissionsSeed.filter(p => p.slug.includes('user.')).map(p => p.slug) },
];

// prettier-ignore
export const userAddRolesSeed = [
  { userEmail: 'admin@admin.com', roleSlugs: ['admin', 'staff'] },
  { userEmail: 'staff@staff.com', roleSlugs: ['staff'] },
];

// prettier-ignore
export const categorySeed: CreateCategoryInput[] = [
  { parentId: 0, name: 'Article', description: '文章分类', slug: 'article' },
  { parentId: 0, name: 'Help', description: '帮助中心', slug: 'help' },
];

// prettier-ignore
export const articleSeed: CreateArticleInput[] = [
  { title: '哈喽，Léaa', description: 'Hello, Léaa', content: `<p></p><div class="media-wrap image-wrap"><img class="media-wrap image-wrap" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Constituent_structure_analysis_English_sentence.svg/600px-Constituent_structure_analysis_English_sentence.svg.png"/></div><p></p><p></p><p>当今“语言”一词是英语“language”或者法语“langage”的翻译，它可能源于<a href="https://zh.wikipedia.org/wiki/%E5%8E%9F%E5%A7%8B%E5%8D%B0%E6%AD%90%E8%AA%9E">原始印欧语</a>的*dn̥ǵʰwéh₂s（舌头、说话、语言）、<a href="https://zh.wikipedia.org/wiki/%E6%8B%89%E4%B8%81%E8%AF%AD">拉丁语</a>的“lingua”（舌头、语言）或<a href="https://zh.wikipedia.org/wiki/%E5%8F%A4%E6%B3%95%E8%AA%9E">古法语</a>的“<a href="https://zh.wiktionary.org/wiki/language" class="extiw">language</a>”<a href="https://zh.wikipedia.org/wiki/%E8%AA%9E%E8%A8%80#cite_note-AHD-4">[4]</a>。</p><p></p><p></p><h2 id="6pm56">Ahoy?</h2><p>&quot;Ahoy,&quot; it turns out, had been around longer — at least 100 years longer — than hello. It too was a greeting, albeit a nautical one, derived from the Dutch &quot;hoi,&quot; meaning &quot;hello.&quot; Bell felt so strongly about &quot;ahoy&quot; he used it for the rest of his life.</p><p></p><p></p><h2 id="4rfg5">起源</h2><p>詳細は「<a href="https://ja.wikipedia.org/wiki/%E8%A8%80%E8%AA%9E%E3%81%AE%E8%B5%B7%E6%BA%90">言語の起源</a>」を参照</p><p style="text-align:start;text-indent:2em;">言語がいつどのように生まれたのか、生まれたのが地球上の一ヶ所か複数ヶ所かはわかっておらず、複数の説が存在するが、例えば<a href="https://ja.wikipedia.org/wiki/%E3%83%87%E3%83%B3%E3%83%9E%E3%83%BC%E3%82%AF">デンマーク</a>の言語学者<a href="https://ja.wikipedia.org/wiki/%E3%82%AA%E3%83%83%E3%83%88%E3%83%BC%E3%83%BB%E3%82%A4%E3%82%A7%E3%82%B9%E3%83%9A%E3%83%AB%E3%82%BB%E3%83%B3">オットー・イェスペルセン</a>は、以下のような説を唱えている。</p><table ><tr><td style="text-align:center;" colSpan="1" rowSpan="1">プープー説 (&quot;Pooh-pooh&quot; theory)</td><td colSpan="1" rowSpan="1">思わず出た声から感情に関する語が出来たもの。<br/>爆笑から&quot;laugh&quot;「わらう」「ショウ（笑）」、嫌う声から&quot;hate&quot;「きらい」「ケン（嫌）」など。</td></tr><tr><td style="text-align:center;" colSpan="1" rowSpan="1">ワンワン説 (&quot;Bow Bow&quot; theory)</td><td colSpan="1" rowSpan="1">鳴き声から動物に関する語が出来たもの。<br/>「モウ～」から&quot;cow&quot;「うし」「ギュウ（牛）」、「ワオ～ン」から&quot;wolf&quot;「おおかみ」「ロウ （狼）」など。</td></tr><tr><td style="text-align:center;" colSpan="1" rowSpan="1">ドンドン説 (&quot;Ding-dong&quot; theory)</td><td colSpan="1" rowSpan="1">音響から自然物に関する語が出来たもの。<br/>「ピカッ！ゴロゴロ」から&quot;thunder&quot;「かみなり」「ライ（雷）」、「ザーッ…」から&quot;water&quot;「みず」「スイ（水）」など。</td></tr><tr><td style="text-align:center;" colSpan="1" rowSpan="1">エイヤコーラ説 (&quot;Yo-he-ho&quot; theory)</td><td colSpan="1" rowSpan="1">かけ声から行動に関する語が出来たもの。<br/>停止を促す声から&quot;stop&quot;「とまる」「テイ（停）」、働く時の声から&quot;work&quot;「はたらく 」「ロウ（労）」など。<br/>この説は、集団行動をとる時の意味の無いはやし歌が、世界各地に残っている事からも裏付けられる。</td></tr></table><p></p><p></p><h2 id="ba9q5">Emoji</h2><p>🎲🥎🚚🔰 </p><p></p><p></p><h2 id="cq9e5">Latin</h2><p>ÅḄĈ</p><p></p><p></p><hr/><p></p><p>---- EOF ----</p><p></p>`, slug: 'hello-leaa', status: 1 },
  { title: '1st article', description: '1st article', content: `<p>JUST A TEST</p><p>---- EOF ----</p>`, slug: '1st-article', status: 1 },
];
