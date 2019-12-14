/* eslint-disable max-len */
// prettier-ignore
import moment from 'moment';
import { CreateArticleInput } from '@leaa/common/src/dtos/article';
import { CreateCategoryInput } from '@leaa/common/src/dtos/category';
import { CreateAxInput } from '@leaa/common/src/dtos/ax';
import { CreateSettingInput } from '@leaa/common/src/dtos/setting';
import { CreateCouponInput } from '@leaa/common/src/dtos/coupon';
import { CreatePromoInput } from '@leaa/common/src/dtos/promo';
import { IPermissionSlug } from '@leaa/common/src/interfaces';

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
];

// prettier-ignore
export const rolesSeed = [
  { name: 'Admin', slug: 'admin' },
  { name: 'Staff', slug: 'staff' },
  { name: 'Attachment Manager', slug: 'attachment-manager' },
];

// prettier-ignore
export const usersSeed = [
  { email: 'admin@leaa.com', name: 'Admin', password: 'h8Hx9qvPKoHMLQgj', status: 1, is_admin: 1 },
  { email: 'staff@leaa.com', name: 'Staff', password: '7PkQGjvHMMkoo4RZ', status: 1, is_admin: 1 },
  { email: 'disabled@leaa.com', name: 'Disabled', password: 'uUB3YGrdL3gJZYij', status: 1, is_admin: 1 },
  { email: 'empty-en@leaa.com', name: 'Empty User', password: 'uUB3YGrdL3gJZYi1', status: 1 },
  { email: 'empty-cn@leaa.com', name: '空号用户', password: 'uUB3YGrdL3gJZYi2', status: 1 },
  { email: 'empty-jp@leaa.com', name: '空のユーザー', password: 'uUB3YGrdL3gJZYi3', status: 1 },
  { email: 'ram-01@leaa.com', name: 'RAM-01', password: 'uUB3YGrdL3gJZYi3', status: 1 },
  { email: 'ram-02@leaa.com', name: 'RAM-02', password: 'uUB3YGrdL3gJZYi3', status: 1 },
  { email: 'ram-03@leaa.com', name: 'RAM-03', password: 'uUB3YGrdL3gJZYi3', status: 1 },
  { email: 'ram-04@leaa.com', name: 'RAM-04', password: 'uUB3YGrdL3gJZYi3', status: 1 },
  { email: 'ram-05@leaa.com', name: 'RAM-05', password: 'uUB3YGrdL3gJZYi3', status: 1 },
  { email: 'ram-06@leaa.com', name: 'RAM-06', password: 'uUB3YGrdL3gJZYi3', status: 1 },
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
  { parent_id: 0, name: 'Articles', description: '文章分类', slug: 'articles' },
  { parent_id: 0, name: 'Products', description: '商品分类', slug: 'products' },
  { parent_id: 0, name: 'Brands', description: '品牌分类', slug: 'brands' },
  //
  { parent_id: 1, name: 'Frontend', slug: 'frontend' },
  { parent_id: 1, name: 'Backend', slug: 'backend' },
  { parent_id: 1, name: 'Help', slug: 'help' },
  { parent_id: 2, name: 'Digit', slug: 'digit' },
  { parent_id: 2, name: 'Home Appliance', slug: 'home-appliance' },
  { parent_id: 3, name: 'Apple', slug: 'apple' },
  { parent_id: 3, name: 'FILCO', slug: 'filco' },
];

// prettier-ignore
export const articleSeed: CreateArticleInput[] = [
  {
    title: '哈喽，Leaa',
    slug: 'hello-leaa',
    status: 1,
    categoryIds: [6],
    description: 'Hello, World 是指在计算机屏幕显示 “Hello, World!”（你好，世界！）',
    content: '<p>Hello, World 是指在计算机屏幕显示 “Hello, World!”（你好，世界！）字符串的计算机程序。</p>',
  },
  {
    title: 'Sample Article',
    slug: 'demo-article',
    status: 1,
    categoryIds: [4],
    description: 'Sample Article Description',
    content: '<p>JUST A SAMPLE ARTICLE</p><br /><br /><br /><br /><br />',
  },
  {
    title: '<script>alert(\'hello, leaa.\')</script>',
    slug: 'alert-test',
    status: 1 ,
    description: '<script>alert(\'hello, leaa.\')</script>',
    categoryIds: [4],
    content: '<p>&lt;script&gt;alert(&#x27;hello, leaa.&#x27;)&lt;/script&gt;</p>',
  },
  {
    title: 'The State of Web Browsers 2019 edition',
    slug: 'the-state-of-web-browsers-2019-edition',
    status: 1,
    categoryIds: [5],
    description: 'Two days ago, I published a bitter sweet article on the state of web browsers.',
    content: '<p>Two days ago, I published a bitter sweet article on the state of web browsers, triggered by the news that Microsoft would abandon their EdgeHTML engine, replacing it with Chromium. Which was the final nail in the coffin, effectively establishing Chromium as the web’s engine, combined with Safari’s webkit. The only resistance to this monopoly, Mozilla, finds itself without any significant allies or traction to counter this development.</p><p>The article got some readership and a fair amount of feedback. The general consensus seems to be that the article is truthful but depressing.</p><p>Critical notes suggest that some statements are true-ish but too broad, lacking finer details and nuance. I agree. Some statements could be more polished, but it would make the article twice as long, and not all of those details matter for the larger conclusions I was going for. To illustrate, the article got tens of thousands of views, only 25% bothered to actually read it. Which surely has to do with length, and I suppose some were so disgusted halfway-in, they gave up, saving both time and the chance of a clinical depression.</p><p></p><p>Only a few critiqued the delivery style of brutal honesty, most seemed to appreciate it. And some don’t, it comes with the territory. All I can say is that I won’t tone it down, I was actually in a mild mood that day. I don’t apply brutal honesty for shock value or attention, I genuinely believe that in a world ruled by tech, we need no nonsense critique, not sugar coated suggestions. Plus, I’m dutch, this is our default tone of voice.</p><p>Back on point, why a second article? I want to address the depressing part of the original article. If you were brave enough to read it to the end, you’d notice the lack of a happy ending. You could be under the impression that the web is a lost cause, the open web in great danger, and that we’ve returned to medieval IE times. It would take the greatest of optimists to wade through that article without it ruining your day, if you care about the web.</p><p></p><p>I cannot change the fact that the road to Chromium/Webkit dominance was messy or even abusive. It is a questionable history that will not be undone. We’re going to leave this one to the lawyers, but sure enough, those browsers aren’t going to be uninstalled. It’s a done deal.</p><p>In this article, we’re going to accept the new state, where Chromium dominates the web, and look ahead. To see what Chromium dominance means for users, developers and the open web. The spoiler is of course that there’s plenty of reasons to be happy, optimistic, and even excited about this new state, even if the new state came into existence in unfair ways.</p><p></p><p><a href="https://ferdychristant.com/the-state-of-web-browsers-88224d55b4e6" target="_blank">[Link]</a></p>'
  },
  {
    title: 'web 浏览器现状 2019版',
    slug: 'the-state-of-web-browsers-2019-edition-cn',
    status: 1,
    description: '两天前，有感于微软放弃 Edgehtml 引擎，使用 Chromiun 取而代之的事件',
    categoryIds: [6],
    content: '<p>两天前，😊 有感于微软放弃 Edgehtml 引擎，使用 Chromiun 取而代之的事件，我发表了一篇关于浏览器兴衰的文章。微软的此番作为被视为将 Chromium 与 Safari 的 webkit 结合建立搜索引擎的最后一步。而此时，唯一能对微软的垄断行为产生威胁的对手 —— Mozilla，发现自己已经没有盟友和动力来应对微软的这一举措了。</p><p></p><p>这篇文章获得了大量读者的反馈，大家普遍肯定了文章的真实性，但也对文章揭露的事实感到沮丧。</p><p></p><p>一些批判性的评论则认为文章的一些观点是真实可信的，但过于宽泛，缺乏细节。我肯定有些观点可以更加精辟，但这会使文章的篇幅增加一倍，并且增加的内容对我所要阐述的核心观点没有太大用处。比如说，该篇文章获得了数万读者的浏览，实际上仅仅有 25% 左右的读者真正通读了，可能是因为文章的长度，有些读者感到厌烦，在阅读中途就放弃了，既节省了时间又免得内心沮丧。</p><p></p><p>只有少数人批评我近似残酷的诚实，更多读者则偏向欣赏我的做法。这等同于领土问题。我所能说的是，尽管那天我的情绪很平和，但我并不会降低语气。我也不会用我的诚实获取价值和关注，我坚信在一个由科技主导的世界里不需要毫无意义的批评，更不需要高谈阔论的建议。另外，我是一个荷兰人，我们惯有的语调就是如此。</p><p></p><p>回到主题上，为什么要发布第二篇文章？我想要谈谈原文中令人沮丧的那部分内容。如果你有足够的时间读到最后，你会在末尾发现这将是一个缺少快乐的结局。你可能会认为 web 是一个失败的东西，开放的 web 处于极大的危险中，我们已经回到了中世纪的 IE 时代。如果你关心 web 的话，即使是最乐观的人也会在不破坏自己一天的情况下读完这篇文章。</p><p></p><p>我不能改变的事实是： Chromium/Webkit 的统治之路是混乱的，甚至是滥用的。这是一段不可抹去的、值得怀疑的历史。我们将把这个留给律师，但足够肯定的是，这些浏览器仍不会被卸载。咱们走着瞧。</p><p></p><p>在本文中，我们将接受 Chrome 主导 web 的新态势，并展望未来。看看 Chromium 的优势对用户、开发者和开放 web 意味着什么。剧透一下，我们将有很多理由对这个态势感到高兴、乐观，甚至兴奋，即使这个新态势是以一种不公平的方式出现的。</p><p></p><p><a href="https://github.com/xitu/gold-miner/blob/master/TODO1/the-state-of-web-browsers-2019-edition.md" target="_blank">[全文链接]</a></p>',
  },
  {
    title: 'The 4 types of ‘Why’: What is the driving force behind your product?',
    slug: 'the-4-types-of-why-what-is-the-driving-force-behind-your-product',
    status: 1,
    categoryIds: [4],
    description: '',
    content: '<p style="text-align:start;" size="3" _root="[object Object]" __ownerID="undefined" __hash="undefined" __altered="false">I recently wrote about a framework I created called <a href="https://medium.com/@kit_ulrich/a-surprisingly-simple-technique-for-a-rockstar-product-vision-the-ladder-of-needs-ae624d81ca6b" target="_blank" class="bb cn ld le lf lg">the Ladder of Needs</a>, a simple tool for product people to create a compelling vision. It combines the best of Simon Sinek’s ideas from <a href="https://www.amazon.com/Start-Why-Leaders-Inspire-Everyone/dp/1591846447" target="_blank" class="bb cn ld le lf lg">Start with Why</a> and Clay Christensen’s classic <a href="https://hbr.org/2016/09/know-your-customers-jobs-to-be-done" target="_blank" class="bb cn ld le lf lg">framework of ‘jobs to be done’</a>.</p><p><br/></p><div class="media-wrap image-wrap"><img alt="" width="680px" height="549.484px" src="https://miro.medium.com/max/1584/1*4RcIun2jW3x010o9MrYIVw.png" class="mt mu fm n o fl x fj" /></div><p></p><p style="text-align:start;text-indent:2em;" id="9834" class="kp kq fo bs kr b ks kt ku kv kw kx ky kz la lb lc" data-selectable-paragraph=""></p><p></p><p>So, how do you determine the ‘Why’ behind your product?</p><p></p><blockquote>“People often ask what will be different in the world in 10 years, the more important question is what will be the same” — Jeff Bezos</blockquote><p style="text-align:start;text-indent:2em;" id="295a" class="kp kq fo bs kr b ks kt ku kv kw kx ky kz la lb lc" data-selectable-paragraph=""></p><p>Start by considering this gem from Jeff Bezos:</p><p></p><p>So true, because the fundamentals of what people want and need are exactly that…fundamental truths. In my time as a product leader, I have found 4 models that apply to almost all consumer experiences and products. These are not mutually exclusive — they are ideas that overlap in many ways, but one will likely call to you more than the others.</p><p><br/></p><div class="media-wrap image-wrap"><img width="680px" height="81.1406px" src="https://miro.medium.com/max/1542/0*1mrb_-l-2fb9vd5i" class="mt mu fm n o fl x fj" alt="" /></div><p>What is your customer’s scarcest resource? It tends to be either money, time, energy.</p><p></p><p>You may have seen this meme on Twitter or Instagram before (I’d love to know whom to credit with it’s creation). It’s a great framework for products.</p><p><br/></p><div class="media-wrap image-wrap"><img width="680px" height="338.625px" src="https://miro.medium.com/max/1486/0*3CW4a_5cLbHd2Jc3" class="mt mu fm n o fl x fj" alt="" /></div><p>This is why Bezos’ answer to his own question, ‘what will be the same in the world in 10 years’, was that Amazon customers would always want lower prices (money) and faster shipping (time). Amazon’s strategy was built by focusing on these core customer needs.This is also why Uber isn’t in the business of selling rides, it is in the business of selling time.</p><p></p><p><a href="https://medium.com/@kit_ulrich/the-4-types-of-why-what-is-the-driving-force-behind-your-product-1b06fb4ef7bc" target="_blank">[Full Link]</a></p>',
  },
  { title: 'EMPTY-DEMO-00', slug: 'empty-demo-00', status: 1, categoryIds: [4], description: 'EMPTY-DEMO-00', content: '<p>EMPTY-CONTENT-00</p>' },
  { title: 'EMPTY-DEMO-01', slug: 'empty-demo-01', status: 1, categoryIds: [4], description: 'EMPTY-DEMO-01', content: '<p>EMPTY-CONTENT-01</p>' },
  { title: 'EMPTY-DEMO-02', slug: 'empty-demo-02', status: 1, categoryIds: [4], description: 'EMPTY-DEMO-02', content: '<p>EMPTY-CONTENT-02</p>' },
  { title: 'EMPTY-DEMO-03', slug: 'empty-demo-03', status: 1, categoryIds: [4], description: 'EMPTY-DEMO-03', content: '<p>EMPTY-CONTENT-03</p>' },
  { title: 'EMPTY-DEMO-04', slug: 'empty-demo-04', status: 1, categoryIds: [4], description: 'EMPTY-DEMO-04', content: '<p>EMPTY-CONTENT-04</p>' },
  { title: 'EMPTY-DEMO-05', slug: 'empty-demo-05', status: 1, categoryIds: [4], description: 'EMPTY-DEMO-05', content: '<p>EMPTY-CONTENT-05</p>' },
  { title: 'EMPTY-DEMO-06', slug: 'empty-demo-06', status: 1, categoryIds: [4], description: 'EMPTY-DEMO-06', content: '<p>EMPTY-CONTENT-06</p>' },
  { title: 'EMPTY-DEMO-07', slug: 'empty-demo-07', status: 1, categoryIds: [4], description: 'EMPTY-DEMO-07', content: '<p>EMPTY-CONTENT-07</p>' },
  { title: 'EMPTY-DEMO-08', slug: 'empty-demo-08', status: 1, categoryIds: [4], description: 'EMPTY-DEMO-08', content: '<p>EMPTY-CONTENT-08</p>' },
  { title: 'EMPTY-DEMO-09', slug: 'empty-demo-09', status: 1, categoryIds: [4], description: 'EMPTY-DEMO-09', content: '<p>EMPTY-CONTENT-09</p>' },
  {
    title: '四个「为什么」：是什么在背后驱动你的产品？',
    slug: 'the-4-types-of-why-what-is-the-driving-force-behind-your-product-cn',
    status: 1,
    categoryIds: [6],
    description: '',
    content: '<p>我刚刚在写我创作的一个叫做<a href="https://link.juejin.im?target=https%3A%2F%2Fmedium.com%2F%40kit_ulrich%2Fa-surprisingly-simple-technique-for-a-rockstar-product-vision-the-ladder-of-needs-ae624d81ca6b" target="_blank" rel="nofollow noopener noreferrer">需求的阶梯</a>的框架，它是一个可以让产品人员创造美好愿景的简单工具。「需求的阶梯」结合了 Simon Sinek 在 <a href="https://link.juejin.im?target=https%3A%2F%2Fwww.amazon.com%2FStart-Why-Leaders-Inspire-Everyone%2Fdp%2F1591846447" target="_blank" rel="nofollow noopener noreferrer">《Start with Why》</a>中最棒的想法和 Clay Christensen 的经典著作<a href="https://link.juejin.im?target=https%3A%2F%2Fhbr.org%2F2016%2F09%2Fknow-your-customers-jobs-to-be-done" target="_blank" rel="nofollow noopener noreferrer">《framework of ‘jobs to be done’》</a>。<br/> </p><p><br/> <strong>所以，你如何决定你产品背后的「为什么」？</strong><br/> Jeff Bezos（译者注：杰夫·贝佐斯，亚马逊创始人）是最开始思索这个问题的人：<br/>「人们经常问，10年后世界上会有什么不同，但我认为更重要的是，10年后还有什么不变」— Jeff Bezos<br/> <br/> 是的，因为人们想要且需要的真理恰恰是基本的事实。在我作为产品团队负责人期间，我找到了几乎可以应用到所有消费体验和产品的四个模型。他们并不互斥 —— 在很多方向他们是互相覆盖的，但其中一个可能比其他的更值得你关注。<br/> </p><p></p><p><br/> 什么是你的客户缺乏的资源？一般来说有三个方面 —— 钱、时间、精力。<br/> 你可能之前在 Twitter 或 Instagram 上看过这张图片（我很想知道它的作者是谁），这是一个伟大的产品框架。<br/> <br/></p><p><br/> 这就是 Bezos 提出的「10 年后世界上还有什么不变」这个问题的答案 —— 亚马逊的客户总是想要更低的价格（金钱）和更快的运输（时间），亚马逊的战略就是通过专注于这些核心客户需求而建立的。<br/> 这也是为什么 Uber 的商业模式不是「卖车」，而是「卖时间」。<br/></p><p><a href="https://github.com/xitu/gold-miner/blob/master/TODO1/the-4-types-of-why-what-is-the-driving-force-behind-your-product.md" target="_blank">[链接]</a></p>',
  },
  {
    title: 'Sources Say China Used iPhone Hacks to Target Uyghur Muslims',
    slug: 'sources-say-china-used-iphone-hacks-to-target-uyghur-muslims',
    status: 1,
    categoryIds: [6],
    description: 'A number of malicious websites used to hack into iPhones over a two-year period were targeting.',
    content: '<p> <em>Note: This was originally posted at       <a href="https://martinheinz.dev/blog/3">martinheinz.dev</a></em> <br/>      Nowadays, everybody is trying to run everything in container and I don&#x27;t blame them, I do the     same thing, because running applications,<br/>     databases or other tools in Docker container is super nice and we all know why (isolation, easy     setup, security...).<br/>     However, sometimes debugging, accessing, or in general interacting with containers can be pretty     annoying. This includes accessing, modifying or querying databases. So, as I used PostgreSQL     extensively and have been running it inside containers for a while now, I - over time - made a     list of few commands that can help immensely when doing simple and also not so simple operation     with a database server.   <br/> <a href="#" class="anchor"> </a>     Log Into PSQL   <br/>      The most basic thing you will always need to do if you want to interact with your database     server is to connect to the database itself (using <em>PSQL</em>):<br/> <br/>  docker exec -it &lt;container_name&gt; psql -U&lt;user_name&gt; -a &lt;db_name&gt; <br/> <br/>      So for Docker container called <code>db</code>, default user <code>postgres</code> and database     name <code>blog</code> it would be<br/> <br/>  docker exec -it db psql -Upostgres -a blog <br/> <br/> <a href="#" class="anchor"> </a>     Running Command Against Database   <br/>      It&#x27;s nice that you can log in and then execute whatever commands you need, but it&#x27;s often more     convenient to do it in one go, especially if you want to run just a single command or query:<br/> <br/>  docker exec -it &lt;container_name&gt; psql -U&lt;user_name&gt; -a &lt;db_name&gt; -c &#x27;&lt;command/query&gt;&#x27; <br/> <br/>      So if we wanted to list all tables in database using same parameters as in previous example:<br/> <br/>  docker exec -it db psql -Upostgres -a blog -c &#x27;\\l&#x27; <br/> <br/>      Here, <code>\\l</code> lists all tables in current database, if you are not familiar with     <em>psql</em> &quot;backslash&quot; commands, then I highly recommend this     <a href="https://gist.github.com/Kartones/dd3ff5ec5ea238d4c546">cheatsheet</a>.   <br/> Apart from <code>psql</code> commands you can run any SQL query like so:<br/><br/>  docker exec -it db psql -Upostgres -a blog -c &#x27;SELECT * FROM posts;&#x27; <br/> <br/> <a href="#" class="anchor"> </a>     Backing up Your Data   <br/>      From time to time I need to backup data or whole schema of the database, sometimes just as an     <em>&quot;insurance policy&quot;</em> and sometimes so I can make changes recklessly and restore     everything afterwards, so here how to do it:<br/> <br/>  docker exec -it &lt;container_name&gt; pg_dump -U&lt;user_name&gt; --column-inserts --data-only &lt;db_name&gt; &gt; backup.sql <br/> <br/>      In this example, we are making use of <code>pg_dump</code> utility, which allows us to extract     PostgreSQL databases. I&#x27;m using <code>--column-inserts</code> and <code>--data-only</code> flags     to get only table rows, but quite often all that is needed is schema, for that you can use     <code>-s</code> flag.   <br/> <a href="#" class="anchor"> </a>     Execute whole SQL files   <br/>      Sometimes you need to populate existing database with enough data for testing (please don&#x27;t do     this with production databases) or it&#x27;s just easier to use data from file then to copy and paste     them into command above.<br/> <br/>  docker cp ./data.sql &lt;container_name&gt;:/data.sql docker exec -it &lt;container_name&gt; psql -U&lt;user_name&gt; -a &lt;db_name&gt; -f /data.sql <br/> <br/>      Here we first need to copy the file itself into the running container and then execute it using     the <code>-f</code> flag.   <br/> <a href="#" class="anchor"> </a>     Prepopulating Database on the Start   <br/>      Previous example was good enough if you need to execute it from time to time, but it can become     annoying if you have to do it every time you start the database.<br/>     So, in case you decide that it&#x27;s better to just populate the database on the start, then here is     solution for that. It just requires little more work:   <br/> We will need following files:<br/> </p><ul><li><code>Dockerfile</code> - <em>Dockerfile</em> for your Postgres image</li><li><code>create_db.sh</code> - Script that creates database, schema and populates it.</li><li><code>schema.sql</code> - SQL file containing your database schema</li><li><code>data.sql</code> - SQL file containing data used to populate your database</li><li><code>.env</code> - File with environment variables, to make your life easier</li></ul><p> First, the <code>Dockerfile</code>:<br/><br/>  FROM postgres:11 # Custom initialization scripts COPY ./create_db.sh /docker-entrypoint-initdb.d/20-create_db.sh COPY schema.sql /schema.sql COPY data.sql /data.sql RUN chmod +x /docker-entrypoint-initdb.d/20-create_db.sh <br/> <br/>      This is very simple <em>Dockerfile</em>, all we need to do here is to copy our script and     schema/data into the image so they can be on run start-up. You may be asking,     <em>There is no <code>ENTRYPOINT</code> or <code>COMMAND</code>, how do we run it on       start-up?</em>     - the answer is, that base <code>postgres</code> image runs on start any scripts present in     <code>docker-entrypoint-initdb.d</code> directory, so all we need to do is copy our script to     this directory and PostgreSQL takes care of it.   <br/> But what is in the script (<code>create_db.sh</code>)?<br/><br/>  create database schema using file we copied into the image and finally it populates the database     with data. All the variables here are coming from the <code>.env</code> file mentioned before,     which makes it very easy to change your database name or username at any time without modifying     script itself.   <br/>      For more complete example please see my repository     <a href="https://github.com/MartinHeinz/blog-backend/tree/master/postgres">here</a> <br/> <a href="#" class="anchor"> </a>     What About <code>docker-compose</code>?   <br/>      In my experience, most of the time I end up running database in conjunction with the application     that is using it and the simplest way to do it is <em>docker-compose</em>. Usually I prefer to     refer to the <em>docker-compose</em> service by service name, rather then container name which     might or might not be the same thing. In case it isn&#x27;t<br/>     same, you can just following command:<br/> <br/>  docker exec -it $(docker-compose ps -q &lt;db_service_name&gt;) psql -U&lt;user_name&gt; -a &lt;db_name&gt; <br/> <br/>      Only real difference here from the previous examples is the <code>docker-compose</code> part,     which looks up information of the specified service. The <code>-q</code> flag make it so, that     only container IDs are displayed, which is all we need.   <br/> <a href="#" class="anchor"> </a>     Conclusion   <br/>      I hope at least some of these little hacks will make your life easier when dealing with Docker     and PostgreSQL or maybe if you were avoiding Docker just because it might be little annoying     when working with databases, then I hope you will give it a shot after reading this article. 🙂   <br/> </p>',
  },
  {
    title: 'Create Serverless API With Zeit Now',
    slug: 'create-serverless-api-with-zeit-now',
    status: 1,
    categoryIds: [6],
    description: '',
    content: '<p> For my side project, tracking of favourite TV shows, I created a simple API, that response with the list of data from RSS feed. To make it enjoyable and learn something new on away, I did a serverless infrastructure and wrote some thoughts on what I found out.<br/> If the concept of a serverless application is new to you, in a nutshell, it is a serverless Lambdas (functions) per entry point, stored in a third-party cloud infrastructure provider and executed on-demand — each function stored as a separate package. When you request to a specific endpoint, Lambda function boots up, executes the code and sends back a response.<br/> <a href="#" class="anchor"> </a>   Pros and Cons <br/> Consider the advantages and disadvantages of choosing serverless architecture over running a server yourself:<br/> </p><ul><li> Pros<br/> </li><ul><li>Maintainance - service provider is taking care of the server updates, patches, hardware</li><li>Cost - you pay for what you use; for a number of invocations or computational value</li><li>Security - each function is stored as a separate package per entry-point</li><li>Scaling - scales automatically</li></ul></ul><p> </p><ul><li> Cons<br/> </li><ul><li>Dependance from 3rd party vendor</li><li>Latency - functions need time to boot up</li><li>Not suitable for long-time running because of price</li><li>Hard to test and debug - challenging to replicate a serverless environment</li></ul></ul><p> </p><p> <a href="#" class="anchor"> </a>   Choosing provider <br/> As serverless architectures become more popular, more vendors offer their services. To mention popular ones: Amazon AWS Lambda, Google Cloud Function, Cloudflare Workers, Azure Functions.<br/> I looked into AWS and Google services and got lost in the documentation and sign up processes. It looked like too much of a set up for a quick test project.<br/> I&#x27;ve picked Zeit Now Serverless Functions for quick and easy setup, no need for configuration or optimization management.<br/> It supports React, Node.js, Go and many more. You write and push the code with Now, everything else managed automatically, and you receive an entry point to execute your function. Also, it has a free tier, that will probably cover your small project requirements.<br/> <a href="#" class="anchor"> </a>   Bootstrap project <br/> Zeit Now CLI offers quick templates to bootstrap your projects. If you still don&#x27;t have Now installed, you can do that by running following command in a terminal:<br/> <br/> npm i now -g <br/> To list templates, run:<br/> <br/> now init <br/> From the list, select the language or framework that you fancy.<br/> For my project, I use <code>vanilla-functions</code> template.<br/> <a href="#" class="anchor"> </a>   Create a Function For an Entry Point <br/> For <code>Now</code> to create an entry point and function to be valid, it must be placed under <code>/api</code> directory in the <code>root</code> of a project and exported as a default.<br/> A simple example of a function that sends back a greeting message as a response would be so:<br/> <br/> // api/greet.js module.exports = (req, res) =&gt; { res.send(&#x27;Welcome!&#x27;); } <br/> If you create a Node.js application, you will have access to some helpers, that is very similar to <code>express.js</code>:<br/> </p><ul><li>request.query</li><li>request.cookies</li><li>request.body</li><li>response.status()</li><li>response.json()</li><li>response.send()</li></ul><p> <a href="#" class="anchor"> </a>   Deployment <br/> Deployment with <code>Now</code> is a breeze. Just run a command in a terminal from your project <code>root</code> directory:<br/> <br/> now <br/> And see how everything is done for you. After a successful build you will get a deployed application address, similar to this:<br/> <code>https://vanilla-functions-bcb58vyrs.now.sh</code><br/> To send a request for a greeting message, add <code>/api/greet</code> suffix to the deployed address:<br/> <code>https://vanilla-functions-bcb58vyrs.now.sh/api/greet</code><br/> That&#x27;s it. We created a stupid simple API with a meaningful message.<br/> <a href="#" class="anchor"> </a>   Conclusion <br/> Serverless infrastructure can be easy to set up, and provider like Zeit Now makes this process friendly for developers. The majority of work is automated and can be done in just a few steps.<br/> Now it&#x27;s up to you, what&#x27;s going to happen inside the serverless functions.<br/> If you got interested, see more information about <a href="https://zeit.co/docs/v2/serverless-functions/introduction/">Now Serverless Functions</a>.<br/> </p>',
  },
  { title: 'EMPTY-DEMO-10', slug: 'empty-demo-10', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-10', content: '<p>EMPTY-CONTENT-10</p>' },
  { title: 'EMPTY-DEMO-11', slug: 'empty-demo-11', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-11', content: '<p>EMPTY-CONTENT-11</p>' },
  { title: 'EMPTY-DEMO-12', slug: 'empty-demo-12', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-12', content: '<p>EMPTY-CONTENT-12</p>' },
  { title: 'EMPTY-DEMO-13', slug: 'empty-demo-13', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-13', content: '<p>EMPTY-CONTENT-13</p>' },
  { title: 'EMPTY-DEMO-14', slug: 'empty-demo-14', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-14', content: '<p>EMPTY-CONTENT-14</p>' },
  { title: 'EMPTY-DEMO-15', slug: 'empty-demo-15', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-15', content: '<p>EMPTY-CONTENT-15</p>' },
  { title: 'EMPTY-DEMO-16', slug: 'empty-demo-16', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-16', content: '<p>EMPTY-CONTENT-16</p>' },
  { title: 'EMPTY-DEMO-17', slug: 'empty-demo-17', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-17', content: '<p>EMPTY-CONTENT-17</p>' },
  { title: 'EMPTY-DEMO-18', slug: 'empty-demo-18', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-18', content: '<p>EMPTY-CONTENT-18</p>' },
  { title: 'EMPTY-DEMO-19', slug: 'empty-demo-19', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-19', content: '<p>EMPTY-CONTENT-19</p>' },
  {
    title: 'What you missed in cybersecurity this week',
    slug: 'what-you-missed-in-cybersecurity-this-week',
    status: 1,
    categoryIds: [6],
    description: '',
    content: '<div class="article-content"><p id="speakable-summary">There’s not a week that goes by where cybersecurity doesn’t dominates the headlines. This week was no different. Struggling to keep up? We’ve collected some of the biggest cybersecurity stories from the week to keep you in the know and up to speed.</p><h3 id="maliciouswebsiteswereusedtosecretlyhackintoiphonesforyearssaysgoogle"><a href="https://techcrunch.com/2019/08/29/google-iphone-secretly-hacked/" style="color: rgb(70, 165, 102);">Malicious websites were used to secretly hack into iPhones for years, says Google</a></h3><p><strong>TechCrunch:</strong> This was the biggest iPhone security story of the year. Google researchers found a number of websites that were stealthily hacking into thousands of iPhones every week. The operation was carried out by China to target Uyghur Muslims, <a href="https://techcrunch.com/2019/08/31/china-google-iphone-uyghur/">according to sources</a>, and also <a href="https://www.forbes.com/sites/thomasbrewster/2019/09/01/iphone-hackers-caught-by-google-also-targeted-android-and-microsoft-windows-say-sources/">targeted Android and Windows users</a>. Google said it was an “indiscriminate” attack through the use of previously undisclosed so-called “zero-day” vulnerabilities.</p><div class="embed breakout"><blockquote class="wp-embedded-content" data-secret="Kf8dsEfZXr" style="display: none;"><p><a href="https://techcrunch.com/2019/08/29/google-iphone-secretly-hacked/">Malicious websites were used to secretly hack into iPhones for years, says Google</a></p></blockquote><p><iframe title="“Malicious websites were used to secretly hack into iPhones for years, says Google” — TechCrunch" class="wp-embedded-content" sandbox="allow-scripts" security="restricted" src="https://techcrunch.com/2019/08/29/google-iphone-secretly-hacked/embed/#?secret=Kf8dsEfZXr" data-secret="Kf8dsEfZXr" width="800" height="245"></iframe></p></div><h3 id="hackerscouldstealateslamodelsbycloningitskeyfobagain"><a href="https://www.wired.com/story/hackers-steal-tesla-model-s-key-fob-encryption/" style="color: rgb(70, 165, 102);">Hackers could steal a Tesla Model S by cloning its key fob — again</a></h3><p><strong>Wired:</strong> For the second time in two years, researchers found a serious flaw in the key fobs used to unlock Tesla’s Model S cars. It’s the second time in two years that hackers have successfully cracked the fob’s encryption. Turns out the encryption key was doubled in size from the first time it was cracked. Using twice the resources, the researchers cracked the key again. The good news is that a software update can fix the issue.</p><h3 id="microsoftsleadeudatawatchdogislookingintofreshwindows10privacyconcerns"><a href="https://techcrunch.com/2019/08/27/microsofts-lead-eu-data-watchdog-is-looking-into-fresh-windows-10-privacy-concerns/" style="color: rgb(70, 165, 102);">Microsoft’s lead EU data watchdog is looking into fresh Windows 10 privacy concerns</a></h3><p><strong>TechCrunch:</strong> Microsoft could be back in hot water with the Europeans after the Dutch data protection authority asked its Irish counterpart, which oversees the software giant, to investigate Windows 10 for allegedly breaking EU data protection rules. A chief complaint is that Windows 10 collects too much telemetry from its users. Microsoft <a href="https://techcrunch.com/2017/10/13/microsofts-windows-10-breaches-privacy-law-says-dutch-dpa/">made some changes</a> after the issue was brought up for the first time in 2017, but the Irish regulator is looking at if these changes go far enough — and if users are adequately informed. Microsoft could be fined up to 4% of its global annual revenue if found to have flouted the law. Based off 2018’s figures, Microsoft could see fines as high as $4.4 billion.</p><div class="embed breakout"><blockquote class="wp-embedded-content" data-secret="SrwEgkCxmF" style="display: none;"><p><a href="https://techcrunch.com/2019/08/27/microsofts-lead-eu-data-watchdog-is-looking-into-fresh-windows-10-privacy-concerns/">Microsoft’s lead EU data watchdog is looking into fresh Windows 10 privacy concerns</a></p></blockquote><p><iframe title="“Microsoft’s lead EU data watchdog is looking into fresh Windows 10 privacy concerns” — TechCrunch" class="wp-embedded-content" sandbox="allow-scripts" security="restricted" src="https://techcrunch.com/2019/08/27/microsofts-lead-eu-data-watchdog-is-looking-into-fresh-windows-10-privacy-concerns/embed/#?secret=SrwEgkCxmF" data-secret="SrwEgkCxmF" width="800" height="260"></iframe></p></div><h3 id="uscyberattackhurtiransabilitytotargetoiltankersofficialssay"><a href="https://www.nytimes.com/2019/08/28/us/politics/us-iran-cyber-attack.html" style="color: rgb(70, 165, 102);">U.S. cyberattack hurt Iran’s ability to target oil tankers, officials say</a></h3><p><strong>The New York Times:</strong> A secret <a href="https://techcrunch.com/2018/09/21/trumps-new-cyber-strategy-eases-rules-on-use-of-government-cyberweapons/">cyberattack</a> against Iran in June but only reported this week significantly degraded Tehran’s ability to track and target oil tankers in the region. It’s one of <a href="https://techcrunch.com/2018/10/23/first-cyber-operation-gentle-approach-russian-trolls/">several recent offensive operations</a> against a foreign target by the U.S. government in recent moths. Iran’s military seized a British tanker in July in retaliation over a U.S. operation that downed an Iranian drone. According to a senior official, the strike “diminished Iran’s ability to conduct covert attacks” against tankers, but sparked concern that Iran may be able to quickly get back on its feet by fixing the vulnerability used by the Americans to shut down Iran’s operation in the first place.</p><h3 id="appleisturningsiriaudioclipreviewoffbydefaultandbringingitinhouse"><a href="https://techcrunch.com/2019/08/28/apple-is-turning-siri-audio-clip-review-off-by-default-and-bringing-it-in-house/" style="color: rgb(70, 165, 102);">Apple is turning Siri audio clip review off by default and bringing it in house</a></h3><p><strong>TechCrunch: </strong>After Apple was caught paying contractors to review Siri queries without user permission, the technology giant said this week it will turn off <a href="https://techcrunch.com/2019/07/26/siri-recordings-regularly-sent-to-apple-contractors-for-analysis-claims-whistleblower/">human review</a> of Siri audio by default and bringing any opt-in review in-house. That means users actively have to allow Apple staff to “grade” audio snippets made through Siri. Apple began audio grading to improve the Siri voice assistant. <a href="https://techcrunch.com/2019/07/03/amazon-responds-to-a-u-s-senators-inquiry-confirms-alexa-voice-records-are-kept-indefinitely/">Amazon</a>, <a href="https://techcrunch.com/2019/08/13/facebook-contractors-said-to-have-collected-and-transcribed-users-audio-without-permission/">Facebook</a>, <a href="https://techcrunch.com/2019/07/11/google-is-investigating-the-source-of-voice-data-leak-plans-to-update-its-privacy-policies/">Google</a>, and <a href="https://techcrunch.com/2019/08/15/microsoft-tweaks-privacy-policy-to-admit-humans-can-listen-to-skype-translator-and-cortana-audio/">Microsoft</a> have all been caught out using contractors to review user-generated audio.</p><div class="embed breakout"><blockquote class="wp-embedded-content" data-secret="elSrr8m6yH" style="display: none;"><p><a href="https://techcrunch.com/2019/08/28/apple-is-turning-siri-audio-clip-review-off-by-default-and-bringing-it-in-house/">Apple is turning Siri audio clip review off by default and bringing it in house</a></p></blockquote><p><iframe title="“Apple is turning Siri audio clip review off by default and bringing it in house” — TechCrunch" class="wp-embedded-content" sandbox="allow-scripts" security="restricted" src="https://techcrunch.com/2019/08/28/apple-is-turning-siri-audio-clip-review-off-by-default-and-bringing-it-in-house/embed/#?secret=elSrr8m6yH" data-secret="elSrr8m6yH" width="800" height="246"></iframe></p></div><h3 id="hackersareactivelytryingtostealpasswordsfromtwowidelyusedvpns"><a href="https://arstechnica.com/information-technology/2019/08/hackers-are-actively-trying-to-steal-passwords-from-two-widely-used-vpns/" style="color: rgb(70, 165, 102);">Hackers are actively trying to steal passwords from two widely used VPNs</a></h3><p><strong>Ars Technica:</strong> Hackers are targeting and exploiting vulnerabilities in two popular corporate virtual private network (VPN) services. Fortigate and Pulse Secure let remote employees tunnel into their corporate networks from outside the firewall. But these VPN services contain flaws which, if exploited, could let a skilled attacker tunnel into a corporate network without needing an employee’s username or password. That means they can get access to all of the internal resources on that network — potentially leading to a major data breach. News of the attacks came a month after the vulnerabilities in widely used corporate VPNs <a href="https://techcrunch.com/2019/07/23/corporate-vpn-flaws-risk/">were first revealed</a>. Thousands of vulnerable endpoints exist — months after the bugs were fixed.</p><h3 id="grandjuryindictsallegedcapitalonehackerovercryptojackingclaims"><a href="https://techcrunch.com/2019/08/28/federal-grand-jury-indicts-paige-thompson-on-two-counts-related-to-the-capital-one-data-breach/" style="color: rgb(70, 165, 102);">Grand jury indicts alleged Capital One hacker over cryptojacking claims</a></h3><p><strong>TechCrunch:</strong> And finally, just when you thought the Capital One breach <a href="https://techcrunch.com/2019/07/29/capital-one-breach-was-inevitable/">couldn’t get any worse</a>, it does. A federal grand jury said the accused hacker, Paige Thompson, should be indicted on new charges. The alleged hacker is said to have created a tool to detect cloud instances hosted by Amazon Web Services with misconfigured web firewalls. Using that tool, she is accused of breaking into those cloud instances and installing cryptocurrency mining software. This is <a href="https://techcrunch.com/2019/04/25/cryptojacking-nsa-malware/">known as “cryptojacking,”</a> and relies on using computer resources to mine cryptocurrency.</p><div class="embed breakout"><blockquote class="wp-embedded-content" data-secret="7Chy4Z8d7m" style="display: none;"><p><a href="https://techcrunch.com/2019/08/28/federal-grand-jury-indicts-paige-thompson-on-two-counts-related-to-the-capital-one-data-breach/">Federal grand jury indicts Paige Thompson on two counts related to the Capital One data breach</a></p></blockquote><p><iframe title="“Federal grand jury indicts Paige Thompson on two counts related to the Capital One data breach” — TechCrunch" class="wp-embedded-content" sandbox="allow-scripts" security="restricted" src="https://techcrunch.com/2019/08/28/federal-grand-jury-indicts-paige-thompson-on-two-counts-related-to-the-capital-one-data-breach/embed/#?secret=7Chy4Z8d7m" data-secret="7Chy4Z8d7m" width="800" height="275"></iframe></p></div></div>',
  },
  {
    title: 'Meet Olli 2.0, a 3D-printed autonomous shuttle',
    slug: 'meet-olli-20-a-3d-printed-autonomous-shuttle',
    status: 1,
    categoryIds: [6],
    description: '',
    content: '<p>From afar, Olli resembles many of the “future is now!” electric autonomous shuttles that have popped up in recent years.<br/>The tall rectangular pod, with its wide-set headlights and expansive windows nestled between a rounded frame, gives the shuttle a friendly countenance that screams, ever so gently, “come along, take a ride.”<br/>But Olli is different in almost every way, from how it’s produced to its origin story. And now, its maker, <a href="https://crunchbase.com/organization/local-motors" target="_blank" data-type="organization" data-entity="local-motors" class="crunchbase-link">Local Motors, </a> has given Olli an upgrade in hopes of accelerating the adoption of its autonomous shuttles.<br/>Meet Olli 2.0, a 3D-printed connected electric autonomous shuttle that Rogers says will hasten its ubiquity.<br/>“The future is here; it’s just not evenly distributed,” Local Motors co-founder and CEO John B. Rogers Jr. said in a recent interview. “That’s something I say a lot. Because people often ask me, ‘Hey, when will I see this vehicle? 2023? What do you think?’ My response: It’s here now, it’s just not everywhere.”<br/>Whether individuals will adopt Rogers’ vision of the future is another matter. But he argues that Olli 1.0 has already been a persuasive ambassador.<br/></p><div class="media-wrap image-wrap"></div><p><br/>Olli 1.0 made its debut in 2016 when it launched in National Harbor, Md., at a planned mixed-use development a few miles south of Washington, D.C. In the two years since, Olli has shown up at events such as LA Automobility, and been featured by various media outlets, including <a href="https://techcrunch.com/2016/06/16/ibms-watson-makes-a-move-into-self-driving-cars-with-olli-a-minibus-from-local-motors/">this one</a>.  Heck, even <a href="https://www.youtube.com/watch?v=4XDwxvCQozg">James Cordon</a> rode in it.<br/>Local Motors, which was founded in 2007, and its Olli 1.0 shuttle are familiar figures in the fledgling autonomous vehicle industry. But they’re often overshadowed by the likes of Argo AI, Cruise, Uber and Waymo — bigger companies that are all pursuing robotaxis designed for cities.<br/>Olli, meanwhile, is designed for campuses, low-speed environments that include hospitals, military bases and universities.<br/>“The public isn’t going to see New York City with autonomous vehicles running around all the time (any time soon),” Rogers said. Campuses, on the other hand, are a sweet spot for companies like Local Motors that want to deploy now. These are places where mobility is needed and people are able to get up close and personal with a “friendly robot” like Olli, Rogers said. <br/>Olli 2.0<br/>Olli and Olli 2.0 are clearly siblings. The low-speed vehicle has the same general shape, and a top speed of 25 miles per hour. And both have been <a href="https://www.theverge.com/2019/3/8/18255176/local-motors-olli-3d-printed-self-driving-shuttle-crash-test-footage">crash tested</a> by Local Motors and come with Level 4 autonomous capability, a designation by the SAE that means the vehicle can handle all aspects of driving in certain conditions without human intervention.<br/>Olli 2.0 has a lot more range — up to 100 miles on a single charge, according to its spec sheet. The manufacturing process has been improved, and Olli 2.0 is now 80% 3D-printed and has hub motors versus the axle wheel motors in its predecessor. In addition, there are two more seats in Olli 2.0 and new programmable lighting.<br/>But where Olli 2.0 really stands out is in the improved user interface and more choices for customers looking to customize the shuttle to suit specific needs. As Rogers recently put it, “We can pretty much make anything they ask for with the right partners.”<br/></p><div class="media-wrap image-wrap"><a style="display:inline-block" href="https://techcrunch.com/wp-content/uploads/2019/08/Ollieyes1-1.jpg"></a></div><p><br/>The outside of Olli 2.0 is outfitted with a PA system and screens on the front and back to address pedestrians. The screen in the front can be shown as eyes, making Olli 2.0 more approachable and anthropomorphic.<br/>Inside the shuttle, riders will find better speakers and microphones and touchscreens. Local Motors has an open API, which allows for an endless number of UI interfaces. For instance, LG is customizing media content for Olli based on the “5G future,” according to Rogers, who said he couldn’t provide more details just yet.<br/>AR and VR can also be added, if a customer desires. The interior can be changed to suit different needs as well. For instance, a hospital might want fewer seats and more room to transport patients on beds. It’s this kind of customization that Rogers believes will give Local Motors an edge over autonomous shuttle competitors.<br/></p><div class="media-wrap image-wrap"><a style="display:inline-block" href="https://techcrunch.com/wp-content/uploads/2019/08/Olli_2.0_Interior.jpg"></a></div><p><br/>Even the way Olli 2.0 communicates has been improved.<br/>Olli 1.0 used IBM Watson, the AI platform from IBM, for its natural language and speech to text functions. Olli 2.0 has more options. Natural language voice can use Amazon’s deep learning chatbot service Lex and IBM Watson. Customers can choose one or even combine them. Both can be altered to make the system addressable to “Olli.”<br/>The many people behind Olli<br/>In the so-called race to deploy autonomous vehicles, Local Motors is a participant that is difficult to categorize or label largely due to how it makes its shuttles.<br/>It’s not just that Local Motors’ two micro factories — at its Chandler, Ariz. headquarters and in Knoxville, Tenn. — are a diminutive 10,000 square feet. Or that these micro factories lack the tool and die and stamping equipment found in a traditional automaker’s factory. Or even that Olli is 3D-printed.<br/>A striking and perhaps less obvious difference is how Olli and other creations from Local Motors, and its parent company Local Motors Industries, come to life. LMI has a co-creation and low-volume local production business model. The parent company’s <a href="https://launchforth.io/">Launch Forth</a> unit manages a digital design community of tens of thousands of engineers and designers that co-creates products for customers. Some of those mobility creations go to Local Motors, which uses its low-volume 3D-printed micro factories to build Olli and <a href="https://launchforth.io/Subhadra20/refine-olli-20/overview/">Olli 2.0</a>, as well as other products like the Rally Fighter.<br/>This ability to tap into its community and its partnerships with research labs, combined with direct digital manufacturing and its micro factories, is what Rogers says allows it to go from design to mobile prototype in weeks, not months — or even years.<br/><br/>The company issues challenges to the community. The winner of a challenge gets a cash prize and is awarded royalties as the product is commercialized. <span><span>In 2016, a Bogota, Colombia man named <a href="https://www.npr.org/sections/alltechconsidered/2016/06/29/471599187/a-24-year-old-designed-a-self-driving-minibus-maker-built-it-in-weeks">Edgar Sarmiento</a> won the Local Motors challenge to </span></span>design an urban public transportation system. His design eventually became Olli.<br/>(Local Motors uses the <a href="https://localmotors.com/pacificnw/">challenges model</a> to determine where Olli will be deployed, as well.)<br/>New design challenges are constantly being launched to improve the UI and services of Olli, as well as other products. But even that doesn’t quite capture the scope of the co-creation. Local Motors partners with dozens of companies and research organizations. Its 3D-printing technology comes from <a href="https://www.oakridger.com/news/20171114/microfactory-for-local-motors-only-short-distance-from-oak-ridge">Oak Ridge National Laboratory</a>, and Olli itself involves a who’s who in the sensor, AV and supplier communities.<br/>Startup Affectiva provides Olli’s cognition system, such as facial and mood tracking of its passengers and dynamic route optimization, while Velodyne, Delphi, Robotic Research and Axis Communications handle the perception stack of the self-driving shuttle, according to Local Motors. Nvidia and Sierra Wireless provide much of the Human Machine Interface. Other companies that supply the bits and pieces to Olli include Bosch, Goodyear, Protean and Eastman, to name just a few.<br/>Where in the world is Olli?<br/>Today, Olli 1.0 is deployed on nine campuses, the most recent ones at the <a href="https://localmotors.com/greater-washington-challenge/">Joint Base Myer – Henderson Hall</a>, a joint base of the U.S. military located around Arlington, Va., which is made up of Fort Myer, Fort McNair and Henderson Hall. Olli was also introduced recently in Rancho Cordova, near Sacramento, Calif.<br/>Production of Olli 2.0 began in July and deliveries will begin in the fourth quarter of this year. In the meantime, three more Olli shuttle deployments are coming up in the next six weeks or so, according to Local Motors, which didn’t provide further details.<br/>Production of Olli 1.0 will phase out in the coming months as customer orders are completed. Olli will soon head to Europe, as well, with Local Motors planning to build its third micro factory in the region.</p>',
  },
 {
    title: 'Bear Robotics is raising big bucks for robots that deliver food to restaurant patrons',
    slug: 'bear-robotics-is-raising-big-bucks-for-robots-that-deliver-food-to-restaurant-patrons',
    status: 1,
    categoryIds: [6],
    description: '',
    content: '<p><a href="https://www.cnbc.com/2019/08/29/elon-musk-ai-will-make-jobs-kind-of-pointless-so-study-this.html">Some days</a>, it feels like there’s almost no end to the number of jobs that might be replaced altogether or in some part by smart machines, from <a href="https://med.stanford.edu/news/all-news/2018/11/ai-outperformed-radiologists-in-screening-x-rays-for-certain-diseases.html">radiologists</a> to <a href="https://www.atbs.com/knowledge-hub/trucking-blog/self-driving-trucks-are-truck-drivers-out-of-a-jo">truck drivers</a> to, gulp, <a href="https://observer.com/2019/07/journalism-robots-reporters-jobs-artificial-intelligence/">journalists</a>. You might be tempted to sob about it to your friendly restaurant server, but wait! It’s a robot, too!<br/>So it may be if the 25-person, Redwood City, Calif.,-based startup <a href="https://www.bearrobotics.ai/">Bear Robotics</a> has its way. The two-year-old company makes “robots that help,” and specifically, it makes robots that help deliver food to restaurant customers.<br/>It’s a market that’s seemingly poised for disruption. As Bear says in its own literature about the company, it was founded to address the “increased pressure faced by the food service industry around wages, labor supply, and cost efficiencies.”<br/>CEO John Ha, a former Intel research scientist turned longtime technical lead at Google who also opened, then closed, his <a href="https://www.yelp.com/biz/kang-nam-tofu-house-milpitas">own restaurant</a>, witnessed the struggle firsthand. As the child (and grandchild) of restaurateurs, this editor can also attest that owning and operating restaurants is a tricky proposition, given the expenses and — even more plaguing oftentimes — the turnover that goes with it.<br/>Investors are apparently on board with the idea with robot servers. According to a new <a href="https://www.sec.gov/Archives/edgar/data/1786432/000178643219000001/xslFormDX01/primary_doc.xml">SEC filing</a>, Bear has so far locked down at least $10.2 million from a dozen investors on its way to closing a $35.8 million round. That’s not a huge sum for many startups today, but it’s notable for a food service robot startup, one whose first model, “Penny,” spins around R2-D2-like, gliding between the kitchen and dining tables with customers’ food as it is prepared.<br/>At least, this is what will theoretically happen once Bear begins lining up restaurants that will pay the company via a monthly subscription that includes the robot, setup and mapping of the restaurant (so Penny doesn’t collide with things), along with technical support.<br/>In the meantime, Bear’s backers, which the startup has yet to reveal, may be taking a cue in part from Alibaba, which last year opened a <a href="https://thespoon.tech/alibaba-opens-robot-restaurant-as-automation-expands-around-the-globe/">highly automated restaurant</a> in Shanghai where small robots slide down tracks to deliver patrons’ meals.<br/>They may also be looking at the bigger picture, wherein everything inside restaurants is getting automated — from robotic chefs that fry up ingredients to table-mounted self-pay tablets — with servers one of the last pieces of the puzzle to be addressed.<br/>That doesn’t mean Bear or other like-minded startups will take off any time soon in restaurants that <em>aren’t</em> offering a futuristic experience. One of the reasons that people have always headed to restaurants is for good-old human interaction. In fact, with <a href="https://www.forbes.com/sites/michelinemaynard/2019/01/27/ready-when-i-get-there-mobile-takeout-is-a-rising-restaurant-trend/#39f65b2312f5">take-out ordering on the rise</a>, people — waiters, bartenders, restaurant owners who flit around the dining room to say hello — may prove one of the only reasons that customers show up at all.</p>',
  },
  {
    title: 'YouTube Kids launches on the web',
    slug: 'youtube-kids-launches-on-the-web',
    status: 1,
    categoryIds: [6],
    description: '到目前为止，宜家在智能家居领域的投资一直都很聪明，但也很分散。本周，这个瑞典家居用品巨头表示，将设立全新的业务部门来专注于智能家居业务。',
    content: '<p> </p><div class="media-wrap image-wrap"><img alt="" class="media-wrap image-wrap" src="https://files.techcrunch.cn/2019/08/535975.jpg?w=738"/></div><p>到目前为止，宜家在智能家居领域的投资一直都很聪明，但也很分散。本周，这个瑞典家居用品巨头表示，将设立全新的业务部门来专注于智能家居业务。<br/> 该公司的智能家居项目开始于 2012 年，专注于无线充电和智能照明。自那时以来，宜家在这两大领域都进行了多次尝试，为其家具产品开发自安装、集成的无线充电器，以及光/充电器组合，并且与 Sonos 达成合作，开发 <a href="https://techcrunch.com/2019/07/25/sonos-and-ikeas-symfonisk-wireless-speakers-are-a-symphony-of-sound-and-design/" target="_blank">Symfonisk 系列无线智能音箱</a>。<br/> 宜家的目标是成为未来智能家居产品的中枢，不仅从硬件角度，也会通过其 Home 智能应用。宜家今年 6 月宣布，将<a href="https://techcrunch.com/2017/05/23/ikeas-smart-light-bulbs-will-work-with-amazon-alexa-apple-siri-and-google-assistant/" target="_blank">互联灯泡品牌 Tradfri</a> 升级至 Home。在 Symfonisk 的发布会上，宜家曾表示，该公司对 Home 应用有着更远大的目标，希望将其发展成为用户控制智能家居的中枢<br/> 新成立的宜家家居智能业务负责人比昂·布洛克（Bjorn Block）表示：“在宜家，我们希望继续为未来许多人提供更棒的家居生活产品。因此，我们需要探索除传统家居之外的产品和解决方案。”<br/> 宜家还表示，这将是自 “儿童宜家” 产品线推出以来，宜家在整体业务和品牌方面最重要的新核心领域。<br/> Sonos 和宜家之间关于 Symfonisk 的合作将是长期的。两家公司都表示，未来可能会有更多产品出现在这个团队。不过听起来，宜家似乎打算探索智能家居技术可能如何影响其业务的方方面面。因此可以预计，作为这一新投资重点的成果，宜家将会达成新的合作，推出更多新的产品品类。<br/> 翻译：维金<br/> <a href="https://techcrunch.com/2019/08/17/ikea-doubles-down-on-smart-home-tech-with-new-business-unit/" target="_blank">Ikea doubles down on smart home tech with new business unit</a><br/> </p>',
  },
  { title: 'EMPTY-DEMO-20', slug: 'empty-demo-20', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-20', content: '<p>EMPTY-CONTENT-20</p>' },
  { title: 'EMPTY-DEMO-21', slug: 'empty-demo-21', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-21', content: '<p>EMPTY-CONTENT-21</p>' },
  { title: 'EMPTY-DEMO-22', slug: 'empty-demo-22', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-22', content: '<p>EMPTY-CONTENT-22</p>' },
  { title: 'EMPTY-DEMO-23', slug: 'empty-demo-23', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-23', content: '<p>EMPTY-CONTENT-23</p>' },
  { title: 'EMPTY-DEMO-24', slug: 'empty-demo-24', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-24', content: '<p>EMPTY-CONTENT-24</p>' },
  { title: 'EMPTY-DEMO-25', slug: 'empty-demo-25', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-25', content: '<p>EMPTY-CONTENT-25</p>' },
  { title: 'EMPTY-DEMO-26', slug: 'empty-demo-26', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-26', content: '<p>EMPTY-CONTENT-26</p>' },
  { title: 'EMPTY-DEMO-27', slug: 'empty-demo-27', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-27', content: '<p>EMPTY-CONTENT-27</p>' },
  { title: 'EMPTY-DEMO-28', slug: 'empty-demo-28', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-28', content: '<p>EMPTY-CONTENT-28</p>' },
  { title: 'EMPTY-DEMO-29', slug: 'empty-demo-29', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-29', content: '<p>EMPTY-CONTENT-29</p>' },
  {
    title: '树莓派 4 无法兼容所有 USB-C 线缆',
    slug: 'raspberry-pi-4-usb3',
    status: 1,
    categoryIds: [6],
    description: '树莓派 4（Raspberry Pi 4）是一只体型小巧的性能怪，但科技博主泰勒·沃德（Tyler Ward）在它的 USB Type-C 连接器中发现了一个缺陷。树莓派基金会（Raspberry Pi Foundation）向科技媒体 TechRepublic 证实了设计缺陷的存在，即树莓派 4 可能无法兼容某些类型的 USB-C 线缆。',
    content: '<p> </p><div class="media-wrap image-wrap"><img alt="" class="media-wrap image-wrap" src="https://files.techcrunch.cn/2019/07/raspberry-pi-4-8b.jpg?w=738"/></div><p>树莓派 4（Raspberry Pi 4）是一只<a href="https://techcrunch.com/2019/06/23/the-raspberry-pi-foundation-unveils-the-raspberry-pi-4/" target="_blank">体型小巧的性能怪</a>，但科技博主泰勒·沃德（Tyler Ward）在它的 USB Type-C 连接器中<a href="https://www.scorpia.co.uk/2019/06/28/pi4-not-working-with-some-chargers-or-why-you-need-two-cc-resistors/" target="_blank">发现了一个缺陷</a>。树莓派基金会（Raspberry Pi Foundation）向科技媒体 TechRepublic <a href="https://www.techrepublic.com/article/your-new-raspberry-pi-4-wont-power-on-usb-c-cable-problem-now-officially-confirmed/" target="_blank">证实</a>了设计缺陷的存在，即树莓派 4 可能无法兼容某些类型的 USB-C 线缆。<br/> 这个问题倒不至于让我们一票否决树莓派 4，而且我们应该会看到未来版本的电路板会采用正确的 USB-C 协议。但如果你绞尽脑汁也搞不明白为什么连上 USB-C 线缆后无法给树莓派供电，现在你知道原因了。<br/> 树莓派基金会发布了电路板的原理图，我们可以从中看到，它少用了一个碳素混合体电阻，其作用是让复杂的充电器为设备供电。<br/> 鉴于 USB-C 是一种复杂的连接器，而且一些线缆是带电子标记的，这意味着它们内置了集成芯片，用以为各种设备提供支持。<br/> 举例来说，你可以使用 MacBook Pro 的充电器为很多种 USB-C 接口的设备供电，充电器能够自行判断它要为设备输送多大功率的电流。<br/> 但树莓派 4 不支持带电子标记的线缆，比如苹果推出的 USB-C 线缆以及谷歌 Pixel 3 采用的线缆。如果使用这样的线缆，树莓派 4 会被错误地识别为音频适配器。<br/> 幸运的是，这不会对树莓派 4 造成损坏，而且也没有引发火灾的风险，只不过是无法为树莓派 4 供电。<br/> “我预计这会在未来版本的电路板中得到修复，但眼下用户将需要采用我们建议的解决方法。令人惊讶的是，这个问题没有在我们（相当广泛的）现场测试中出现。” 树莓派基金会创始人埃本·厄普顿（Eben Upton）告诉 TechRepublic。<br/> 一个简单的解决方法是，购买不带电子标记的线缆或充电器，比如树莓派基金会官方正在销售的这款 <a href="https://www.raspberrypi.org/products/type-c-power-supply/" target="_blank">8 美元的 USB-C 充电器</a>。在笔者过去几周的测试中，树莓派 4 一直运转良好。<br/> 翻译：王灿均（<a href="https://www.douban.com/people/remexwang/" target="_blank">@何无鱼</a>）<br/> <a href="https://techcrunch.com/2019/07/09/the-raspberry-pi-4-doesnt-work-with-all-usb-c-cables/?tdsourcetag=s_pctim_aiomsg" target="_blank">The Raspberry Pi 4 doesn’t work with all USB-C cables</a><br/> </p>',
  },
  {
    title: '苹果今年和明年新款 MacBook 将采用全新键盘设计',
    slug: 'macbook-2019-keyboard',
    status: 1,
    categoryIds: [6],
    description: '跟踪苹果的知名分析师郭明錤发布的一份最新报告称，苹果将更换 MacBook Air 和 MacBook Pro 电脑中键盘的底层技术。郭明錤的预测通常都是准确的，这些消息来自苹果的供应链。',
    content: '<p> </p><div class="media-wrap image-wrap"><img alt="" class="media-wrap image-wrap" src="https://files.techcrunch.cn/2019/07/macbookprotouchbarediting2.jpg?w=738"/></div><p>跟踪苹果的知名分析师郭明錤发布的<a href="https://9to5mac.com/2019/07/04/kuo-new-keyboard-macbook-air-pro/" target="_blank">一份最新报告</a>称，苹果将更换 MacBook Air 和 MacBook Pro 电脑中键盘的底层技术。郭明錤的预测通常都是准确的，这些消息来自苹果的供应链。<br/> 郭明錤在最新报告中表示，将于今年晚些时候推出的全新 MacBook Air 机型将会搭载新的键盘设计，新款 MacBok Pro 也是如此。不过郭明錤表示，后者至少要到 2020 年才会推出。新产品将放弃当前一代的 “蝴蝶” 键盘设计，转而使用基于 “剪刀开关” 的键盘。目前苹果单独售卖的 Magic Keyboard 也采用剪刀开关设计。<br/> 苹果在 MacBook 中使用的蝴蝶型开关键盘一直受到用户的批评。用户不断投诉键帽脱落和容易重复击键等问题（从 2015 年以来，我自己在多款 MacBook Pro 机型上都遇到过这种情况）。这些问题通常可以通过用压缩空气清理键帽下的脏物来解决，但用户也提出苹果需要更换键盘元件。<br/> 苹果最新款 MacBook Pro 于<a href="https://techcrunch.com/2019/05/21/apple-announces-new-macbook-pros-with-more-powerful-processors-and-yes-updated-keyboards/" target="_blank">今年早些时候推出</a>，搭载了重新设计的蝴蝶键盘，采用 “新材料” 来协助解决这些问题。苹果最近还启动了 MacBook、MacBook Air 和 MacBook Pro 的免费键盘更换计划，覆盖所有搭载蝴蝶键盘的 MacBook 型号。不过，如果郭明錤的报告是准确的，那么看起来苹果正在采取更永久性的解决办法。<br/> 一如既往，任何来自第三方、未发布的产品传闻都值得怀疑。不过，郭明錤以往的消息准确性，以及苹果目前键盘设计存在的问题为这方面的传闻增加可信度。<br/> 翻译：维金<br/> <a href="https://techcrunch.com/2019/07/04/apple-reportedly-shifting-to-new-keyboard-design-in-2019-2020-macbooks/" target="_blank">Apple reportedly shifting to new keyboard design in 2019/2020 MacBooks</a><br/> </p>',
  },
  {
    title: '亚马逊推出 3 代 Kindle Oasis，加入色温调节功能',
    slug: 'kindle-oasis-s',
    status: 1,
    categoryIds: [6],
    description: '',
    content: '<p> </p><div class="media-wrap image-wrap"><img alt="" class="media-wrap image-wrap" src="https://files.techcrunch.cn/2019/06/kindle-oasis-front-light.jpg?w=738"/></div><p>对电子书阅读器爱好者来说，<a href="https://techcrunch.com/2017/10/31/amazons-new-kindle-oasis-is-the-best-e-reader-a-lot-of-money-can-buy/" target="_blank">Kindle Oasis</a> 可以说是最好的产品了。在这个产品类别中，亚马逊是挺立到最后的巨头玩家（除非你认为巴诺书店还算 “挺立” 着），而 Oasis 是他们制造的最好 Kindle，货真价实。在 2017 年年底时，我曾对当时最新款的 Oasis 进行过评测，我十分享受使用它的美好时光。<br/> 现在，亚马逊对 Oasis 进行了迭代，让这份美好继续延续。但首先需要说清楚的是，跟最近标准版 Kindle 获得的升级一样，Oasis 这次的升级幅度也很小。从外观上看，新款 Oasis 保留了前代产品的所有优点，包括 7 英寸、300ppi 的显示屏，以及翻页实体按钮。<br/> 这次的重大变化在于，新款 Oasis 加入了调节显示屏色温的功能，这能够让用户在白天阅读时眼睛更加舒适，以及在夜里阅读后更好地入眠。此外，新款设备还内置了一个选项，可以全天自动调节显示屏色温。<br/> </p><div class="media-wrap image-wrap"><a style="display:inline-block" href="https://files.techcrunch.cn/2019/06/kindle-oasis-graphite-front.jpg" target="_blank"><img class="media-wrap image-wrap" alt="" src="https://files.techcrunch.cn/2019/06/kindle-oasis-graphite-front.jpg?w=1200&amp;h=1200"/></a></div><p><br/> 老实说，这就是新款 Oasis 的主要新卖点了。此外，它还采用了新一代的电子墨水屏技术，虽然分辨率与前代产品相同，但却提供了更高的刷新率，从而让翻页速度加快（稍后我会就此更新报道），这顺应的是科技迈向更快速度的潮流。在这里，我就不深入讲这项技术的显著优势了，这些年媒体已经做过大量的报道。<br/> 来自前代产品的功能还包括 IPX8 级防水，这意味着 Oasis 可以放在最深 2 米的水下长达 1 小时。内置的蓝牙功能可以让用户通过 Audible 收听有声读物，机身背部则采用了金属材质。<br/> 与 2017 年款一样，新款 Oasis 的 8GB 版本起价为 250 美元，32GB 版本起价为 280 美元（如果你想要无广告版本，还得再多破费一些）。亚马逊向购买新款 Oasis 的用户赠送了 6 个月的 Kindle Unlimited 服务。从周三开始，用户可以进行预订，这款产品将于 7 月 24 日开始发货，届时还有一系列不同的保护套可供选购。<br/> 翻译：王灿均（<a href="https://www.douban.com/people/remexwang/" target="_blank">@何无鱼</a>）<br/> <a href="https://techcrunch.com/2019/06/19/amazon-adds-color-adjustable-lighting-to-its-best-kindle/" target="_blank">Amazon adds color adjustable lighting to its best Kindle</a><br/> </p>',
  },
  { title: 'EMPTY-DEMO-30', slug: 'empty-demo-30', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-30', content: '<p>EMPTY-CONTENT-30</p>' },
  { title: 'EMPTY-DEMO-31', slug: 'empty-demo-31', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-31', content: '<p>EMPTY-CONTENT-31</p>' },
  { title: 'EMPTY-DEMO-32', slug: 'empty-demo-32', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-32', content: '<p>EMPTY-CONTENT-32</p>' },
  { title: 'EMPTY-DEMO-33', slug: 'empty-demo-33', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-33', content: '<p>EMPTY-CONTENT-33</p>' },
  { title: 'EMPTY-DEMO-34', slug: 'empty-demo-34', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-34', content: '<p>EMPTY-CONTENT-34</p>' },
  { title: 'EMPTY-DEMO-35', slug: 'empty-demo-35', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-35', content: '<p>EMPTY-CONTENT-35</p>' },
  { title: 'EMPTY-DEMO-36', slug: 'empty-demo-36', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-36', content: '<p>EMPTY-CONTENT-36</p>' },
  { title: 'EMPTY-DEMO-37', slug: 'empty-demo-37', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-37', content: '<p>EMPTY-CONTENT-37</p>' },
  { title: 'EMPTY-DEMO-38', slug: 'empty-demo-38', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-38', content: '<p>EMPTY-CONTENT-38</p>' },
  { title: 'EMPTY-DEMO-39', slug: 'empty-demo-39', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-39', content: '<p>EMPTY-CONTENT-39</p>' },
  { title: '-- LINE-01 --', slug: 'empty-line-01', status: 1, categoryIds: [6], description: 'EMPTY-LINE-01', content: '<p>EMPTY-CONTENT-L1</p>' },
  { title: 'EMPTY-DEMO-40', slug: 'empty-demo-40', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-40', content: '<p>EMPTY-CONTENT-40</p>' },
  { title: 'EMPTY-DEMO-41', slug: 'empty-demo-41', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-41', content: '<p>EMPTY-CONTENT-41</p>' },
  { title: 'EMPTY-DEMO-42', slug: 'empty-demo-42', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-42', content: '<p>EMPTY-CONTENT-42</p>' },
  { title: 'EMPTY-DEMO-43', slug: 'empty-demo-43', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-43', content: '<p>EMPTY-CONTENT-43</p>' },
  { title: 'EMPTY-DEMO-44', slug: 'empty-demo-44', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-44', content: '<p>EMPTY-CONTENT-44</p>' },
  { title: 'EMPTY-DEMO-45', slug: 'empty-demo-45', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-45', content: '<p>EMPTY-CONTENT-45</p>' },
  { title: 'EMPTY-DEMO-46', slug: 'empty-demo-46', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-46', content: '<p>EMPTY-CONTENT-46</p>' },
  { title: 'EMPTY-DEMO-47', slug: 'empty-demo-47', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-47', content: '<p>EMPTY-CONTENT-47</p>' },
  { title: 'EMPTY-DEMO-48', slug: 'empty-demo-48', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-48', content: '<p>EMPTY-CONTENT-48</p>' },
  { title: 'EMPTY-DEMO-49', slug: 'empty-demo-49', status: 1, categoryIds: [6], description: 'EMPTY-DEMO-49', content: '<p>EMPTY-CONTENT-49</p>' },
  { title: '-- LINE-02 --', slug: 'empty-line-02', status: 1, categoryIds: [6], description: 'EMPTY-LINE-02', content: '<p>EMPTY-CONTENT-L2</p>' },
  {
    title: '关于谷歌 I/O 发布会，你想知道的一切都在这里',
    slug: 'heres-everything-google-announced-today-at-the-i-o-2019-keynote',
    status: 1,
    categoryIds: [6],
    description: '',
    content: '<p>在今天下午举行的谷歌年度 I/O 开发者大会上，该公司在长达两小时的主题演讲中发布了一系列新产品——从新手机到下一代语音助手 Assistant——这些产品都是谷歌在过去一年开发的。</p>',
  },
];

// prettier-ignore
export const axSeed: CreateAxInput[] = [
  { title: 'Index Swiper', description: '首页滚动图', slug: 'index-swiper', status: 1 },
  { title: 'Index Grid', description: '首页方块图', slug: 'index-grid', status: 0 },
];

// prettier-ignore
export const attachmentSeed: any[] = [
  {
    uuid: '6db325c5-9c95-4952-94eb-eef33b2e08a7',
    title: 'aaa@2x',
    alt: 'aaa@2x',
    type: 'image',
    filename: '6db325c5-9c95-4952-94eb-eef33b2e08a7.jpg',
    module_name: 'ax',
    module_id: 1,
    type_name: 'banner',
    type_platform: 'mb',
    ext: '.jpg',
    width: 1200,
    height: 600,
    size: 151768,
    path: '/attachments/2019/08/6db325c5-9c95-4952-94eb-eef33b2e08a7.jpg',
    external_url: 'https://i.loli.net/2019/08/28/M7TZeuWrGc4FVmw.jpg|https://i.loli.net/2019/08/28/El6iY9INZhQ1srR.jpg',
    at2x: 1,
    in_local: 1,
    in_oss: 0,
    sort: 0,
    status: 1,
  },
  {
    uuid: 'bb9acfdc-86a1-43ca-afeb-260161455b72',
    title: 'bbb@2x',
    alt: 'bbb@2x',
    type: 'image',
    filename: 'bb9acfdc-86a1-43ca-afeb-260161455b72.jpg',
    module_name: 'ax',
    module_id: 1,
    type_name: 'banner',
    type_platform: 'mb',
    ext: '.jpg',
    width: 1200,
    height: 600,
    size: 151768,
    path: '/attachments/2019/08/bb9acfdc-86a1-43ca-afeb-260161455b72.jpg',
    external_url: 'https://i.loli.net/2019/08/28/LyFwsDXvaIzO826.jpg|https://i.loli.net/2019/08/28/OCEd26tZuVg4wN7.jpg',
    at2x: 1,
    in_local: 1,
    in_oss: 0,
    sort: 0,
    status: 1,
  },
];

// prettier-ignore
export const settingSeed: CreateSettingInput[] = [
  { name: 'Site Name', slug: 'site_name', type: 'input', sort: 1, value: 'Leaa', description: '站点名，最大 220 字' },
  { name: 'Site Description', slug: 'site_description', type: 'textarea', sort: 2, value: 'Leaa - project 1h 4 1d',  description: '站点描述， 最大 220 字' },
  { name: 'Site Keywords', slug: 'site_keywords', type: 'input', sort: 3, value: 'Leaa, mono-repo, C\'est la vie. project 1h 4 1d', description: '站点关键字，使用英文 , 分隔' },
  { name: 'Currency Symbol', slug: 'currency_symbol', type: 'radio', sort: 4, value: '$', description: 'Currency Symbol', options: '$\n¥' },
];

// prettier-ignore
export const couponSeed: CreateCouponInput[] = [
  {
    type: 'coupon',
    name: 'SEED-COUPON',
    quantity: 5,
    amount: 9,
    start_time: moment().toDate(),
    expire_time: moment().add(1, 'year').toDate(),
    status: 1,
  },
  {
    type: 'coupon',
    name: '新人通用券',
    quantity: 5,
    amount: 99,
    over_amount: 9999,
    start_time: moment().toDate(),
    expire_time: moment().add(1, 'year').toDate(),
    status: 1,
  },
];

// prettier-ignore
export const promoSeed: CreatePromoInput[] = [
  {
    name: 'SEED-PROMO',
    quantity: 5,
    redeemed_quantity: 0,
    amount: 66,
    start_time: moment().toDate(),
    expire_time: moment().add(1, 'year').toDate(),
    status: 1,
  },
];
