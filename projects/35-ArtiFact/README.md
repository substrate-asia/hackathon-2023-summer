## 基本资料(Basic Information)

项目名称(Project Name)：ArtiFact

项目立项日期(Project Approval Date)：2023-06-17

## 项目整体简介(Project Overall Introduction)

ArtiFact使用户能够真正掌握其独特的AI生成创作品的所有权。ArtiFact源于对解决AI创作作品归属权问题的承诺，为用户提供了一个平台，使他们能够创作、铸造为NFT，从而真正拥有自己的AI生成的艺术、音乐、文本或任何形式的数字内容。

ArtiFact为创作过程带来了无与伦比的透明度和安全性，确保每一件创作品的起源都是不可更改且可验证的。这些一旦铸造为NFT的作品，可以在我们的平台上进行买卖、租赁及借贷行为，营造出一个充满活力的市场，这个市场尊重并奖励原创性和创新性。

ArtiFact展望的未来，AI创造力不再是短暂的新奇，而是人类表达的一种延续，能够被民主地拥有和交易。加入我们，共同构建一个技术赋能艺术，每一项创作都能找到其合适主人的未来。

ArtiFact enables users to truly own their unique AI-generated creations. Originating from a commitment to solve the issue of ownership of AI-generated works, ArtiFact provides a platform for users to create, mint into NFTs, thus truly owning their AI-generated art, music, text, or any form of digital content.

ArtiFact brings unparalleled transparency and security to the creation process, ensuring that the origin of each piece of work is immutable and verifiable. These works, once minted into NFTs, can be bought, sold, leased, and loaned on our platform, creating a vibrant market that respects and rewards originality and innovation.

In the future envisioned by ArtiFact, AI creativity is no longer a fleeting novelty, but an extension of human expression that can be democratically owned and traded. Join us to build a future where technology empowers art, and every creation can find its rightful owner.

## 项目链端设计(Project Chain Design)

`artwork_price`：`ArtiFact`的实时币价

用户存储NFT时，需要向国库转移`artwork_price`，当作保证金，当销毁NFT时国库会向用户转移`artwork_price`。为什么用实时比价来作为`artwork_price`呢：为了激励用户在币价低迷的时候铸造更多的NFT来丰富生态。
当`ArtiFact`币价偏低时，用户可以用偏低的价格来铸造NFT，从而拉动币价，当币价拉高之后可以销毁NFT来获取差价，使整个生态活跃起来。
而当整个生态比较活跃时，铸造NFT价格较高会时用户减少铸造NFT，这也有利于减少网络的拥堵。

同样的，NFT的租赁和借贷的质押金额同样为`artwork_price`。我们没有限制在NFT租赁和借贷期间，作为质押物的NFT的交易行为。
就是说NFT作为质押品，获取贷款的期间，这个NFT也可以进行交易。这个举动可以大大的增加NFT的流动性。

当借贷过程中，贷款者没有及时还款的话，系统会自动执行还款函数。这个函数由`ocw`调动签名交易来执行：将质押NFT销毁，将销毁的`artwork_price`转移给放贷者作为补偿。

本系统也设计了NFT的租赁，为什么有这一设计也是考虑到版权的问题。举个例子：`A`举办为期一晚的活动，需要一个背景音乐。那么`A`可以租赁`B`的一个因为NFT，租期为1晚。
也即是说这个NFT只有当天晚上属于`A`，其余时间的所有权都属于`B`。

`artwork_price`: The real-time coin price of `ArtiFact`

When storing NFTs, users need to transfer `artwork_price` to the treasury as a deposit, which will be transferred back to the users when the NFT is destroyed. Why use the real-time coin price as `artwork_price`? This is to encourage users to mint more NFTs to enrich the ecosystem when the coin price is low.
When the `ArtiFact` coin price is relatively low, users can mint NFTs at a lower price, thereby driving up the coin price. When the coin price rises, they can destroy the NFTs to obtain the price difference, making the entire ecosystem more active.
When the entire ecosystem is active, the higher price for minting NFTs can cause users to reduce the creation of NFTs, which is also beneficial to reduce network congestion.

Similarly, the collateral amount for NFT leasing and borrowing is also `artwork_price`. We do not limit the trading behavior of NFTs used as collateral during the leasing and borrowing period.
This means that while an NFT is being used as collateral to secure a loan, it can also be traded. This action can greatly increase the liquidity of the NFT.

During the borrowing process, if the borrower does not repay in time, the system will automatically execute the repayment function. This function is executed by `ocw` triggering a signed transaction: the collateralized NFT is destroyed, and the destroyed `artwork_price` is transferred to the lender as compensation.

The system also includes a design for NFT leasing, considering copyright issues. For example: `A` is hosting an event for one night and needs background music. Then `A` can lease an NFT music from `B` for one night.
That is to say, the NFT belongs to `A` only for that night, and the ownership for the rest of the time belongs to `B`.

## 项目LOGO(Project Logo)
![ArtiFact.png](docs%2FArtiFact.png)

## 黑客松期间计划完成的事项(Tasks Planned to be Completed During the Hackathon)

**区块链端(Blockchain)**

- `pallet-artwork`
  - [ ] 将前端存入IPFS文件系统生成的cid存入链中 (`fn save_artwork()`)
  - [ ] NFT转帐函数 (`fn transfer_artwork()`)
  - [ ] 购买NFT函数 (`fn buy_artwork()`)
  - [ ] 修改NFT属性，包括质押周期、出售价格及租赁或借贷的税率 (`fn update_artwork()`)
  - [ ] 销毁NFT (`fn destroy_artwork()`)
  - [ ] 将NFT放到租赁池中，表示该NFT支持租赁 (`fn start_lend_artwork()`)
  - [ ] 将NFT从租赁池中移除，表示该NFT不支持租赁 (`fn cancel_lend_artwork()`)
  - [ ] 租借NFT (`fn borrow_artwork()`)
  - [ ] 设置实时的 artwork_price (`fn set_real_time_artwork_price()`)
  - [ ] 借贷日期结束时，整个借贷过程也自动结束 (`fn automatic_lend_over()`)
  - [ ] 将NFT放到借贷池中，表示该NFT支持借贷 (`fn start_to_pawn_artwork_for_token()`)
  - [ ] 将NFT放到售卖池中，表示该NFT支持卖出 (`fn start_to_sell()`)
  - [ ] 将NFT从借贷池中移除，表示该NFT不支持借贷 (`fn cancel_pawn_artwork_for_token()`)
  - [ ] 将NFT从售卖池中移除，表示该NFT不支持售卖 (`fn cancel_sale_artwork()`)
  - [ ] 将token贷出去，得到对方NFT最为抵押 (`fn provide_token_loan()`)
  - [ ] 贷款用户手动结束贷款过程，用利息和本金赎回质押的NFT (`fn redemption_artwork()`)
  - [ ] 到期自动结束放贷过程，视为贷款用户违约，自动销毁NFT，将销毁费转给放贷者 (`fn automatic_redemption_artwork()`)

## 不在黑客松期间但应该完成的事项(Tasks That Should Be Completed But Not During the Hackathon)

- `web 端`
  - [ ] 将AI生成的文件放入IPFS系统，返回对应的ipfs_cid传给链端，进行上链存储
  - [ ] 结合AI模块生成对应的文件
  - [ ] 页面渲染及其他链端对应的功能


- `AI`
  - [ ] 结合web 端和用户交互，通过AI生成对应的文件


## 黑客松期间所完成的事项(Tasks Completed During the Hackathon)

- `pallet-artwork`
  - [ ] 将前端存入IPFS文件系统生成的cid存入链中 (`fn save_artwork()`)
  - [ ] NFT转帐函数 (`fn transfer_artwork()`)
  - [ ] 购买NFT函数 (`fn buy_artwork()`)
  - [ ] 修改NFT属性，包括质押周期、出售价格及租赁或借贷的税率 (`fn update_artwork()`)
  - [ ] 销毁NFT (`fn destroy_artwork()`)
  - [ ] 将NFT放到租赁池中，表示该NFT支持租赁 (`fn start_lend_artwork()`)
  - [ ] 将NFT从租赁池中移除，表示该NFT不支持租赁 (`fn cancel_lend_artwork()`)
  - [ ] 租借NFT (`fn borrow_artwork()`)
  - [ ] 设置实时的 artwork_price (`fn set_real_time_artwork_price()`)
  - [ ] 借贷日期结束时，整个借贷过程也自动结束 (`fn automatic_lend_over()`)
  - [ ] 将NFT放到借贷池中，表示该NFT支持借贷 (`fn start_to_pawn_artwork_for_token()`)
  - [ ] 将NFT放到售卖池中，表示该NFT支持卖出 (`fn start_to_sell()`)
  - [ ] 将NFT从借贷池中移除，表示该NFT不支持借贷 (`fn cancel_pawn_artwork_for_token()`)
  - [ ] 将NFT从售卖池中移除，表示该NFT不支持售卖 (`fn cancel_sale_artwork()`)
  - [ ] 将token贷出去，得到对方NFT最为抵押 (`fn provide_token_loan()`)
  - [ ] 贷款用户手动结束贷款过程，用利息和本金赎回质押的NFT (`fn redemption_artwork()`)
  - [ ] 到期自动结束放贷过程，视为贷款用户违约，自动销毁NFT，将销毁费转给放贷者 (`fn automatic_redemption_artwork()`)

## 队员信息(Team Member Information)

| 姓名(Name) | 角色(Role)                  | GitHub 帐号(GitHub) | 微信账号(WeChat) |
|----------|---------------------------|-------------|--------------|
| 孙铁兵(SunTiebing)    | 区块链后端(Blockchain Backend) | SunTiebing  | stb_wx       |
