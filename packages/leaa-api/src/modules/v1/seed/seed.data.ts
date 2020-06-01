/* eslint-disable max-len */
// prettier-ignore
import { ArticleCreateOneReq } from '@leaa/common/src/dtos/article';
import { CategoryCreateOneReq } from '@leaa/common/src/dtos/category';
import { AxCreateOneReq } from '@leaa/common/src/dtos/ax';
import { SettingCreateOneReq } from '@leaa/common/src/dtos/setting';
import { IPermissionSlug } from '@leaa/common/src/interfaces';
import { UserCreateOneReq } from '@leaa/common/src/dtos/user';

// TIPS relation file: packages/leaa-api/src/configs/permission.config.ts
export const permissionsSeed: { name: string; slug: IPermissionSlug }[] = [
  { name: 'Playground', slug: 'playground.root' },
  { name: 'Test', slug: 'test.root' },
  { name: 'Lab', slug: 'lab.root' },
  //
  // --------------------------------
  //
  { name: 'User List Read', slug: 'user.list-read' },
  { name: 'User List Read (All User Id)', slug: 'user.list-read--all-user-id' },
  { name: 'User List Read (All Status)', slug: 'user.list-read--all-status' },
  //
  { name: 'User Item Read', slug: 'user.item-read' },
  { name: 'User Item Read (All User Id)', slug: 'user.item-read--all-user-id' },
  { name: 'User Item Read (All Status)', slug: 'user.item-read--all-status' },
  { name: 'User Item Create', slug: 'user.item-create' },
  { name: 'User Item Update', slug: 'user.item-update' },
  { name: 'User Item Delete', slug: 'user.item-delete' },
  //
  // --------------------------------
  //
  { name: 'Role List Read', slug: 'role.list-read' },
  { name: 'Role List Read (All User Id)', slug: 'role.list-read--all-user-id' },
  //
  { name: 'Role Item Read', slug: 'role.item-read' },
  { name: 'Role Item Read (All User Id)', slug: 'role.item-read--all-user-id' },
  { name: 'Role Item Create', slug: 'role.item-create' },
  { name: 'Role Item Update', slug: 'role.item-update' },
  { name: 'Role Item Delete', slug: 'role.item-delete' },
  //
  // --------------------------------
  //
  { name: 'Permission List Read', slug: 'permission.list-read' },
  { name: 'Permission List Read (All User Id)', slug: 'permission.list-read--all-user-id' },
  //
  { name: 'Permission Item Read', slug: 'permission.item-read' },
  { name: 'Permission Item Read (All User Id)', slug: 'permission.item-read--all-user-id' },
  { name: 'Permission Item Create', slug: 'permission.item-create' },
  { name: 'Permission Item Update', slug: 'permission.item-update' },
  { name: 'Permission Item Delete', slug: 'permission.item-delete' },
  //
  // --------------------------------
  //
  { name: 'Category List Read', slug: 'category.list-read' },
  //
  { name: 'Category Item Read', slug: 'category.item-read' },
  { name: 'Category Item Create', slug: 'category.item-create' },
  { name: 'Category Item Update', slug: 'category.item-update' },
  { name: 'Category Item Delete', slug: 'category.item-delete' },
  //
  // --------------------------------
  //
  { name: 'Article List Read', slug: 'article.list-read' },
  { name: 'Article List Read (All User Id)', slug: 'article.list-read--all-user-id' },
  { name: 'Article List Read (All Status)', slug: 'article.list-read--all-status' },
  //
  { name: 'Article Item Read', slug: 'article.item-read' },
  { name: 'Article Item Read (All User Id)', slug: 'article.item-read--all-user-id' },
  { name: 'Article Item Read (All Status)', slug: 'article.item-read--all-status' },
  { name: 'Article Item Create', slug: 'article.item-create' },
  { name: 'Article Item Update', slug: 'article.item-update' },
  { name: 'Article Item Delete', slug: 'article.item-delete' },
  //
  // --------------------------------
  //
  { name: 'Ad List Read', slug: 'ax.list-read' },
  { name: 'Ad List Read (All Status)', slug: 'ax.list-read--all-status' },
  //
  { name: 'Ad Item Read', slug: 'ax.item-read' },
  { name: 'Ad Item Read (All Status)', slug: 'ax.item-read--all-status' },
  { name: 'Ad Item Create', slug: 'ax.item-create' },
  { name: 'Ad Item Update', slug: 'ax.item-update' },
  { name: 'Ad Item Delete', slug: 'ax.item-delete' },
  //
  // --------------------------------
  //
  { name: 'Tag List Read', slug: 'tag.list-read' },
  //
  { name: 'Tag Item Read', slug: 'tag.item-read' },
  { name: 'Tag Item Create', slug: 'tag.item-create' },
  { name: 'Tag Item Update', slug: 'tag.item-update' },
  { name: 'Tag Item Delete', slug: 'tag.item-delete' },
  //
  // --------------------------------
  //
  { name: 'Attachment List Read', slug: 'attachment.list-read' },
  { name: 'Attachment List Read (All Status)', slug: 'attachment.list-read--all-status' },
  //
  { name: 'Attachment Item Read', slug: 'attachment.item-read' },
  { name: 'Attachment Item Read (All Status)', slug: 'attachment.item-read--all-status' },
  { name: 'Attachment Item Create', slug: 'attachment.item-create' },
  { name: 'Attachment Item Update', slug: 'attachment.item-update' },
  { name: 'Attachment Item Delete', slug: 'attachment.item-delete' },
  //
  // --------------------------------
  //
  { name: 'Setting List Read', slug: 'setting.list-read' },
  { name: 'Setting List Read (Private)', slug: 'setting.list-read--private' },
  //
  { name: 'Setting Item Read', slug: 'setting.item-read' },
  { name: 'Setting Item Read (Private)', slug: 'setting.item-read--private' },
  { name: 'Setting Item Create', slug: 'setting.item-create' },
  { name: 'Setting Item Update', slug: 'setting.item-update' },
  { name: 'Setting Item Delete', slug: 'setting.item-delete' },
  //
  // --------------------------------
  //
  { name: 'Coupon List Read', slug: 'coupon.list-read' },
  { name: 'Coupon List Read (All User Id)', slug: 'coupon.list-read--all-user-id' },
  { name: 'Coupon List Read (All Status)', slug: 'coupon.list-read--all-status' },
  //
  { name: 'Coupon Item Read', slug: 'coupon.item-read' },
  { name: 'Coupon Item Read (All User Id)', slug: 'coupon.item-read--all-user-id' },
  { name: 'Coupon Item Read (All Status)', slug: 'coupon.item-read--all-status' },
  { name: 'Coupon Item Create', slug: 'coupon.item-create' },
  { name: 'Coupon Item Update', slug: 'coupon.item-update' },
  { name: 'Coupon Item Delete', slug: 'coupon.item-delete' },
  //
  { name: 'Coupon Item Redeem', slug: 'coupon.item-redeem' },
  { name: 'Coupon Item Redeem (To Any User)', slug: 'coupon.item-redeem--to-all-user-id' },
  //
  // --------------------------------
  //
  { name: 'Promo List Read', slug: 'promo.list-read' },
  { name: 'Promo List Read (All Status)', slug: 'promo.list-read--all-status' },
  //
  { name: 'Promo Item Read', slug: 'promo.item-read' },
  { name: 'Promo Item Read (All Status)', slug: 'promo.item-read--all-status' },
  { name: 'Promo Item Create', slug: 'promo.item-create' },
  { name: 'Promo Item Update', slug: 'promo.item-update' },
  { name: 'Promo Item Delete', slug: 'promo.item-delete' },
  //
  { name: 'Promo Item Redeem', slug: 'promo.item-redeem' },
  { name: 'Promo Item Redeem (To Any User)', slug: 'promo.item-redeem--to-all-user-id' },
  //
  // --------------------------------
  //
  { name: 'Product List Read', slug: 'product.list-read' },
  { name: 'Product List Read (All Status)', slug: 'product.list-read--all-status' },
  //
  { name: 'Product Item Read', slug: 'product.item-read' },
  { name: 'Product Item Read (All Status)', slug: 'product.item-read--all-status' },
  { name: 'Product Item Create', slug: 'product.item-create' },
  { name: 'Product Item Update', slug: 'product.item-update' },
  { name: 'Product Item Delete', slug: 'product.item-delete' },
  //
  // --------------------------------
  //
  { name: 'Address List Read', slug: 'address.list-read' },
  { name: 'Address List Read (All Users)', slug: 'address.list-read--all-users' },
  //
  { name: 'Address Item Read', slug: 'address.item-read' },
  { name: 'Address Item Read (All Status)', slug: 'address.item-read--all-users' },
  { name: 'Address Item Create', slug: 'address.item-create' },
  { name: 'Address Item Update', slug: 'address.item-update' },
  { name: 'Address Item Delete', slug: 'address.item-delete' },
  //
  // --------------------------------
  //
  { name: 'Division List Read', slug: 'division.list-read' },
  //
  { name: 'Division Item Read', slug: 'division.item-read' },
  { name: 'Division Item Create', slug: 'division.item-create' },
  { name: 'Division Item Update', slug: 'division.item-update' },
  { name: 'Division Item Delete', slug: 'division.item-delete' },
  //
  // --------------------------------
  //
  { name: 'Zan List Read', slug: 'zan.list-read' },
  //
  { name: 'Zan Item Read', slug: 'zan.item-read' },
  { name: 'Zan Item Create', slug: 'zan.item-create' },
  { name: 'Zan Item Update', slug: 'zan.item-update' },
  { name: 'Zan Item Delete', slug: 'zan.item-delete' },
  { name: 'Zan Item User Delete', slug: 'zan.item-user-delete' },
  //
  // --------------------------------
  //
  { name: 'Auth List Read', slug: 'auth.list-read' },
  { name: 'Auth Item Delete', slug: 'auth.item-delete' },
  //
  // --------------------------------
  //
  { name: 'Oauth List Read', slug: 'oauth.list-read' },
  //
  { name: 'Oauth Item Read', slug: 'oauth.item-read' },
  { name: 'Oauth Item Create', slug: 'oauth.item-create' },
  { name: 'Oauth Item Delete', slug: 'oauth.item-delete' },
  //
  // --------------------------------
  //
  { name: 'Action List Read', slug: 'action.list-read' },
  //
  { name: 'Action Item Read', slug: 'action.item-read' },
  { name: 'Action Item Create', slug: 'action.item-create' },
  { name: 'Action Item Delete', slug: 'action.item-delete' },
  //
];

// prettier-ignore
export const rolesSeed = [
  { name: 'Admin', slug: 'admin' },
  { name: 'Staff', slug: 'staff' },
  { name: 'Attachment Manager', slug: 'attachment-manager' },
];

// prettier-ignore
export const usersSeed: UserCreateOneReq[] = [
  { email: 'admin@local.com', name: 'Admin', password: 'h8Hx9qvPKoHMLQgj', status: 1, is_admin: 1, avatar_url: '' },
  { email: 'staff@local.com', name: 'Staff', password: '7PkQGjvHMMkoo4RZ', status: 1, is_admin: 1 },
  { email: 'disabled@local.com', name: 'Disabled', password: 'uUB3YGrdL3gJZYij', status: 1, is_admin: 1 },
  { email: 'empty-en@local.com', name: 'Empty User', password: 'uUB3YGrdL3gJZYi1', status: 1 },
  { email: 'empty-cn@local.com', name: '空号用户', password: 'uUB3YGrdL3gJZYi2', status: 1 },
  { email: 'empty-jp@local.com', name: '空のユーザー', password: 'uUB3YGrdL3gJZYi3', status: 1 },
  { email: 'ram-01@local.com', name: 'RAM-01', password: 'uUB3YGrdL3gJZYi3', status: 1 },
  { email: 'ram-02@local.com', name: 'RAM-02', password: 'uUB3YGrdL3gJZYi3', status: 1 },
  { email: 'ram-03@local.com', name: 'RAM-03', password: 'uUB3YGrdL3gJZYi3', status: 1 },
  { email: 'ram-04@local.com', name: 'RAM-04', password: 'uUB3YGrdL3gJZYi3', status: 1 },
  { email: 'ram-05@local.com', name: 'RAM-05', password: 'uUB3YGrdL3gJZYi3', status: 1 },
  { email: 'ram-06@local.com', name: 'RAM-06', password: 'uUB3YGrdL3gJZYi3', status: 1 },
];

const randomSersSeedData = [];

for (let i = 0; i < 50; i += 1) {
  const name = `RANDOM_USER_${i.toString().padStart(4, '0')}`;

  randomSersSeedData.push({
    email: `${name}@RRRR.com`,
    name,
    password: Math.random().toString(36).slice(-8),
    status: 1,
  });
}

export const randomSersSeed = randomSersSeedData;

// prettier-ignore
export const permissionsToRoleSeed = [
  { roleSlug: 'admin', permissionSlugs: permissionsSeed.map(p => p.slug) }, // allpermissions
  { roleSlug: 'staff', permissionSlugs: permissionsSeed.filter(p => p.slug.includes('user.')).map(p => p.slug) },
  { roleSlug: 'attachment-manager', permissionSlugs: permissionsSeed.filter(p => p.slug.includes('attachment.')).map(p => p.slug) },
];

// prettier-ignore
export const rolesToUserSeed = [
  { userEmail: 'admin@local.com', roleSlugs: ['admin', 'staff', 'attachment-manager'] },
  { userEmail: 'staff@local.com', roleSlugs: ['staff', 'attachment-manager'] },
];

interface ICreateCategoryInput extends CategoryCreateOneReq {
  seedParentSlug?: string;
}

// prettier-ignore
export const categorySeed: ICreateCategoryInput[] = [
  {  name: 'Articles', description: '文章分类', slug: 'articles' },
  {  name: 'Products', description: '商品分类', slug: 'products' },
  {  name: 'Brands', description: '品牌分类', slug: 'brands' },
  //
  {  name: 'Frontend', slug: 'frontend', seedParentSlug: 'articles' },
  {  name: 'Backend', slug: 'backend', seedParentSlug: 'articles' },
  {  name: 'Help', slug: 'help', seedParentSlug: 'articles' },
  {  name: 'Digit', slug: 'digit', seedParentSlug: 'products' },
  {  name: 'Home Appliance', slug: 'home-appliance', seedParentSlug: 'products' },
  {  name: 'Apple', slug: 'apple', seedParentSlug: 'brands' },
  {  name: 'FILCO', slug: 'filco', seedParentSlug: 'brands' },
];

// prettier-ignore
export const articleSeed: ArticleCreateOneReq[] = [
  {
    title: '哈喽，Leaa',
    slug: 'hello-leaa',
    status: 1,
    description: 'Hello, World 是指在计算机屏幕显示 “Hello, World!”（你好，世界！）',
    content: '<p>Hello, World 是指在计算机屏幕显示 “Hello, World!”（你好，世界！）字符串的计算机程序。</p>',
  },
  {
    title: 'Sample Article',
    slug: 'demo-article',
    status: 1,
    description: 'Sample Article Description',
    content: '<p>JUST A SAMPLE ARTICLE</p><br /><br /><br /><br /><br />',
  },
  {
    title: '<script>alert(\'hello, leaa.\')</script>',
    slug: 'alert-test',
    status: 1,
    description: '<script>alert(\'hello, leaa.\')</script>',
    content: '<p>&lt;script&gt;alert(&#x27;hello, leaa.&#x27;)&lt;/script&gt;</p>',
  },
  {
    title: 'The State of Web Browsers 2019 edition',
    slug: 'the-state-of-web-browsers-2019-edition',
    status: 1,
    description: 'Two days ago, I published a bitter sweet article on the state of web browsers.',
    content: '<p>Two days ago, I published a bitter sweet article on the state of web browsers, triggered by the news that Microsoft would abandon their EdgeHTML engine, replacing it with Chromium. Which was the final nail in the coffin, effectively establishing Chromium as the web’s engine, combined with Safari’s webkit. The only resistance to this monopoly, Mozilla, finds itself without any significant allies or traction to counter this development.</p><p>The article got some readership and a fair amount of feedback. The general consensus seems to be that the article is truthful but depressing.</p><p>Critical notes suggest that some statements are true-ish but too broad, lacking finer details and nuance. I agree. Some statements could be more polished, but it would make the article twice as long, and not all of those details matter for the larger conclusions I was going for. To illustrate, the article got tens of thousands of views, only 25% bothered to actually read it. Which surely has to do with length, and I suppose some were so disgusted halfway-in, they gave up, saving both time and the chance of a clinical depression.</p><p></p><p>Only a few critiqued the delivery style of brutal honesty, most seemed to appreciate it. And some don’t, it comes with the territory. All I can say is that I won’t tone it down, I was actually in a mild mood that day. I don’t apply brutal honesty for shock value or attention, I genuinely believe that in a world ruled by tech, we need no nonsense critique, not sugar coated suggestions. Plus, I’m dutch, this is our default tone of voice.</p><p>Back on point, why a second article? I want to address the depressing part of the original article. If you were brave enough to read it to the end, you’d notice the lack of a happy ending. You could be under the impression that the web is a lost cause, the open web in great danger, and that we’ve returned to medieval IE times. It would take the greatest of optimists to wade through that article without it ruining your day, if you care about the web.</p><p></p><p>I cannot change the fact that the road to Chromium/Webkit dominance was messy or even abusive. It is a questionable history that will not be undone. We’re going to leave this one to the lawyers, but sure enough, those browsers aren’t going to be uninstalled. It’s a done deal.</p><p>In this article, we’re going to accept the new state, where Chromium dominates the web, and look ahead. To see what Chromium dominance means for users, developers and the open web. The spoiler is of course that there’s plenty of reasons to be happy, optimistic, and even excited about this new state, even if the new state came into existence in unfair ways.</p><p></p><p><a href="https://ferdychristant.com/the-state-of-web-browsers-88224d55b4e6" target="_blank">[Link]</a></p>'
  },
  {
    title: 'web 浏览器现状 2019版',
    slug: 'the-state-of-web-browsers-2019-edition-cn',
    status: 1,
    description: '两天前，有感于微软放弃 Edgehtml 引擎，使用 Chromiun 取而代之的事件',
    content: '<p>两天前，😊 有感于微软放弃 Edgehtml 引擎，使用 Chromiun 取而代之的事件，我发表了一篇关于浏览器兴衰的文章。微软的此番作为被视为将 Chromium 与 Safari 的 webkit 结合建立搜索引擎的最后一步。而此时，唯一能对微软的垄断行为产生威胁的对手 —— Mozilla，发现自己已经没有盟友和动力来应对微软的这一举措了。</p><p></p><p>这篇文章获得了大量读者的反馈，大家普遍肯定了文章的真实性，但也对文章揭露的事实感到沮丧。</p><p></p><p>一些批判性的评论则认为文章的一些观点是真实可信的，但过于宽泛，缺乏细节。我肯定有些观点可以更加精辟，但这会使文章的篇幅增加一倍，并且增加的内容对我所要阐述的核心观点没有太大用处。比如说，该篇文章获得了数万读者的浏览，实际上仅仅有 25% 左右的读者真正通读了，可能是因为文章的长度，有些读者感到厌烦，在阅读中途就放弃了，既节省了时间又免得内心沮丧。</p><p></p><p>只有少数人批评我近似残酷的诚实，更多读者则偏向欣赏我的做法。这等同于领土问题。我所能说的是，尽管那天我的情绪很平和，但我并不会降低语气。我也不会用我的诚实获取价值和关注，我坚信在一个由科技主导的世界里不需要毫无意义的批评，更不需要高谈阔论的建议。另外，我是一个荷兰人，我们惯有的语调就是如此。</p><p></p><p>回到主题上，为什么要发布第二篇文章？我想要谈谈原文中令人沮丧的那部分内容。如果你有足够的时间读到最后，你会在末尾发现这将是一个缺少快乐的结局。你可能会认为 web 是一个失败的东西，开放的 web 处于极大的危险中，我们已经回到了中世纪的 IE 时代。如果你关心 web 的话，即使是最乐观的人也会在不破坏自己一天的情况下读完这篇文章。</p><p></p><p>我不能改变的事实是： Chromium/Webkit 的统治之路是混乱的，甚至是滥用的。这是一段不可抹去的、值得怀疑的历史。我们将把这个留给律师，但足够肯定的是，这些浏览器仍不会被卸载。咱们走着瞧。</p><p></p><p>在本文中，我们将接受 Chrome 主导 web 的新态势，并展望未来。看看 Chromium 的优势对用户、开发者和开放 web 意味着什么。剧透一下，我们将有很多理由对这个态势感到高兴、乐观，甚至兴奋，即使这个新态势是以一种不公平的方式出现的。</p><p></p><p><a href="https://github.com/xitu/gold-miner/blob/master/TODO1/the-state-of-web-browsers-2019-edition.md" target="_blank">[全文链接]</a></p>',
  },
  {
    title: 'The 4 types of ‘Why’: What is the driving force behind your product?',
    slug: 'the-4-types-of-why-what-is-the-driving-force-behind-your-product',
    status: 1,
    description: '',
    content: '<p style="text-align:start;" size="3" _root="[object Object]" __ownerID="undefined" __hash="undefined" __altered="false">I recently wrote about a framework I created called <a href="https://medium.com/@kit_ulrich/a-surprisingly-simple-technique-for-a-rockstar-product-vision-the-ladder-of-needs-ae624d81ca6b" target="_blank" class="bb cn ld le lf lg">the Ladder of Needs</a>, a simple tool for product people to create a compelling vision. It combines the best of Simon Sinek’s ideas from <a href="https://www.amazon.com/Start-Why-Leaders-Inspire-Everyone/dp/1591846447" target="_blank" class="bb cn ld le lf lg">Start with Why</a> and Clay Christensen’s classic <a href="https://hbr.org/2016/09/know-your-customers-jobs-to-be-done" target="_blank" class="bb cn ld le lf lg">framework of ‘jobs to be done’</a>.</p><p><br/></p><div class="media-wrap image-wrap"><img alt="" width="680px" height="549.484px" src="https://miro.medium.com/max/1584/1*4RcIun2jW3x010o9MrYIVw.png" class="mt mu fm n o fl x fj" /></div><p></p><p style="text-align:start;text-indent:2em;" id="9834" class="kp kq fo bs kr b ks kt ku kv kw kx ky kz la lb lc" data-selectable-paragraph=""></p><p></p><p>So, how do you determine the ‘Why’ behind your product?</p><p></p><blockquote>“People often ask what will be different in the world in 10 years, the more important question is what will be the same” — Jeff Bezos</blockquote><p style="text-align:start;text-indent:2em;" id="295a" class="kp kq fo bs kr b ks kt ku kv kw kx ky kz la lb lc" data-selectable-paragraph=""></p><p>Start by considering this gem from Jeff Bezos:</p><p></p><p>So true, because the fundamentals of what people want and need are exactly that…fundamental truths. In my time as a product leader, I have found 4 models that apply to almost all consumer experiences and products. These are not mutually exclusive — they are ideas that overlap in many ways, but one will likely call to you more than the others.</p><p><br/></p><div class="media-wrap image-wrap"><img width="680px" height="81.1406px" src="https://miro.medium.com/max/1542/0*1mrb_-l-2fb9vd5i" class="mt mu fm n o fl x fj" alt="" /></div><p>What is your customer’s scarcest resource? It tends to be either money, time, energy.</p><p></p><p>You may have seen this meme on Twitter or Instagram before (I’d love to know whom to credit with it’s creation). It’s a great framework for products.</p><p><br/></p><div class="media-wrap image-wrap"><img width="680px" height="338.625px" src="https://miro.medium.com/max/1486/0*3CW4a_5cLbHd2Jc3" class="mt mu fm n o fl x fj" alt="" /></div><p>This is why Bezos’ answer to his own question, ‘what will be the same in the world in 10 years’, was that Amazon customers would always want lower prices (money) and faster shipping (time). Amazon’s strategy was built by focusing on these core customer needs.This is also why Uber isn’t in the business of selling rides, it is in the business of selling time.</p><p></p><p><a href="https://medium.com/@kit_ulrich/the-4-types-of-why-what-is-the-driving-force-behind-your-product-1b06fb4ef7bc" target="_blank">[Full Link]</a></p>',
  },
  { title: 'EMPTY-DEMO-01', slug: 'empty-demo-01', status: 1, description: 'EMPTY-DEMO-01', content: '<p>EMPTY-CONTENT-01</p>' },
  { title: 'EMPTY-DEMO-02', slug: 'empty-demo-02', status: 1, description: 'EMPTY-DEMO-02', content: '<p>EMPTY-CONTENT-02</p>' },
  { title: 'EMPTY-DEMO-03', slug: 'empty-demo-03', status: 1, description: 'EMPTY-DEMO-03', content: '<p>EMPTY-CONTENT-03</p>' },
  { title: 'EMPTY-DEMO-04', slug: 'empty-demo-04', status: 1, description: 'EMPTY-DEMO-04', content: '<p>EMPTY-CONTENT-04</p>' },
  { title: 'EMPTY-DEMO-05', slug: 'empty-demo-05', status: 1, description: 'EMPTY-DEMO-05', content: '<p>EMPTY-CONTENT-05</p>' },
  { title: 'EMPTY-DEMO-06', slug: 'empty-demo-06', status: 1, description: 'EMPTY-DEMO-06', content: '<p>EMPTY-CONTENT-06</p>' },
  { title: 'EMPTY-DEMO-07', slug: 'empty-demo-07', status: 1, description: 'EMPTY-DEMO-07', content: '<p>EMPTY-CONTENT-07</p>' },
  { title: 'EMPTY-DEMO-08', slug: 'empty-demo-08', status: 1, description: 'EMPTY-DEMO-08', content: '<p>EMPTY-CONTENT-08</p>' },
  { title: 'EMPTY-DEMO-09', slug: 'empty-demo-09', status: 1, description: 'EMPTY-DEMO-09', content: '<p>EMPTY-CONTENT-09</p>' },
  { title: 'EMPTY-DEMO-10', slug: 'empty-demo-10', status: 1, description: 'EMPTY-DEMO-10', content: '<p>EMPTY-CONTENT-10</p>' },
  { title: 'EMPTY-DEMO-11', slug: 'empty-demo-11', status: 1, description: 'EMPTY-DEMO-11', content: '<p>EMPTY-CONTENT-11</p>' },
  { title: 'EMPTY-DEMO-12', slug: 'empty-demo-12', status: 1, description: 'EMPTY-DEMO-12', content: '<p>EMPTY-CONTENT-12</p>' },
  { title: 'EMPTY-DEMO-13', slug: 'empty-demo-13', status: 1, description: 'EMPTY-DEMO-13', content: '<p>EMPTY-CONTENT-13</p>' },
  { title: 'EMPTY-DEMO-14', slug: 'empty-demo-14', status: 1, description: 'EMPTY-DEMO-14', content: '<p>EMPTY-CONTENT-14</p>' },
  { title: 'EMPTY-DEMO-15', slug: 'empty-demo-15', status: 1, description: 'EMPTY-DEMO-15', content: '<p>EMPTY-CONTENT-15</p>' },
  { title: 'EMPTY-DEMO-16', slug: 'empty-demo-16', status: 1, description: 'EMPTY-DEMO-16', content: '<p>EMPTY-CONTENT-16</p>' },
  { title: 'EMPTY-DEMO-17', slug: 'empty-demo-17', status: 1, description: 'EMPTY-DEMO-17', content: '<p>EMPTY-CONTENT-17</p>' },
  { title: 'EMPTY-DEMO-18', slug: 'empty-demo-18', status: 1, description: 'EMPTY-DEMO-18', content: '<p>EMPTY-CONTENT-18</p>' },
  { title: 'EMPTY-DEMO-19', slug: 'empty-demo-19', status: 1, description: 'EMPTY-DEMO-19', content: '<p>EMPTY-CONTENT-19</p>' },
  { title: 'EMPTY-DEMO-20', slug: 'empty-demo-20', status: 1, description: 'EMPTY-DEMO-20', content: '<p>EMPTY-CONTENT-20</p>' },
  { title: 'EMPTY-DEMO-21', slug: 'empty-demo-21', status: 1, description: 'EMPTY-DEMO-21', content: '<p>EMPTY-CONTENT-21</p>' },
  { title: 'EMPTY-DEMO-22', slug: 'empty-demo-22', status: 1, description: 'EMPTY-DEMO-22', content: '<p>EMPTY-CONTENT-22</p>' },
  { title: 'EMPTY-DEMO-23', slug: 'empty-demo-23', status: 1, description: 'EMPTY-DEMO-23', content: '<p>EMPTY-CONTENT-23</p>' },
  { title: 'EMPTY-DEMO-24', slug: 'empty-demo-24', status: 1, description: 'EMPTY-DEMO-24', content: '<p>EMPTY-CONTENT-24</p>' },
  { title: 'EMPTY-DEMO-25', slug: 'empty-demo-25', status: 1, description: 'EMPTY-DEMO-25', content: '<p>EMPTY-CONTENT-25</p>' },
  { title: 'EMPTY-DEMO-26', slug: 'empty-demo-26', status: 1, description: 'EMPTY-DEMO-26', content: '<p>EMPTY-CONTENT-26</p>' },
  { title: 'EMPTY-DEMO-27', slug: 'empty-demo-27', status: 1, description: 'EMPTY-DEMO-27', content: '<p>EMPTY-CONTENT-27</p>' },
  { title: 'EMPTY-DEMO-28', slug: 'empty-demo-28', status: 1, description: 'EMPTY-DEMO-28', content: '<p>EMPTY-CONTENT-28</p>' },
  { title: 'EMPTY-DEMO-29', slug: 'empty-demo-29', status: 1, description: 'EMPTY-DEMO-29', content: '<p>EMPTY-CONTENT-29</p>' },
  {
    title: '亚马逊推出 3 代 Kindle Oasis，加入色温调节功能',
    slug: 'kindle-oasis-s',
    status: 1,
    description: '',
    content: '<p> </p><div class="media-wrap image-wrap"><img alt="" class="media-wrap image-wrap" src="https://files.techcrunch.cn/2019/06/kindle-oasis-front-light.jpg?w=738"/></div><p>对电子书阅读器爱好者来说，<a href="https://techcrunch.com/2017/10/31/amazons-new-kindle-oasis-is-the-best-e-reader-a-lot-of-money-can-buy/" target="_blank">Kindle Oasis</a> 可以说是最好的产品了。在这个产品类别中，亚马逊是挺立到最后的巨头玩家（除非你认为巴诺书店还算 “挺立” 着），而 Oasis 是他们制造的最好 Kindle，货真价实。在 2017 年年底时，我曾对当时最新款的 Oasis 进行过评测，我十分享受使用它的美好时光。<br/> 现在，亚马逊对 Oasis 进行了迭代，让这份美好继续延续。但首先需要说清楚的是，跟最近标准版 Kindle 获得的升级一样，Oasis 这次的升级幅度也很小。从外观上看，新款 Oasis 保留了前代产品的所有优点，包括 7 英寸、300ppi 的显示屏，以及翻页实体按钮。<br/> 这次的重大变化在于，新款 Oasis 加入了调节显示屏色温的功能，这能够让用户在白天阅读时眼睛更加舒适，以及在夜里阅读后更好地入眠。此外，新款设备还内置了一个选项，可以全天自动调节显示屏色温。<br/> </p><div class="media-wrap image-wrap"><a style="display:inline-block" href="https://files.techcrunch.cn/2019/06/kindle-oasis-graphite-front.jpg" target="_blank"><img class="media-wrap image-wrap" alt="" src="https://files.techcrunch.cn/2019/06/kindle-oasis-graphite-front.jpg?w=1200&amp;h=1200"/></a></div><p><br/> 老实说，这就是新款 Oasis 的主要新卖点了。此外，它还采用了新一代的电子墨水屏技术，虽然分辨率与前代产品相同，但却提供了更高的刷新率，从而让翻页速度加快（稍后我会就此更新报道），这顺应的是科技迈向更快速度的潮流。在这里，我就不深入讲这项技术的显著优势了，这些年媒体已经做过大量的报道。<br/> 来自前代产品的功能还包括 IPX8 级防水，这意味着 Oasis 可以放在最深 2 米的水下长达 1 小时。内置的蓝牙功能可以让用户通过 Audible 收听有声读物，机身背部则采用了金属材质。<br/> 与 2017 年款一样，新款 Oasis 的 8GB 版本起价为 250 美元，32GB 版本起价为 280 美元（如果你想要无广告版本，还得再多破费一些）。亚马逊向购买新款 Oasis 的用户赠送了 6 个月的 Kindle Unlimited 服务。从周三开始，用户可以进行预订，这款产品将于 7 月 24 日开始发货，届时还有一系列不同的保护套可供选购。<br/> 翻译：王灿均（<a href="https://www.douban.com/people/remexwang/" target="_blank">@何无鱼</a>）<br/> <a href="https://techcrunch.com/2019/06/19/amazon-adds-color-adjustable-lighting-to-its-best-kindle/" target="_blank">Amazon adds color adjustable lighting to its best Kindle</a><br/> </p>',
  },
  { title: 'EMPTY-DEMO-30', slug: 'empty-demo-30', status: 1, description: 'EMPTY-DEMO-30', content: '<p>EMPTY-CONTENT-30</p>' },
  { title: 'EMPTY-DEMO-31', slug: 'empty-demo-31', status: 1, description: 'EMPTY-DEMO-31', content: '<p>EMPTY-CONTENT-31</p>' },
  { title: 'EMPTY-DEMO-32', slug: 'empty-demo-32', status: 1, description: 'EMPTY-DEMO-32', content: '<p>EMPTY-CONTENT-32</p>' },
  { title: 'EMPTY-DEMO-33', slug: 'empty-demo-33', status: 1, description: 'EMPTY-DEMO-33', content: '<p>EMPTY-CONTENT-33</p>' },
  { title: 'EMPTY-DEMO-34', slug: 'empty-demo-34', status: 1, description: 'EMPTY-DEMO-34', content: '<p>EMPTY-CONTENT-34</p>' },
  { title: 'EMPTY-DEMO-35', slug: 'empty-demo-35', status: 1, description: 'EMPTY-DEMO-35', content: '<p>EMPTY-CONTENT-35</p>' },
  { title: 'EMPTY-DEMO-36', slug: 'empty-demo-36', status: 1, description: 'EMPTY-DEMO-36', content: '<p>EMPTY-CONTENT-36</p>' },
  { title: 'EMPTY-DEMO-37', slug: 'empty-demo-37', status: 1, description: 'EMPTY-DEMO-37', content: '<p>EMPTY-CONTENT-37</p>' },
  { title: 'EMPTY-DEMO-38', slug: 'empty-demo-38', status: 1, description: 'EMPTY-DEMO-38', content: '<p>EMPTY-CONTENT-38</p>' },
  { title: 'EMPTY-DEMO-39', slug: 'empty-demo-39', status: 1, description: 'EMPTY-DEMO-39', content: '<p>EMPTY-CONTENT-39</p>' },
  { title: '-- LINE-01 --', slug: 'empty-line-01', status: 1, description: 'EMPTY-LINE-01', content: '<p>EMPTY-CONTENT-L1</p>' },
  { title: 'EMPTY-DEMO-40', slug: 'empty-demo-40', status: 1, description: 'EMPTY-DEMO-40', content: '<p>EMPTY-CONTENT-40</p>' },
  { title: 'EMPTY-DEMO-41', slug: 'empty-demo-41', status: 1, description: 'EMPTY-DEMO-41', content: '<p>EMPTY-CONTENT-41</p>' },
  { title: 'EMPTY-DEMO-42', slug: 'empty-demo-42', status: 1, description: 'EMPTY-DEMO-42', content: '<p>EMPTY-CONTENT-42</p>' },
  { title: 'EMPTY-DEMO-43', slug: 'empty-demo-43', status: 1, description: 'EMPTY-DEMO-43', content: '<p>EMPTY-CONTENT-43</p>' },
  { title: 'EMPTY-DEMO-44', slug: 'empty-demo-44', status: 1, description: 'EMPTY-DEMO-44', content: '<p>EMPTY-CONTENT-44</p>' },
  { title: 'EMPTY-DEMO-45', slug: 'empty-demo-45', status: 1, description: 'EMPTY-DEMO-45', content: '<p>EMPTY-CONTENT-45</p>' },
  { title: 'EMPTY-DEMO-46', slug: 'empty-demo-46', status: 1, description: 'EMPTY-DEMO-46', content: '<p>EMPTY-CONTENT-46</p>' },
  { title: 'EMPTY-DEMO-47', slug: 'empty-demo-47', status: 1, description: 'EMPTY-DEMO-47', content: '<p>EMPTY-CONTENT-47</p>' },
  { title: 'EMPTY-DEMO-48', slug: 'empty-demo-48', status: 1, description: 'EMPTY-DEMO-48', content: '<p>EMPTY-CONTENT-48</p>' },
  { title: 'EMPTY-DEMO-49', slug: 'empty-demo-49', status: 1, description: 'EMPTY-DEMO-49', content: '<p>EMPTY-CONTENT-49</p>' },
  { title: '-- LINE-02 --', slug: 'empty-line-02', status: 1, description: 'EMPTY-LINE-02', content: '<p>EMPTY-CONTENT-L2</p>' },
  {
    title: '关于谷歌 I/O 发布会，你想知道的一切都在这里',
    slug: 'heres-everything-google-announced-today-at-the-i-o-2019-keynote',
    status: 1,
    description: '',
    content: '<p>在今天下午举行的谷歌年度 I/O 开发者大会上，该公司在长达两小时的主题演讲中发布了一系列新产品——从新手机到下一代语音助手 Assistant——这些产品都是谷歌在过去一年开发的。</p>',
  },
];

// prettier-ignore
export const axSeed: AxCreateOneReq[] = [
  { title: 'Index Swiper', description: '首页滚动图', slug: 'index-swiper', status: 1 },
  { title: 'Index Grid', description: '首页方块图', slug: 'index-grid', status: 0 },
];

// prettier-ignore
export const attachmentSeed: any[] = [
  {
    uuid: '6db325c5-9c95-4952-94eb-eef33b2e0801',
    title: '001',
    alt: '001',
    type: 'image',
    filename: '6db325c5-9c95-4952-94eb-eef33b2e0801.png',
    module_name: 'ax',
    module_id: 1,
    type_name: 'gallery',
    type_platform: 'mb',
    ext: '.png',
    width: 1100,
    height: 500,
    size: 151768,
    path: '/attachments/2019/08/6db325c5-9c95-4952-94eb-eef33b2e08a7.jpg',
    external_url: 'https://code.aliyun.com/solidzoro/ipfs/raw/master/statics/images/banners/001.png|https://code.aliyun.com/solidzoro/ipfs/raw/master/statics/images/banners/001@2x.png',
    at2x: 1,
    in_local: 1,
    in_oss: 0,
    sort: 1,
    status: 1,
  },
  {
    uuid: '6db325c5-9c95-4952-94eb-eef33b2e0802',
    title: '002',
    alt: '002',
    type: 'image',
    filename: '6db325c5-9c95-4952-94eb-eef33b2e0802.png',
    module_name: 'ax',
    module_id: 1,
    type_name: 'gallery',
    type_platform: 'mb',
    ext: '.png',
    width: 1100,
    height: 500,
    size: 151768,
    path: '/attachments/2019/08/6db325c5-9c95-4952-94eb-eef33b2e08a7.jpg',
    external_url: 'https://code.aliyun.com/solidzoro/ipfs/raw/master/statics/images/banners/002.png|https://code.aliyun.com/solidzoro/ipfs/raw/master/statics/images/banners/002@2x.png',
    at2x: 1,
    in_local: 1,
    in_oss: 0,
    sort: 2,
    status: 1,
  },
  {
    uuid: '6db325c5-9c95-4952-94eb-eef33b2e0803',
    title: '003',
    alt: '003',
    type: 'image',
    filename: '6db325c5-9c95-4952-94eb-eef33b2e0803.png',
    module_name: 'ax',
    module_id: 1,
    type_name: 'gallery',
    type_platform: 'mb',
    ext: '.png',
    width: 1100,
    height: 500,
    size: 151768,
    path: '/attachments/2019/08/6db325c5-9c95-4952-94eb-eef33b2e08a7.jpg',
    external_url: 'https://code.aliyun.com/solidzoro/ipfs/raw/master/statics/images/banners/003.png|https://code.aliyun.com/solidzoro/ipfs/raw/master/statics/images/banners/003@2x.png',
    at2x: 1,
    in_local: 1,
    in_oss: 0,
    sort: 3,
    status: 1,
  },
];

// prettier-ignore
export const settingSeed: SettingCreateOneReq[] = [
  { name: 'Site Name', slug: 'site_name', type: 'input', sort: 1, value: 'Leaa', description: '站点名，最大 220 字' },
  { name: 'Site Description', slug: 'site_description', type: 'textarea', sort: 2, value: 'Leaa - project 1h 4 1d',  description: '站点描述， 最大 220 字' },
  { name: 'Site Keywords', slug: 'site_keywords', type: 'input', sort: 3, value: 'Leaa, mono-repo, C\'est la vie. project 1h 4 1d', description: '站点关键字，使用英文 , 分隔' },
  { name: 'Currency Symbol', slug: 'currency_symbol', type: 'radio', sort: 4, value: '$', description: 'Currency Symbol', options: '$\n¥' },
];
