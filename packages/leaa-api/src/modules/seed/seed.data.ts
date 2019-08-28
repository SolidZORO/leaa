/* eslint-disable max-len */
// prettier-ignore
import { Article } from '@leaa/common/src/entrys';
import { CreateArticleInput } from '@leaa/common/src/dtos/article';
import { CreateCategoryInput } from '@leaa/common/src/dtos/category';
import { CreateAxInput } from '@leaa/common/src/dtos/ax';
import { CreateSettingInput } from '@leaa/common/src/dtos/setting';

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
  { title: '哈喽，Leaa', slug: 'hello-leaa', status: 1, description: `Hello, World 是指在计算机屏幕显示 “Hello, World!”（你好，世界！）字符串的计算机程序。相关的程序通常都是每种计算机<a href="https://zh.wikipedia.org/wiki/%E7%B7%A8%E7%A8%8B%E8%AA%9E%E8%A8%80" class="mw-redirect">编程语言</a>最基本、最简单的程序，也会用作示范一个编程语言如何运作。同时它亦可以用来确认一个编程语言的<a href="https://zh.wikipedia.org/wiki/%E7%B7%A8%E8%AD%AF%E5%99%A8">编译器</a>、程序开发环境及<a href="https://zh.wikipedia.org/wiki/%E9%81%8B%E8%A1%8C%E7%92%B0%E5%A2%83" class="mw-redirect">运行环境</a>是否已经安装妥当。因为写法简单可见，这也是很多初学者首次接触编程语言时会撰写的程序。`, category_id: 1, content: `<p>Hello, World 是指在计算机屏幕显示 “Hello, World!”（你好，世界！）字符串的计算机程序。相关的程序通常都是每种计算机<a href="https://zh.wikipedia.org/wiki/%E7%B7%A8%E7%A8%8B%E8%AA%9E%E8%A8%80" class="mw-redirect">编程语言</a>最基本、最简单的程序，也会用作示范一个编程语言如何运作。同时它亦可以用来确认一个编程语言的<a href="https://zh.wikipedia.org/wiki/%E7%B7%A8%E8%AD%AF%E5%99%A8">编译器</a>、程序开发环境及<a href="https://zh.wikipedia.org/wiki/%E9%81%8B%E8%A1%8C%E7%92%B0%E5%A2%83" class="mw-redirect">运行环境</a>是否已经安装妥当。因为写法简单可见，这也是很多初学者首次接触编程语言时会撰写的程序。</p><p></p><p></p><div class="media-wrap image-wrap"><img class="media-wrap image-wrap" alt="hello world" src="https://upload.wikimedia.org/wikipedia/commons/2/21/Hello_World_Brian_Kernighan_1978.jpg"/></div><p></p><p></p><p></p><h2 id="a95ou">历史</h2><p style="text-align:start;text-indent:2em;">于1972年，<a href="https://zh.wikipedia.org/wiki/%E8%B2%9D%E7%88%BE%E5%AF%A6%E9%A9%97%E5%AE%A4" class="mw-redirect">贝尔实验室</a>成员<a href="https://zh.wikipedia.org/wiki/%E5%B8%83%E8%90%8A%E6%81%A9%C2%B7%E6%9F%AF%E6%9E%97%E6%BC%A2">布莱恩·柯林汉</a>撰写的内部技术文件《A Tutorial Introduction to the Language B》首次提到了 Hello World 这字符串。当时，他使用<a href="https://zh.wikipedia.org/wiki/B%E8%AA%9E%E8%A8%80">B语言</a>撰写了第一个使用参数的Hello World相关程序：</p><p></p><pre data-lang="javascript" class="lang-javascript"><code class="lang-javascript">main(){<br/>  extrn a,b,c;<br/>  putchar(a); putchar(b); putchar(c); putchar(&#x27;!*n&#x27;);<br/>  }<br/><br/>a &#x27;hell&#x27;;<br/>b &#x27;o, w&#x27;;<br/>c &#x27;orld&#x27;;</code></pre><p><br/>由 <a href="https://zh.wikipedia.org/wiki/%E5%B8%83%E8%90%8A%E6%81%A9%C2%B7%E6%9F%AF%E6%9E%97%E6%BC%A2">布莱恩·柯林汉</a> 撰写的“Hello, world”程序 (1978年)</p><p style="text-align:start;text-indent:2em;">这个程序成为了第一个Hello World的示范程序。之所以会这样切割，是因为于B语言中，每个参数只能放置四个<a href="https://zh.wikipedia.org/wiki/ASCII">ASCII</a>字符<sup><a href="https://zh.wikipedia.org/wiki/Hello_World#cite_note-langb-5">[5]</a></sup>。两年后，布莱恩·柯林汉和<a href="https://zh.wikipedia.org/wiki/%E4%B8%B9%E5%B0%BC%E6%96%AF%C2%B7%E9%87%8C%E5%A5%87">丹尼斯·里奇</a>基于B语言写成<a href="https://zh.wikipedia.org/wiki/C%E8%AA%9E%E8%A8%80" class="mw-redirect">C语言</a>后，在他们撰写的《<a href="https://zh.wikipedia.org/wiki/C%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1%E8%AF%AD%E8%A8%80_(%E4%B9%A6)">C程序设计语言</a>》使用更简单的方式展示Hello World:</p><p></p><pre data-lang="javascript" class="lang-javascript"><code class="lang-javascript">#include &lt;stdio.h&gt;  main( ) {         printf(&quot;hello, world\\n&quot;); } </code></pre><p></p><p style="text-align:start;text-indent:2em;">自此，Hello World 成为了计算机程序员学习新的编程语言的传统。但是，有些人认为 <em>hello, world</em> 的字符串早于1966 年的 BCPL语言出现的时候已经出现。虽然相关的字词确实在发明者记录的文件出现，但是可以肯定的是，Hello World 这字符串于当时确实未变得流行。因此，人们公认为<a href="https://zh.wikipedia.org/wiki/%E5%B8%83%E8%90%8A%E6%81%A9%C2%B7%E6%9F%AF%E6%9E%97%E6%BC%A2">布莱恩·柯林汉</a>是令相关字符串走进公众目光的人。</p><p style="text-align:start;text-indent:2em;">但是需要注意的是，Hello World 的初始写法为 “hello, world”，并没有任何感叹号，全部都是小写，内含逗号，后面亦有空格，而和现在流行的写法并不一致。</p><p></p><p></p><p></p><h2 id="6go16">派生影响</h2><p></p><h3 id="1jh40"><strong>对计算机文化的影响</strong></h3><p style="text-align:start;text-indent:2em;"><a href="https://zh.wikipedia.org/wiki/Debian">Debian</a> 以及系统的<a href="https://zh.wikipedia.org/wiki/%E9%80%B2%E9%9A%8E%E5%8C%85%E8%A3%9D%E5%B7%A5%E5%85%B7" class="mw-redirect">高级包装工具</a>当中包含了 “hello, world” 安装工具。用户只需要于终端（Linux 系统的Terminal）输入“apt-get install hello”便能够安装此工具及其相关部件。虽然看似没用，但却可作为测试工具使用。同时，这亦能够向新用户展示安装工具的方法。对开发者来说，这个工具展现了创建<a href="https://zh.wikipedia.org/wiki/.deb" class="mw-redirect">.deb</a>安装工具的方法。这个工具，连同 GNU Hello 便成为了撰写 GNU 程序的教学软件。</p><p></p><p></p><h3 id="ejihs"><strong>对其他电子产品的影响</strong></h3><p style="text-align:start;text-indent:2em;">虽然 Hello World 在<a href="https://zh.wikipedia.org/wiki/%E5%96%AE%E6%99%B6%E7%89%87" class="mw-redirect">单片机</a>微计算机、<a href="https://zh.wikipedia.org/wiki/%E7%8E%B0%E5%9C%BA%E5%8F%AF%E7%BC%96%E7%A8%8B%E9%80%BB%E8%BE%91%E9%97%A8%E9%98%B5%E5%88%97">现场可编程逻辑门阵列</a>及<a href="https://zh.wikipedia.org/wiki/%E8%A4%87%E9%9B%9C%E5%8F%AF%E7%A8%8B%E5%BC%8F%E9%82%8F%E8%BC%AF%E8%A3%9D%E7%BD%AE" class="mw-redirect">复杂可编程逻辑器件</a>中不能展现出来，一盏细小的微型 LED 灯会代替 Hello World 的作用，以表示安装成功、相关程序功能已实现。</p><p><br/></p><h3 id="clkc1"><strong>对流行文化的影响</strong></h3><p style="text-align:start;text-indent:2em;">Hello World 已经成为流行文化的一部分，例如以 Hello World 命名首个运用纯人工智能完成的专辑。同时，亦有若干公司以 Hello World 命名，例如位于澳州的 Helloworld 旅游公司、Hello World Consulting 等。</p><p></p><p></p>` },
  { title: 'Sample Article', slug: 'demo-article', status: 1, description: 'Sample Article Description', category_id: 1, content: `<p>JUST A SAMPLE ARTICLE</p><br /><br /><br /><br /><br /><p>---- EOF ----</p>` },
  { title: '<script>alert(\'hello, leaa.\')</script>', slug: 'alert-test', status: 1 , description: '<script>alert(\'hello, leaa.\')</script>', category_id: 1, content: `<p>&lt;script&gt;alert(&#x27;hello, leaa.&#x27;)&lt;/script&gt;</p>` },
  { title: 'The State of Web Browsers 2019 edition', slug: 'the-state-of-web-browsers-2019-edition', status: 1, description: 'Two days ago, I published a bitter sweet article on the state of web', category_id: 1, content: `<p>Two days ago, I published a bitter sweet article on the state of web browsers, triggered by the news that Microsoft would abandon their EdgeHTML engine, replacing it with Chromium. Which was the final nail in the coffin, effectively establishing Chromium as the web’s engine, combined with Safari’s webkit. The only resistance to this monopoly, Mozilla, finds itself without any significant allies or traction to counter this development.</p><p>The article got some readership and a fair amount of feedback. The general consensus seems to be that the article is truthful but depressing.</p><p>Critical notes suggest that some statements are true-ish but too broad, lacking finer details and nuance. I agree. Some statements could be more polished, but it would make the article twice as long, and not all of those details matter for the larger conclusions I was going for. To illustrate, the article got tens of thousands of views, only 25% bothered to actually read it. Which surely has to do with length, and I suppose some were so disgusted halfway-in, they gave up, saving both time and the chance of a clinical depression.</p><p></p><p>Only a few critiqued the delivery style of brutal honesty, most seemed to appreciate it. And some don’t, it comes with the territory. All I can say is that I won’t tone it down, I was actually in a mild mood that day. I don’t apply brutal honesty for shock value or attention, I genuinely believe that in a world ruled by tech, we need no nonsense critique, not sugar coated suggestions. Plus, I’m dutch, this is our default tone of voice.</p><p>Back on point, why a second article? I want to address the depressing part of the original article. If you were brave enough to read it to the end, you’d notice the lack of a happy ending. You could be under the impression that the web is a lost cause, the open web in great danger, and that we’ve returned to medieval IE times. It would take the greatest of optimists to wade through that article without it ruining your day, if you care about the web.</p><p></p><p>I cannot change the fact that the road to Chromium/Webkit dominance was messy or even abusive. It is a questionable history that will not be undone. We’re going to leave this one to the lawyers, but sure enough, those browsers aren’t going to be uninstalled. It’s a done deal.</p><p>In this article, we’re going to accept the new state, where Chromium dominates the web, and look ahead. To see what Chromium dominance means for users, developers and the open web. The spoiler is of course that there’s plenty of reasons to be happy, optimistic, and even excited about this new state, even if the new state came into existence in unfair ways.</p><p></p><p><a href="https://ferdychristant.com/the-state-of-web-browsers-88224d55b4e6" target="_blank">[Link]</a></p>` },
  { title: 'web 浏览器现状 2019版', slug: 'the-state-of-web-browsers-2019-edition-cn', status: 1, description: '两天前，有感于微软放弃 Edgehtml 引擎，使用 Chromiun 取而代之的事件', category_id: 1, content: `<p>两天前，有感于微软放弃 Edgehtml 引擎，使用 Chromiun 取而代之的事件，我发表了一篇关于浏览器兴衰的文章。微软的此番作为被视为将 Chromium 与 Safari 的 webkit 结合建立搜索引擎的最后一步。而此时，唯一能对微软的垄断行为产生威胁的对手 —— Mozilla，发现自己已经没有盟友和动力来应对微软的这一举措了。</p><p></p><p>这篇文章获得了大量读者的反馈，大家普遍肯定了文章的真实性，但也对文章揭露的事实感到沮丧。</p><p></p><p>一些批判性的评论则认为文章的一些观点是真实可信的，但过于宽泛，缺乏细节。我肯定有些观点可以更加精辟，但这会使文章的篇幅增加一倍，并且增加的内容对我所要阐述的核心观点没有太大用处。比如说，该篇文章获得了数万读者的浏览，实际上仅仅有 25% 左右的读者真正通读了，可能是因为文章的长度，有些读者感到厌烦，在阅读中途就放弃了，既节省了时间又免得内心沮丧。</p><p></p><p>只有少数人批评我近似残酷的诚实，更多读者则偏向欣赏我的做法。这等同于领土问题。我所能说的是，尽管那天我的情绪很平和，但我并不会降低语气。我也不会用我的诚实获取价值和关注，我坚信在一个由科技主导的世界里不需要毫无意义的批评，更不需要高谈阔论的建议。另外，我是一个荷兰人，我们惯有的语调就是如此。</p><p></p><p>回到主题上，为什么要发布第二篇文章？我想要谈谈原文中令人沮丧的那部分内容。如果你有足够的时间读到最后，你会在末尾发现这将是一个缺少快乐的结局。你可能会认为 web 是一个失败的东西，开放的 web 处于极大的危险中，我们已经回到了中世纪的 IE 时代。如果你关心 web 的话，即使是最乐观的人也会在不破坏自己一天的情况下读完这篇文章。</p><p></p><p>我不能改变的事实是： Chromium/Webkit 的统治之路是混乱的，甚至是滥用的。这是一段不可抹去的、值得怀疑的历史。我们将把这个留给律师，但足够肯定的是，这些浏览器仍不会被卸载。咱们走着瞧。</p><p></p><p>在本文中，我们将接受 Chrome 主导 web 的新态势，并展望未来。看看 Chromium 的优势对用户、开发者和开放 web 意味着什么。剧透一下，我们将有很多理由对这个态势感到高兴、乐观，甚至兴奋，即使这个新态势是以一种不公平的方式出现的。</p><p></p><p><a href="https://github.com/xitu/gold-miner/blob/master/TODO1/the-state-of-web-browsers-2019-edition.md" target="_blank">[全文链接]</a></p>` },
  { title: 'The 4 types of ‘Why’: What is the driving force behind your product?', slug: 'the-4-types-of-why-what-is-the-driving-force-behind-your-product', status: 1, description: '', category_id: 1, content: `<p style="text-align:start;" size="3" _root="[object Object]" __ownerID="undefined" __hash="undefined" __altered="false">I recently wrote about a framework I created called <a href="https://medium.com/@kit_ulrich/a-surprisingly-simple-technique-for-a-rockstar-product-vision-the-ladder-of-needs-ae624d81ca6b" target="_blank" class="bb cn ld le lf lg">the Ladder of Needs</a>, a simple tool for product people to create a compelling vision. It combines the best of Simon Sinek’s ideas from <a href="https://www.amazon.com/Start-Why-Leaders-Inspire-Everyone/dp/1591846447" target="_blank" class="bb cn ld le lf lg">Start with Why</a> and Clay Christensen’s classic <a href="https://hbr.org/2016/09/know-your-customers-jobs-to-be-done" target="_blank" class="bb cn ld le lf lg">framework of ‘jobs to be done’</a>.</p><p><br/></p><div class="media-wrap image-wrap"><img alt="" width="680px" height="549.484px" src="https://miro.medium.com/max/1584/1*4RcIun2jW3x010o9MrYIVw.png" class="mt mu fm n o fl x fj" style="width:680px;height:549px"/></div><p></p><p style="text-align:start;text-indent:2em;" id="9834" class="kp kq fo bs kr b ks kt ku kv kw kx ky kz la lb lc" data-selectable-paragraph=""></p><p></p><p>So, how do you determine the ‘Why’ behind your product?</p><p></p><blockquote>“People often ask what will be different in the world in 10 years, the more important question is what will be the same” — Jeff Bezos</blockquote><p style="text-align:start;text-indent:2em;" id="295a" class="kp kq fo bs kr b ks kt ku kv kw kx ky kz la lb lc" data-selectable-paragraph=""></p><p>Start by considering this gem from Jeff Bezos:</p><p></p><p>So true, because the fundamentals of what people want and need are exactly that…fundamental truths. In my time as a product leader, I have found 4 models that apply to almost all consumer experiences and products. These are not mutually exclusive — they are ideas that overlap in many ways, but one will likely call to you more than the others.</p><p><br/></p><div class="media-wrap image-wrap"><img width="680px" height="81.1406px" src="https://miro.medium.com/max/1542/0*1mrb_-l-2fb9vd5i" class="mt mu fm n o fl x fj" style="width:680px;height:81.1406px"/></div><p>What is your customer’s scarcest resource? It tends to be either money, time, energy.</p><p></p><p>You may have seen this meme on Twitter or Instagram before (I’d love to know whom to credit with it’s creation). It’s a great framework for products.</p><p><br/></p><div class="media-wrap image-wrap"><img width="680px" height="338.625px" src="https://miro.medium.com/max/1486/0*3CW4a_5cLbHd2Jc3" class="mt mu fm n o fl x fj" style="width:680px;height:338.625px"/></div><p>This is why Bezos’ answer to his own question, ‘what will be the same in the world in 10 years’, was that Amazon customers would always want lower prices (money) and faster shipping (time). Amazon’s strategy was built by focusing on these core customer needs.This is also why Uber isn’t in the business of selling rides, it is in the business of selling time.</p><p></p><p><a href="https://medium.com/@kit_ulrich/the-4-types-of-why-what-is-the-driving-force-behind-your-product-1b06fb4ef7bc" target="_blank">[Full Link]</a></p>` },
  // eslint-disable-next-line no-irregular-whitespace
  { title: '四个「为什么」：是什么在背后驱动你的产品？', slug: 'the-4-types-of-why-what-is-the-driving-force-behind-your-product-cn', status: 1, description: '', category_id: 1, content: `<p>我刚刚在写我创作的一个叫做<a href="https://link.juejin.im?target=https%3A%2F%2Fmedium.com%2F%40kit_ulrich%2Fa-surprisingly-simple-technique-for-a-rockstar-product-vision-the-ladder-of-needs-ae624d81ca6b" target="_blank" rel="nofollow noopener noreferrer">需求的阶梯</a>的框架，它是一个可以让产品人员创造美好愿景的简单工具。「需求的阶梯」结合了 Simon Sinek 在 <a href="https://link.juejin.im?target=https%3A%2F%2Fwww.amazon.com%2FStart-Why-Leaders-Inspire-Everyone%2Fdp%2F1591846447" target="_blank" rel="nofollow noopener noreferrer">《Start with Why》</a>中最棒的想法和 Clay Christensen 的经典著作<a href="https://link.juejin.im?target=https%3A%2F%2Fhbr.org%2F2016%2F09%2Fknow-your-customers-jobs-to-be-done" target="_blank" rel="nofollow noopener noreferrer">《framework of ‘jobs to be done’》</a>。<br/> <br/></p><div class="media-wrap image-wrap"><img alt="" data-src="https://user-gold-cdn.xitu.io/2018/9/27/166187aa194a6ca1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" data-width="800" data-height="600" src="https://user-gold-cdn.xitu.io/2018/9/27/166187aa194a6ca1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" class="lazyload inited loaded"/></div><p><br/> <strong>所以，你如何决定你产品背后的「为什么」？</strong><br/> Jeff Bezos（译者注：杰夫·贝佐斯，亚马逊创始人）是最开始思索这个问题的人：<br/>「人们经常问，10年后世界上会有什么不同，但我认为更重要的是，10年后还有什么不变」— Jeff Bezos<br/> <br/> 是的，因为人们想要且需要的真理恰恰是基本的事实。在我作为产品团队负责人期间，我找到了几乎可以应用到所有消费体验和产品的四个模型。他们并不互斥 —— 在很多方向他们是互相覆盖的，但其中一个可能比其他的更值得你关注。<br/> <br/></p><div class="media-wrap image-wrap"><img data-src="https://user-gold-cdn.xitu.io/2018/9/27/166187aa22d41966?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" data-width="771" data-height="92" src="https://user-gold-cdn.xitu.io/2018/9/27/166187aa22d41966?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" class="lazyload inited loaded"/></div><p><br/> 什么是你的客户缺乏的资源？一般来说有三个方面 —— 钱、时间、精力。<br/> 你可能之前在 Twitter 或 Instagram 上看过这张图片（我很想知道它的作者是谁），这是一个伟大的产品框架。<br/> <br/></p><div class="media-wrap image-wrap"><img data-src="https://user-gold-cdn.xitu.io/2018/9/27/166187aa26a4ef2b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" data-width="743" data-height="370" src="https://user-gold-cdn.xitu.io/2018/9/27/166187aa26a4ef2b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" class="lazyload inited loaded"/></div><p><br/> 这就是 Bezos 提出的「10 年后世界上还有什么不变」这个问题的答案 —— 亚马逊的客户总是想要更低的价格（金钱）和更快的运输（时间），亚马逊的战略就是通过专注于这些核心客户需求而建立的。<br/> 这也是为什么 Uber 的商业模式不是「卖车」，而是「卖时间」。<br/></p><p><a href="https://github.com/xitu/gold-miner/blob/master/TODO1/the-4-types-of-why-what-is-the-driving-force-behind-your-product.md" target="_blank">[全文链接]</a></p>` },
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
