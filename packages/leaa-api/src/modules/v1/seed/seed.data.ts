/* eslint-disable max-len */
// prettier-ignore
import { ArticleCreateOneReq } from '@leaa/api/src/dtos/article';
import { CategoryCreateOneReq } from '@leaa/api/src/dtos/category';
import { AxCreateOneReq } from '@leaa/api/src/dtos/ax';
import { SettingCreateOneReq } from '@leaa/api/src/dtos/setting';
import { IPermissionSlug } from '@leaa/api/src/interfaces';
import { UserCreateOneReq } from '@leaa/api/src/dtos/user';

const __DEV__ = process.env.NODE_ENV !== 'production';

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
  {
    email: 'superuser@local.com',
    name: 'Super User',
    password: 'RwurDVXqHvmUZZWzmrwLwKcrzyyDMKVsRJawqQUzZygEeqCorbfBf7fmxRZecNUx',
    status: 1,
    is_admin: 1,
  },
  { email: 'admin@local.com', name: 'Admin', password: 'h8Hx9qvPKoHMLQgj', status: 1, is_admin: 1 },
  //
  //
  { phone: '18688889999', name: 'MOBILE01', password: '18688889999', status: 1, is_admin: 1 },
  { email: 'staff@local.com', name: 'Staff', password: '7PkQGjvHMMkoo4RZ', status: 1, is_admin: 1 },
  {
    email: 'disabled@local.com',
    name: 'Disabled',
    password: 'uUB3YGrdL3gJZYij',
    status: 1,
    is_admin: 0,
  },
  { email: 'empty-en@local.com', name: 'Empty User', password: 'uUB3YGrdL3gJZYi1', status: 1 },
  { email: 'empty-cn@local.com', name: '空号用户', password: 'uUB3YGrdL3gJZYi2', status: 1 },
  { email: 'empty-jp@local.com', name: '空のユーザー', password: 'uUB3YGrdL3gJZYi3', status: 1 },
  //
  //
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
  {
    roleSlug: 'attachment-manager',
    permissionSlugs: permissionsSeed.filter(p => p.slug.includes('attachment.')).map(p => p.slug),
  },
];

// prettier-ignore
export const rolesToUserSeed = [
  { userEmail: 'admin@local.com', roleSlugs: ['admin'] },
  { userEmail: 'staff@local.com', roleSlugs: ['staff', 'attachment-manager'] },
  { userEmail: 'superuser@local.com', roleSlugs: ['admin'] },
];

interface ICreateCategoryInput extends CategoryCreateOneReq {
  seedParentSlug?: string;
}

// prettier-ignore
export const categorySeed: ICreateCategoryInput[] = [
  { name: 'Articles', description: '文章分类', slug: 'articles' },
  { name: 'Products', description: '商品分类', slug: 'products' },
  { name: 'Brands', description: '品牌分类', slug: 'brands' },
  //
  { name: 'Frontend', slug: 'frontend', seedParentSlug: 'articles' },
  { name: 'Backend', slug: 'backend', seedParentSlug: 'articles' },
  { name: 'Help', slug: 'help', seedParentSlug: 'articles' },
  { name: 'Digit', slug: 'digit', seedParentSlug: 'products' },
  { name: 'Home Appliance', slug: 'home-appliance', seedParentSlug: 'products' },
  { name: 'Apple', slug: 'apple', seedParentSlug: 'brands' },
  { name: 'FILCO', slug: 'filco', seedParentSlug: 'brands' },
];

// prettier-ignore
export const articleSeed: ArticleCreateOneReq[] = [
  {
    title: 'New Highly-Critical SAP Bug Could Let Attackers Take Over Corporate Servers',
    status: 1,
    content: `<div class="articlebody clear cf" id="articlebody"><div dir="ltr" style="text-align: left;" trbidi="on">
<div class="separator" style="clear: both; text-align: left;">
<a href="https://thehackernews.com/images/-z8Uzw7Wp2Zk/Xw1bORR-XAI/AAAAAAAAAjM/4WKXCZsAtEw0zA9nzsUj0BUhmpjsEtR6wCLcBGAsYHQ/s728-e100/sap.jpg" imageanchor="1" style="clear: left; float: left; margin-bottom: 15px; margin-right: 1em; margin-left: 0px;"><img border="0" data-original-height="380" data-original-width="728" src="https://thehackernews.com/images/-z8Uzw7Wp2Zk/Xw1bORR-XAI/AAAAAAAAAjM/4WKXCZsAtEw0zA9nzsUj0BUhmpjsEtR6wCLcBGAsYHQ/s728-e100/sap.jpg"></a></div>
SAP has patched a <a href="https://wiki.scn.sap.com/wiki/pages/viewpage.action?pageId=552599675" target="_blank">critical vulnerability</a> impacting the LM Configuration Wizard component in NetWeaver Application Server (AS) Java platform, allowing an unauthenticated attacker to take control of SAP applications.<br>
<br>
The bug, dubbed RECON and tracked as <b>CVE-2020-6287</b>, is rated with a maximum CVSS score of 10 out of 10, potentially affecting over 40,000 SAP customers, according to cybersecurity firm Onapsis, which <a href="https://www.onapsis.com/recon-sap-cyber-security-vulnerability" target="_blank">uncovered the flaw</a>.<br>
<div class="ad_two clear" style="text-align: left;"><center class="cf"><div id="967ecfad-bf6b-429e-9a39-9770c8b7d188" class="_ap_apex_ad" max-height="290" style="text-align: left;"> <script> var adpushup = adpushup || {}; adpushup.que = adpushup.que || []; adpushup.que.push(function() { adpushup.triggerAd("967ecfad-bf6b-429e-9a39-9770c8b7d188"); });</script></div></center></div><br>
"If successfully exploited, a remote, unauthenticated attacker can obtain unrestricted access to SAP systems through the creation of high-privileged users and the execution of arbitrary operating system commands with the privileges of the SAP service user account, which has unrestricted access to the SAP database and is able to perform application maintenance activities, such as shutting down federated SAP applications," the US Cybersecurity and Infrastructure Security Agency (CISA) said in an <a href="https://us-cert.cisa.gov/ncas/alerts/aa20-195a" target="_blank">advisory</a>.<br>
<br>
"The confidentiality, integrity, and availability of the data and processes hosted by the SAP application are at risk by this vulnerability," it added.<br>
<br>
The vulnerability is present by default in SAP applications running on top of SAP NetWeaver AS Java 7.3 and newer (up to SAP NetWeaver 7.5), putting several SAP business solutions at risk, including but not limited to SAP Enterprise Resource Planning, SAP Product Lifecycle Management, SAP Customer Relationship Management, SAP Supply Chain Management, SAP Business Intelligence, and SAP Enterprise Portal.<br>
<br>
According to Onapsis, RECON is caused due to a lack of authentication in the web component of the SAP NetWeaver AS for Java, thus granting an attacker to perform high-privileged activities on the susceptible SAP system.<br>
<br>
"A remote, unauthenticated attacker can exploit this vulnerability through an HTTP interface, which is typically exposed to end users and, in many cases, exposed to the internet," CISA said.<br>
<div class="ad_two clear" style="text-align: left;"><center class="cf"><div id="8c2d7f94-a9c5-43b2-83a4-cdcf711ae05e" class="_ap_apex_ad" max-height="290" style="text-align: left;"> <script> var adpushup = adpushup || {}; adpushup.que = adpushup.que || []; adpushup.que.push(function() { adpushup.triggerAd("8c2d7f94-a9c5-43b2-83a4-cdcf711ae05e"); }); </script> </div></center></div><br>
By exploiting the flaw to create a new SAP user with maximum privileges, the intruder can compromise SAP installations to execute arbitrary commands, such as modifying or extracting highly sensitive information as well as disrupting critical business processes.<br>
<br>
Although there's no evidence of any active exploitation of the vulnerability, CISA cautioned that the patches' availability could make it easier for adversaries to reverse-engineer the flaw to create exploits and target unpatched systems.<br>
<br>
Given the severity of RECON, it's recommended that organizations apply critical patches as soon as possible and scan SAP systems for all known vulnerabilities and analyze systems for malicious or excessive user authorizations.</div>
<br>
<div class="cf note-b" style="text-align: left;">Found this article interesting? Follow THN on <a href="https://www.facebook.com/thehackernews" rel="noopener" target="_blank">Facebook</a>, <a href="https://twitter.com/thehackersnews" rel="noopener" target="_blank">Twitter <i class="icon-font icon-twitter"></i></a> and <a href="https://www.linkedin.com/company/thehackernews/" rel="noopener" target="_blank">LinkedIn</a> to read more exclusive content we post.</div>
</div>`,
  },

  {
    title: 'DualSense手柄上手体验，全新触觉反馈让你沉浸游戏世界',
    status: 1,
    content: `首先他提到了他认为 DualSense 最大的一点改变，是L2 及R2 按钮上的自动调整触发器，并说明这对游戏的影响是深远的。触觉回馈同样也是他认为DualSense 很值得一谈的点，并不像一般手柄的振动，全新升级的触觉回馈可以让玩家获得更高的沉浸体验。

在用 DualSense 来游玩《Astro's Playroom》的时候，他也展示了 DualSense 的诸多不同特点。在诸多场景里，DualSense 都会透过其扬声器以及触觉回馈来带给玩家更深的带入感。`,
  },

  {
    title: '仅有米粒大小！LG发布全球最小蓝牙模块，苹果有望采用',
    status: 1,
    content: `<p>根据外媒最新报导，LG 集团下属尖端物料和元件制造商 LG Innotek 共同宣布，他们开发出了世界最小蓝牙模组。据悉，该模组仅仅只有 6x4 mm大小，大概是一粒米的大小，比之前日本厂商保持的最小蓝牙模组记录缩小了1/4。

虽然是世界最小蓝牙模组，但是却“麻雀虽小五脏俱全”。该模组以高精度、高集成技术为基础，在一粒米的空间内塞进了通信芯片、电阻器、电感等 20 多个元件，不仅仅性能全面，甚至还要比一些提体积更大的蓝牙模组性能提升 30%，可在复杂、苛刻的环境中进行收发数据。除此之外，该模组与 LG Innotek 的「天线集成」技术进行了集成，将蓝牙天线也囊括在内，可通过最大化天线面积提升通信性能。



值得一提的是，LG Innotek 是苹果的供应商之一，如果量产顺利的话，或许苹果会考虑应用在未来的iPhone、AirPods、Apple Watch 等产品中。</p>`,
  },

  {
    title: 'Microsoft to launch cloud video game service, Project xCloud, in September',
    status: 1,
    content: 'N/A',
  },

  {
    title: 'I fell in love with a tiny, 2 TB, ultra quiet SSD hard drive',
    status: 1,
    content: `
<p class="gnt_ar_b_p">Meanwhile, I dealt with my storage problem by consolidating media and moving them from drives to drives. It's under control now. I also put as many of the files as possible&nbsp; onto online backup.</p>
<p class="gnt_ar_b_p">One concern is how long this new external SSD + Jeff relationship will last. Hard drives don't live forever and eventually go bad, and SSD drives also suffer the same fate. A blog post by online backup service Backblaze says a good SSD drive should last <a href="https://www.backblaze.com/blog/how-reliable-are-ssds/" target="_blank" rel="noopener" data-t-l="|inline|intext|n/a" class="gnt_ar_b_a">three to five years.</a></p>
<p class="gnt_ar_b_p">So it will be a short, but hopefully fruitful union. But since I backup everything twice, if not more, I look forward to reporting back to you in 2024 with tales of my new 10 TB, and ultra quiet SSD drive.</p>`,
  },

  {
    title: 'グーグル、新しい「エモい」絵文字を今秋リリース――Android 11で利用可能へ',
    status: 1,
    content: '<div class="contents-section contents-section-layer-1" id="contents-section-1"><div class="image-wrap frame-border-none"><div class="inner"><div class="row"><div class="column" style="width:480px;"><div class="img-wrap-h" style="width:480px;height:200px;"><div class="img-wrap-w"><a href="/img/ktw/docs/1266/517/html/cont01.jpg.html" class="resource" rel="nofollow"><img src="/img/ktw/docs/1266/517/cont01_l.jpg" class="resource" style="width:480px;height:200px;" id="cont01_l.jpg"></a></div></div></div></div></div></div><p> グーグルは、嬉し泣きなどの表現や多様性を取り入れた新しい絵文字を、今年秋ごろにリリースする。今秋リリースのAndroid 11でも利用できる予定。 </p><p> グーグルは、昨年に絵文字の標準とガイドラインを定めるUcode コンソーシアムに新しい絵文字の提案を行っており、提案した絵文字が公開される。 </p><p> 新しく公開される絵文字には、多様な表現のほか、ベールの男性やタキシードの女性、赤ちゃんにミルクを飲ませる男性や女性など、多様性を受け入れたものも含まれる。 </p><div class="image-wrap frame-border-none"><div class="inner"><div class="row"><div class="column" style="width:512px;"><div class="img-wrap-h" style="width:512px;height:186px;"><div class="img-wrap-w"><img src="/img/watch/parts/icon/loading.png" class="resource" style="width:512px;height:186px;" id="cont02.gif" ajax="/img/ktw/docs/1266/517/cont02.gif"></div></div></div></div></div></div><p> このほか、メキシコなどの子供のお祭りに使われる人形「ピニャータ」やホッキョクグマなどの新しい動物たちも登場する。食事に関するものでは、タピオカミルクティーやティーポットなどが追加される。 </p><div class="image-wrap frame-border-none"><div class="inner"><div class="row"><div class="column" style="width:480px;"><div class="img-wrap-h" style="width:480px;height:174px;"><div class="img-wrap-w"><a href="/img/ktw/docs/1266/517/html/cont03.gif.html" class="resource" rel="nofollow"><img src="/img/watch/parts/icon/loading.png" class="resource" style="width:480px;height:174px;" id="cont03_l.gif" ajax="/img/ktw/docs/1266/517/cont03_l.gif"></a></div></div></div></div></div></div><p> また、既存の絵文字見直され、表現の修正やダークモード向けのデザインも公開する。動物の絵文字は、モントレーベイ水族館やビクトリア昆虫館の専門家と協力し、より詳細に表現している。 </p><div class="image-wrap"><div class="inner"><div class="row"><div class="column" style="width:512px;"><div class="img-wrap-h" style="width:512px;height:186px;"><div class="img-wrap-w"><img src="/img/watch/parts/icon/loading.png" class="resource" style="width:512px;height:186px;" id="cont04.gif" ajax="/img/ktw/docs/1266/517/cont04.gif"></div></div></div></div></div></div><p> このほか、温かみのあるキャラクターなどが追加される。 </p><div class="image-wrap frame-border-none"><div class="inner"><div class="row"><div class="column" style="width:400px;"><div class="img-wrap-h" style="width:400px;height:300px;"><div class="img-wrap-w"><a href="/img/ktw/docs/1266/517/html/cont05.gif.html" class="resource" rel="nofollow"><img src="/img/watch/parts/icon/loading.png" class="resource" style="width:400px;height:300px;" id="cont05_l.gif" ajax="/img/ktw/docs/1266/517/cont05_l.gif"></a></div></div></div></div></div></div></div>',
  },

  {
    title: 'iPhoneを「REC MOUNT+」でマウントしまくり!!!',
    status: 1,
    content: `まあ、このテの製品としてはわりとよくあるシステムではある。が、REC MOUNT+の場合、けっこう定番的な製品で入手性が良く、デバイス用ケースやマウントのラインナップも幅広い。自転車向け、モーターサイクル向け、クルマ向けにランニング向け、さらには家庭内で使えるマウントなども用意されている。

マウントシステムとして統一しやすく、各シーンでの流用が利く。例えばREC MOUNT+ケースに入れたiPhoneを、自転車からモーターサイクルへ、さらにクルマへと手軽に装着し直すことができるし、必要とあらばベルトに装着することも可能。

`,
  },

  {
    title: 'スマートホームサービス対応のガス警報器を発売、エンコアードジャパンと新コスモス電機',
    status: 1,
    content: `ソフトバンク子会社のエンコアードジャパンと新コスモス電機は、スマートホームサービスに対応したガス警報器「快適ウォッチ SMART（スマート） XW-735」を開発した。都市ガス向けのガス警報器となり、東邦ガスでは「みまもり警報器」として8月21日から、西部ガスでは「快適ウォッチ SMART」として9月1日から取り扱う。

これまでのガス警報器は、ガス漏れや一酸化炭素濃度の検出のための装置であった。新コスモス電機では、これに加えて熱中症や室内の乾燥を検知し、ユーザーに知らせる「快適ウォッチ」を発売した。今回、「快適ウォッチ」に、エンコアードジャパンのスマートホーム関連サービスを組み込み、スマートフォンアプリと連携したガス警報器を開発したという。

今回のガス警報器には、ガス漏れ検知などの基本機能とリモートアラーム機能、簡易セキュリティ機能、熱中症予防機能、家族みまもり機能、帰宅確認機能などに対応する。

ガス漏れ検知、一酸化炭素検知、熱中症予防、乾燥予防機能は、警報器のセンサーで検知し、警報器本体からの通知とともに、設定したスマートフォンアプリに通知が届く。外出中や離れて暮らす家族の異常をすぐに確認できる。

また、付属するコネクトセンサーを利用して、スマートホームサービスを利用できる。

玄関ドアにセンサーを取り付ければ簡易セキュリティ機能として、玄関ドアが開いたときにアプリから通知される。アプリから操作することで、警報音や威嚇するメッセージを再生することもできるという。

離れて暮らす高齢者の部屋やトイレのドアにセンサーを取り付けると生活みまもり機能が利用できる。設定した時間以上ドアの開閉を検知できないとアプリから通知される。病気などで動けなくなったなどをいち早く確認できる。`,
  },

  {
    title: 'TypeORM is an ORM that can run in NodeJS, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo, and Electron platforms and can be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8).',
    status: 1,
    content: `TypeORM is an ORM that can run in NodeJS, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo, and Electron platforms and can be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8). Its goal is to always support the latest JavaScript features and provide additional features that help you to develop any kind of application that uses databases - from small applications with a few tables to large scale enterprise applications with multiple databases.

TypeORM supports both Active Record and Data Mapper patterns, unlike all other JavaScript ORMs currently in existence, which means you can write high quality, loosely coupled, scalable, maintainable applications the most productive way.

TypeORM is highly influenced by other ORMs, such as Hibernate, Doctrine and Entity Framework.`,
  },

  {
    title: '《集合啦！动物森友会》夏日新CM公开 夏日同游其乐融融！',
    status: 1,
    content: '今日（7月20日），任天堂官方公开了《集合啦！动物森友会》两段夏日新CM，该作已经登陆任天堂Switch平台，夏天的免费更新资料第2弹将于8月上旬发布，一起来欣赏一下此次官方公开的新CM。',
  },

  {
    title: '报道称三星正努力提升5nm EUV产能 高通骁龙875G芯片组或受影响',
    status: 1,
    content: 'DigiTimes 近日报道称，三星正在努力提升自家的 5nm EUV 产能。过去几年，这家韩国科技巨头一直在努力追赶台积电。为了抢到更多客户，三星已规划从 5nm 进阶至 3nm 工艺。遗憾的是，若该公司无法顺利提升 5nm EUV 产能，那高通未来旗舰芯片组（骁龙 875G SoC / 骁龙 X60 5G 基带）的发布也可能受到影响。',
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
  {
    name: 'Site Name',
    slug: 'site_name',
    type: 'input',
    sort: 1,
    value: __DEV__ ? 'Leaa_DEV' : 'Leaa',
    description: '站点名，最大 220 字',
  },
  {
    name: 'Site Description',
    slug: 'site_description',
    type: 'textarea',
    sort: 2,
    value: 'Leaa - project 1h 4 1d',
    description: '站点描述， 最大 220 字',
  },
  {
    name: 'Site Keywords',
    slug: 'site_keywords',
    type: 'input',
    sort: 3,
    value: 'Leaa, mono-repo, C\'est la vie. project 1h 4 1d',
    description: '站点关键字，使用英文 , 分隔',
  },
  {
    name: 'Currency Symbol',
    slug: 'currency_symbol',
    type: 'radio',
    sort: 4,
    value: '$',
    description: 'Currency Symbol',
    options: '$\n¥',
  },
];
