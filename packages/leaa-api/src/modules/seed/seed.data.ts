/* eslint-disable max-len */
// prettier-ignore
import { Article } from '@leaa/common/entrys';
import { CreateArticleInput } from '@leaa/common/dtos/article';
import { CreateCategoryInput } from '@leaa/common/dtos/category';
import { CreateAxInput } from '@leaa/common/dtos/ax';
import { CreateSettingInput } from '@leaa/common/dtos/setting';

export const permissionsSeed = [
  { name: 'Playground', slug: 'playground.root' },
  { name: 'Test', slug: 'test.root' },
  { name: 'Lab', slug: 'lab.root' },
  //
  { name: 'User List', slug: 'user.list' },
  { name: 'User Item', slug: 'user.item' },
  { name: 'User Create', slug: 'user.create' },
  { name: 'User Update', slug: 'user.update' },
  { name: 'User Delete', slug: 'user.delete' },
  //
  { name: 'Role List', slug: 'role.list' },
  { name: 'Role Item', slug: 'role.item' },
  { name: 'Role Create', slug: 'role.create' },
  { name: 'Role Update', slug: 'role.update' },
  { name: 'Role Delete', slug: 'role.delete' },
  //
  { name: 'Permission List', slug: 'permission.list' },
  { name: 'Permission Item', slug: 'permission.item' },
  { name: 'Permission Create', slug: 'permission.create' },
  { name: 'Permission Update', slug: 'permission.update' },
  { name: 'Permission Delete', slug: 'permission.delete' },
  //
  { name: 'Category List', slug: 'category.list' },
  { name: 'Category Item', slug: 'category.item' },
  { name: 'Category Create', slug: 'category.create' },
  { name: 'Category Update', slug: 'category.update' },
  { name: 'Category Delete', slug: 'category.delete' },
  //
  { name: 'Article List', slug: 'article.list' },
  { name: 'Article Item', slug: 'article.item' },
  { name: 'Article Create', slug: 'article.create' },
  { name: 'Article Update', slug: 'article.update' },
  { name: 'Article Delete', slug: 'article.delete' },
  //
  { name: 'Ax List', slug: 'ax.list' },
  { name: 'Ax Item', slug: 'ax.item' },
  { name: 'Ax Create', slug: 'ax.create' },
  { name: 'Ax Update', slug: 'ax.update' },
  { name: 'Ax Delete', slug: 'ax.delete' },
  //
  { name: 'Attachment List', slug: 'attachment.list' },
  { name: 'Attachment Item', slug: 'attachment.item' },
  { name: 'Attachment Create', slug: 'attachment.create' },
  { name: 'Attachment Update', slug: 'attachment.update' },
  { name: 'Attachment Delete', slug: 'attachment.delete' },
  //
  { name: 'Setting List', slug: 'setting.list' },
  { name: 'Setting Item', slug: 'setting.item' },
  { name: 'Setting Create', slug: 'setting.create' },
  { name: 'Setting Update', slug: 'setting.update' },
  { name: 'Setting Delete', slug: 'setting.delete' },
];

// prettier-ignore
export const rolesSeed = [
  { name: 'Admin', slug: 'admin' },
  { name: 'Staff', slug: 'staff' },
  { name: 'Attachment Manager', slug: 'attachment-manager' },
];

// prettier-ignore
export const usersSeed = [
  { email: 'admin@leaa.com', name: 'admin', password: 'h8Hx9qvPKoHMLQgj', status: 1 },
  { email: 'staff@leaa.com', name: 'staff', password: '7PkQGjvHMMkoo4RZ', status: 1 },
  { email: 'disabled@leaa.com', name: 'disabled', password: 'uUB3YGrdL3gJZYij', status: 0 },
];

const randomSersSeedData = [];

for (let i = 0; i < 50; i += 1) {
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
  { roleSlug: 'attachment-manager', permissionSlugs: permissionsSeed.filter(p => p.slug.includes('attachment.')).map(p => p.slug) },
];

// prettier-ignore
export const userAddRolesSeed = [
  { userEmail: 'admin@leaa.com', roleSlugs: ['admin', 'staff', 'attachment-manager'] },
  { userEmail: 'staff@leaa.com', roleSlugs: ['staff', 'attachment-manager'] },
];

// prettier-ignore
export const categorySeed: CreateCategoryInput[] = [
  { parent_id: 0, name: 'Article', description: '文章分类', slug: 'article' },
  { parent_id: 0, name: 'Help', description: '帮助中心', slug: 'help' },
];

// prettier-ignore
export const articleSeed: CreateArticleInput[] = [
  { title: 'Sample Article', description: 'Sample Article Description', category_id: 1, content: `<p>JUST A SAMPLE ARTICLE</p><br /><br /><br /><br /><br /><p>---- EOF ----</p>`, slug: 'demo-article', status: 1 },
  { title: '哈喽，Leaa', description: `Hello, World 是指在计算机屏幕显示 “Hello, World!”（你好，世界！）字符串的计算机程序。相关的程序通常都是每种计算机<a href="https://zh.wikipedia.org/wiki/%E7%B7%A8%E7%A8%8B%E8%AA%9E%E8%A8%80" class="mw-redirect">编程语言</a>最基本、最简单的程序，也会用作示范一个编程语言如何运作。同时它亦可以用来确认一个编程语言的<a href="https://zh.wikipedia.org/wiki/%E7%B7%A8%E8%AD%AF%E5%99%A8">编译器</a>、程序开发环境及<a href="https://zh.wikipedia.org/wiki/%E9%81%8B%E8%A1%8C%E7%92%B0%E5%A2%83" class="mw-redirect">运行环境</a>是否已经安装妥当。因为写法简单可见，这也是很多初学者首次接触编程语言时会撰写的程序。`, category_id: 1, content: `<p>Hello, World 是指在计算机屏幕显示 “Hello, World!”（你好，世界！）字符串的计算机程序。相关的程序通常都是每种计算机<a href="https://zh.wikipedia.org/wiki/%E7%B7%A8%E7%A8%8B%E8%AA%9E%E8%A8%80" class="mw-redirect">编程语言</a>最基本、最简单的程序，也会用作示范一个编程语言如何运作。同时它亦可以用来确认一个编程语言的<a href="https://zh.wikipedia.org/wiki/%E7%B7%A8%E8%AD%AF%E5%99%A8">编译器</a>、程序开发环境及<a href="https://zh.wikipedia.org/wiki/%E9%81%8B%E8%A1%8C%E7%92%B0%E5%A2%83" class="mw-redirect">运行环境</a>是否已经安装妥当。因为写法简单可见，这也是很多初学者首次接触编程语言时会撰写的程序。</p><p></p><p></p><div class="media-wrap image-wrap"><img class="media-wrap image-wrap" alt="hello world" src="https://upload.wikimedia.org/wikipedia/commons/2/21/Hello_World_Brian_Kernighan_1978.jpg"/></div><p></p><p></p><p></p><h2 id="a95ou">历史</h2><p style="text-align:start;text-indent:2em;">于1972年，<a href="https://zh.wikipedia.org/wiki/%E8%B2%9D%E7%88%BE%E5%AF%A6%E9%A9%97%E5%AE%A4" class="mw-redirect">贝尔实验室</a>成员<a href="https://zh.wikipedia.org/wiki/%E5%B8%83%E8%90%8A%E6%81%A9%C2%B7%E6%9F%AF%E6%9E%97%E6%BC%A2">布莱恩·柯林汉</a>撰写的内部技术文件《A Tutorial Introduction to the Language B》首次提到了 Hello World 这字符串。当时，他使用<a href="https://zh.wikipedia.org/wiki/B%E8%AA%9E%E8%A8%80">B语言</a>撰写了第一个使用参数的Hello World相关程序：</p><p></p><pre data-lang="javascript" class="lang-javascript"><code class="lang-javascript">main(){<br/>  extrn a,b,c;<br/>  putchar(a); putchar(b); putchar(c); putchar(&#x27;!*n&#x27;);<br/>  }<br/><br/>a &#x27;hell&#x27;;<br/>b &#x27;o, w&#x27;;<br/>c &#x27;orld&#x27;;</code></pre><p><br/>由 <a href="https://zh.wikipedia.org/wiki/%E5%B8%83%E8%90%8A%E6%81%A9%C2%B7%E6%9F%AF%E6%9E%97%E6%BC%A2">布莱恩·柯林汉</a> 撰写的“Hello, world”程序 (1978年)</p><p style="text-align:start;text-indent:2em;">这个程序成为了第一个Hello World的示范程序。之所以会这样切割，是因为于B语言中，每个参数只能放置四个<a href="https://zh.wikipedia.org/wiki/ASCII">ASCII</a>字符<sup><a href="https://zh.wikipedia.org/wiki/Hello_World#cite_note-langb-5">[5]</a></sup>。两年后，布莱恩·柯林汉和<a href="https://zh.wikipedia.org/wiki/%E4%B8%B9%E5%B0%BC%E6%96%AF%C2%B7%E9%87%8C%E5%A5%87">丹尼斯·里奇</a>基于B语言写成<a href="https://zh.wikipedia.org/wiki/C%E8%AA%9E%E8%A8%80" class="mw-redirect">C语言</a>后，在他们撰写的《<a href="https://zh.wikipedia.org/wiki/C%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%E8%AF%AD%E8%A8%80_(%E4%B9%A6)">C程序设计语言</a>》使用更简单的方式展示Hello World:</p><p></p><pre data-lang="javascript" class="lang-javascript"><code class="lang-javascript">#include &lt;stdio.h&gt;  main( ) {         printf(&quot;hello, world\\n&quot;); } </code></pre><p></p><p style="text-align:start;text-indent:2em;">自此，Hello World 成为了计算机程序员学习新的编程语言的传统。但是，有些人认为 <em>hello, world</em> 的字符串早于1966 年的 BCPL语言出现的时候已经出现。虽然相关的字词确实在发明者记录的文件出现，但是可以肯定的是，Hello World 这字符串于当时确实未变得流行。因此，人们公认为<a href="https://zh.wikipedia.org/wiki/%E5%B8%83%E8%90%8A%E6%81%A9%C2%B7%E6%9F%AF%E6%9E%97%E6%BC%A2">布莱恩·柯林汉</a>是令相关字符串走进公众目光的人。</p><p style="text-align:start;text-indent:2em;">但是需要注意的是，Hello World 的初始写法为 “hello, world”，并没有任何感叹号，全部都是小写，内含逗号，后面亦有空格，而和现在流行的写法并不一致。</p><p></p><p></p><p></p><h2 id="6go16">派生影响</h2><p></p><h3 id="1jh40"><strong>对计算机文化的影响</strong></h3><p style="text-align:start;text-indent:2em;"><a href="https://zh.wikipedia.org/wiki/Debian">Debian</a> 以及系统的<a href="https://zh.wikipedia.org/wiki/%E9%80%B2%E9%9A%8E%E5%8C%85%E8%A3%9D%E5%B7%A5%E5%85%B7" class="mw-redirect">高级包装工具</a>当中包含了 “hello, world” 安装工具。用户只需要于终端（Linux 系统的Terminal）输入“apt-get install hello”便能够安装此工具及其相关部件。虽然看似没用，但却可作为测试工具使用。同时，这亦能够向新用户展示安装工具的方法。对开发者来说，这个工具展现了创建<a href="https://zh.wikipedia.org/wiki/.deb" class="mw-redirect">.deb</a>安装工具的方法。这个工具，连同 GNU Hello 便成为了撰写 GNU 程序的教学软件。</p><p></p><p></p><h3 id="ejihs"><strong>对其他电子产品的影响</strong></h3><p style="text-align:start;text-indent:2em;">虽然 Hello World 在<a href="https://zh.wikipedia.org/wiki/%E5%96%AE%E6%99%B6%E7%89%87" class="mw-redirect">单片机</a>微计算机、<a href="https://zh.wikipedia.org/wiki/%E7%8E%B0%E5%9C%BA%E5%8F%AF%E7%BC%96%E7%A8%8B%E9%80%BB%E8%BE%91%E9%97%A8%E9%98%B5%E5%88%97">现场可编程逻辑门阵列</a>及<a href="https://zh.wikipedia.org/wiki/%E8%A4%87%E9%9B%9C%E5%8F%AF%E7%A8%8B%E5%BC%8F%E9%82%8F%E8%BC%AF%E8%A3%9D%E7%BD%AE" class="mw-redirect">复杂可编程逻辑器件</a>中不能展现出来，一盏细小的微型 LED 灯会代替 Hello World 的作用，以表示安装成功、相关程序功能已实现。</p><p><br/></p><h3 id="clkc1"><strong>对流行文化的影响</strong></h3><p style="text-align:start;text-indent:2em;">Hello World 已经成为流行文化的一部分，例如以 Hello World 命名首个运用纯人工智能完成的专辑。同时，亦有若干公司以 Hello World 命名，例如位于澳州的 Helloworld 旅游公司、Hello World Consulting 等。</p><p></p><p></p>`, slug: 'hello-leaa', status: 1 },
];

// prettier-ignore
export const axSeed: CreateAxInput[] = [
  { title: 'Index Swiper', description: '首页滚动图', slug: 'index-swiper', status: 1 },
  { title: 'Index Grid', description: '首页方块图', slug: 'index-grid', status: 0 },
];

// prettier-ignore
// export const attachmentSeed: CreateAttachmentInput[] = [
//   {
//     uuid: '6db325c5-9c95-4952-94eb-eef33b2e08a7',
//     title: 'IMG_2317@2x',
//     alt: 'IMG_2317@2x',
//     type: 'image',
//     filename: '6db325c5-9c95-4952-94eb-eef33b2e08a7.jpg',
//     moduleName: 'ax',
//     moduleId: 1,
//     moduleType: 'banner_mb',
//     ext: '.jpg',
//     width: 1200,
//     height: 600,
//     size: 151768,
//     path: '/attachments/2019/08/6db325c5-9c95-4952-94eb-eef33b2e08a7.jpg',
//     at2x: 1,
//     in_local: 0,
//     in_oss: 0,
//     sort: 0,
//     status: 1,
//   },
//   {
//     uuid: 'bb9acfdc-86a1-43ca-afeb-260161455b72',
//     title: 'IMG_2317@2x',
//     alt: 'IMG_2317@2x',
//     type: 'image',
//     filename: 'bb9acfdc-86a1-43ca-afeb-260161455b72.jpg',
//     moduleName: 'ax',
//     moduleId: 1,
//     moduleType: 'banner_mb',
//     ext: '.jpg',
//     width: 1200,
//     height: 600,
//     size: 151768,
//     path: '/attachments/2019/08/bb9acfdc-86a1-43ca-afeb-260161455b72.jpg',
//     at2x: 1,
//     in_local: 0,
//     in_oss: 0,
//     sort: 0,
//     status: 1,
//   },
// ];

// prettier-ignore
export const settingSeed: CreateSettingInput[] = [
  { name: 'Site Name', slug: 'site_name', type: 'input', sort: 1, value: 'Leaa', description: '站点名，最大 220 字' },
  { name: 'Site Description', slug: 'site_description', type: 'textarea', sort: 1, value: 'Leaa - project 1h 4 1d',  description: '站点描述， 最大 220 字' },
  { name: 'Site Keywords', slug: 'site_keywords', type: 'input', sort: 1, value: 'Leaa, mono-repo, C\'est la vie. project 1h 4 1d', description: '站点关键字，使用英文 , 分隔' },
];
