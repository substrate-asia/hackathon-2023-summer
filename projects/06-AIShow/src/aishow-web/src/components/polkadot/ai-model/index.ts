import { ApiPromise } from '@polkadot/api';
import {web3FromAddress} from "@polkadot/extension-dapp";

export interface CreateModelVO {

    // 模型hash， 文件上传后返回的hash值
    hash: string
    // 模型名
    name: string
    // 模型下载链接
    link: string
    // 图片列表
    images: ImageVO[]
    // 下载价格
    downloadPrice: number
    // 模型大小
    size: number,
    // markdown 备注
    comment: string,
    // 文件名
    filename: string
}

export interface ModelVO extends CreateModelVO {
    createTime: number
}

export interface ImageVO {
    // 图片名（图片hash)
    image: string
    // 图片地址
    imageLink: string
}

export interface CreatePostVO {
    // 模型hash
    modelHash: string
    // uuid
    uuid: string
    // 主题名
    name: string
    // 图片列表
    images: ImageVO[]
    // markdown 备注
    comment: string
}

export interface NFT {

    collectionId: number,
    itemId: number,
    post: CreatePostVO,
    itemUuid: string,
    itemLink: string,
    name: string,
    description: string,
    owner: string
}

export interface NFTCreateVO {
    modelHash: string,
    postId: string,
    uuid: string,
    name: string,
    description: string,
}


export interface CallbackResult {
    // inblock | error
    status: string,
    id: string,
    error: any
}

export interface NFTCallbackResult extends CallbackResult{
    collectionId: number,
    itemId: number
}

export type Callback = ((result: CallbackResult | NFTCallbackResult)=> void )| undefined

export interface AiShowChain {

    // 创建模型
    createModel(createModelVO: CreateModelVO, callback: Callback ): Promise<void>
    // 创建模型下的post（模型图片）
    createPost(createPostVO: CreatePostVO, callback: Callback): Promise<void>
    // 购买模型
    buyModel(modelHash: string, callback: Callback): Promise<void>
    // 用户模型选择
    userModelSelect(address: string): Promise<ModelVO[]>
    // 模型详情
    modelDetail(modelHash: string): Promise<ModelVO>
    // 模型列表
    modelList(): Promise<ModelVO[]>
    // 用户模型列表
    userModelList(address: string): Promise<ModelVO[]>
    // postList
    postList(modelHash: string): Promise<CreatePostVO[]>
    // post 详情
    postDetail(modelHash: string, postUUID: string): Promise<CreatePostVO>
    // 用户post
    userPostList(address: string): Promise<CreatePostVO[]>
    // nft list
    nftList(): Promise<NFT[]>
    // 判断是否需要创建collection
    ifNeedCreateCollection(modelHash: string): Promise<boolean>
    //nft mint
    nftMint(nft: NFTCreateVO,callback: Callback): Promise<void>
    // userNFT
    userNFT(address: string): Promise<NFT[]>
    /// nftDetail
    nftDetail(collectionId: number,itemId: number): Promise<NFT>
    // transfer
    nftTransfer(collectionId: number, itemId: number,dest: string,callback: Callback): Promise<void>

}

/*
    // 以下需要配置为全局
    const allInjected = await web3Enable('my cool dapp');
    console.log(allInjected)
    const allAccounts = await web3Accounts();
    const account = allAccounts[0].address
    const wsProvider = new WsProvider('wss://ws.aishow.hamsternet.io');
    const api = await ApiPromise.create({provider: wsProvider});
    // 以上需要配置为全局

    const client = new PolkadotAiChanClient(api,account)
    await client.buyModel("abc",(status ) => {
        console.log(status)
    })
 */
export class PolkadotAiChanClient implements AiShowChain{

    private api: ApiPromise

    private readonly sender: string

    constructor(api: ApiPromise,sender: string) {
        this.api = api
        this.sender = sender
    }

    substrateListener = ({ status, events },callback: Callback) => {
        if (status.isInBlock || status.isFinalized) {
            events
                // find/filter for failed events
                .filter(({ event }) =>
                    this.api.events.system.ExtrinsicFailed.is(event)
                )
                // we know that data for system.ExtrinsicFailed is
                // (DispatchError, DispatchInfo)
                .forEach(({ event: { data: [error, info] } }) => {
                    if (error.isModule) {
                        // for module errors, we have the section indexed, lookup
                        const decoded = this.api.registry.findMetaError(error.asModule);
                        const { docs, method, section } = decoded;

                        console.log(`${section}.${method}: ${docs.join(' ')}`);
                        const errMsg = `${section}.${method}: ${docs.join(' ')}`
                        if(callback){
                            callback({status: "error",id: "",error: errMsg})
                        }
                    } else {
                        // Other, CannotLookup, BadOrigin, no extra info
                        console.log(error.toString());
                        if(callback){
                            callback({status: "error",id: "",error: error.toString()})
                        }
                    }
                });
        }
    }

    async createModel( createModelVO: CreateModelVO,callback: Callback ) {
        const injector = await web3FromAddress(this.sender)

        const collectionIdCodec = await this.api.query.nfts.nextCollectionId()
        let collectionId = 0
        if(collectionIdCodec.isSome){
            collectionId = collectionIdCodec.value.toNumber()
        }

        try {
            const txs = [
                this.api.tx.aiModel.createAiModel(
                    createModelVO.hash,
                    createModelVO.name,
                    createModelVO.filename,
                    createModelVO.link,
                    createModelVO.images.map(t => t.image),
                    createModelVO.images.map(t => t.imageLink),
                    createModelVO.downloadPrice,
                    createModelVO.size,
                    createModelVO.comment
                ),
                this.api.tx.nfts.create(
                    {Id: this.sender},
                    {
                        settings: 0,
                        maxSupply: null,
                        mintSettings: {
                            defaultItemSettings: "0",
                            endBlock: null,
                            mintType: "Issuer",
                            price: null,
                            startBlock: null,
                        }
                    },
                ),
                this.api.tx.nfts.setCollectionMetadata(
                    collectionId, createModelVO.hash
                )
            ]

            const unsub = await this.api.tx.utility.batch(txs).signAndSend(this.sender, {signer: injector.signer}, (result) => {
                if (result.status.isInBlock) {
                    console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
                    if (result.dispatchError) {
                        this.substrateListener(result, callback)
                    } else if (callback) {
                        callback({status: "inBlock", id: createModelVO.hash, error: undefined})
                    }
                    unsub();
                }
            });
        }catch (e){
            console.log("err:", e)
        }
    }

    async createPost(createPostVO: CreatePostVO, callback: Callback) {
        const injector = await web3FromAddress(this.sender)
        const unsub = await this.api.tx.aiModel.createAiImage(
            createPostVO.modelHash,
            createPostVO.uuid,
            createPostVO.name,
            createPostVO.images.map(t => t.image),
            createPostVO.images.map(t => t.imageLink),
            createPostVO.comment
        ).signAndSend(this.sender, {signer: injector.signer}, (result) => {
            if (result.status.isInBlock) {
                console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
                if (result.dispatchError) {
                    this.substrateListener(result, callback)
                } else if (callback) {
                    callback({status: "inBlock", id: createPostVO.uuid, error: undefined})
                }
                unsub();
            }
        });
    }

    async buyModel(modelHash: string, callback: Callback){
        const injector = await web3FromAddress(this.sender)
        const unsub =  await this.api.tx.aiModel.buyModel(
            modelHash
        ).signAndSend(this.sender, {signer: injector.signer}, (result) => {
            if (result.status.isInBlock) {
                console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
                if (result.dispatchError) {
                    this.substrateListener(result, callback)
                } else if (callback) {
                    callback({status: "inBlock", id: modelHash, error: undefined})
                }
                unsub();
            }
        });
    }

    async modelList() {

        const modelHashCodec = await this.api.query.aiModel.aiModelHash()

        if(modelHashCodec === undefined){
            throw new Error('storage value not found')
        }

        // @ts-ignore
        const modelHashList: string[] = modelHashCodec.toHuman()

        let result: ModelVO[] = []

        for(let hash of modelHashList){
            const model: ModelVO = await this.modelDetail(hash)
            result.push(model)
        }

        return result
    }

    async userModelList(address: string): Promise<ModelVO[]> {
        const modelHashCodec = await this.api.query.aiModel.userModels(address)

        if(modelHashCodec.toHuman() === null){
            return []
        }

        // @ts-ignore
        const modelHashList: string[] = modelHashCodec.toHuman()

        let result: ModelVO[] = []

        for(let hash of modelHashList){
            const model = await this.modelDetail(hash)
            result.push(model)
        }

        return result
    }

    async postList(modelHash: string) {
        const postsCodec = await this.api.query.aiModel.modelPost(modelHash)
        if(postsCodec.toHuman() === undefined || postsCodec.toHuman() == null){
            throw new Error('storage value not found')
        }

        const result = []
        for(let postUUID of postsCodec.toHuman()){
            // const keys = postCodec[0].toHuman()
            const postCodec = await this.api.query.aiModel.aiPosts(postUUID)
            result.push(this.toCreatePostVO(postCodec.toHuman()))
        }

        return  result
    }

    async postDetail(modelHash: string, postUUID: string): Promise<CreatePostVO> {
        const postCodec = await this.api.query.aiModel.aiPosts(postUUID)
        return this.toCreatePostVO(postCodec.toHuman())
    }

    async nftList(): Promise<NFT[]> {

        const result: NFT[] = []
        // 先查询所有collection
        const nftItem = await this.api.query.nfts.itemMetadataOf.entries()

        for(let item of nftItem ){
            // @ts-ignore
            let storageKey = item[0].toHuman()
            // @ts-ignore
            const collectionId = storageKey[0]
            // @ts-ignore
            const itemId = storageKey[1]
            const collectionCodec = await this.api.query.nfts.collectionMetadataOf(collectionId)
            if(collectionCodec.toHuman() === null){
                continue
            }

            const itemCodec = await this.api.query.nfts.item(collectionId,itemId)
            if(itemCodec.toHuman() === null){
                continue
            }

            // @ts-ignore
            const modelHash = collectionCodec.toHuman().data
            // @ts-ignore
            const postAndImageUUid = item[1].toHuman().data
            const postUuid = postAndImageUUid.split('/')[0]
            const imageUuid = postAndImageUUid.split('/')[1]
            const post = await this.getCreatePostVO(modelHash,postUuid)
            const mintedImage = post.images.find(t => t.image = imageUuid)
            if(mintedImage === undefined){
                continue
            }
            result.push({
                collectionId: collectionId,
                itemId: itemId,
                post: post,
                itemUuid: mintedImage.image,
                itemLink: mintedImage.imageLink,
                name: "nft name",
                description: "nft description",
                owner: itemCodec.toHuman().owner,
            })
        }
        return result
    }

    async modelDetail(modelHash: string) {

        const result = await this.api.query.aiModel.aiModels(modelHash)
        if(result === undefined){
            throw new Error("storage value not found")
        }

        // @ts-ignore
        const imageNames = result.value.images.toHuman()
        const imageLinks = result.value.imageLinks.toHuman()
        const images = []
        for(let i = 0 ; i< imageNames.length; i++){
            images.push({
                image: imageNames[i],
                imageLink: imageLinks[i]
            })
        }
        const model: ModelVO = {
            hash: result.value.hash_.toHuman(),
            name: result.value.name.toHuman(),
            link: result.value.link.toHuman(),
            images: images,
            size: result.value.size_.toNumber(),
            downloadPrice: result.value.downloadPrice.toNumber(),
            comment: result.value.comment.toHuman(),
            createTime: result.value.createTime.toNumber(),
            filename: result.value.filename.toHuman(),
        }

        return model
    }

    toCreatePostVO = (item: any) => {
        const imageNames = item.images
        const imageLinks = item.imageLinks
        const images = []
        for(let i = 0 ; i< imageNames.length; i++){
            images.push({
                image: imageNames[i],
                imageLink: imageLinks[i]
            })
        }
        const post: CreatePostVO = {
            modelHash: item.modelHash,
            uuid: item.uuid,
            name: item.name,
            images: images,
            comment: item.comment,
        }
        return post
    }

    async getCreatePostVO(modelHash: string, uuid: string): Promise<CreatePostVO>{

        const codec = await this.api.query.aiModel.aiPosts(uuid)

        const vo = codec.toHuman()
        const imageNames = vo.images
        const imageLinks = vo.imageLinks
        const images = []
        for(let i = 0 ; i< imageNames.length; i++){
            images.push({
                image: imageNames[i],
                imageLink: imageLinks[i]
            })
        }
        return {
            modelHash: modelHash,
            uuid: vo.uuid,
            name: vo.name,
            images: images,
            comment: vo.comment,
        }
    }


    async ifNeedCreateCollection(modelHash: string): Promise<boolean> {

        try {
            await this.nftGetCollectionId(modelHash)
            return false
        }catch (e){
            return true
        }
    }

    async nftMint(nft: NFTCreateVO,callback: Callback): Promise<void> {

        let ifNeedCreateCollection = await  this.ifNeedCreateCollection(nft.modelHash)
        const txs  = []
        if(ifNeedCreateCollection){
           let createTxs = await this.nftCreateCollection(nft.modelHash)
            txs.push(...createTxs)
        }

        const collectionId = await this.nftGetCollectionId(nft.modelHash)
        // 查询item 数量
        const collectionCodec = await this.api.query.nfts.collection(collectionId)
        if(collectionCodec === undefined){
            throw new Error("storage not found")
        }
        const collection = collectionCodec.toHuman()
        const itemNum = parseInt(collection.items)
        const injector = await web3FromAddress(this.sender)

        txs.push(this.api.tx.nfts.mint(
            collectionId,
            itemNum,
            {Id: this.sender},
            null
        ))

        txs.push(this.api.tx.nfts.setMetadata(
            collectionId,
            itemNum,
            `${nft.postId}/${nft.uuid}`
        ))

        txs.push(this.api.tx.nfts.setAttribute(
            collectionId,itemNum,"ItemOwner","name",nft.name
        ))
        txs.push(this.api.tx.nfts.setAttribute(
            collectionId,itemNum,"ItemOwner","description",nft.description
        ))

        const unsub =  await this.api.tx.utility.batch(txs)
            .signAndSend(this.sender, {signer: injector.signer}, (result) => {
                if (result.status.isInBlock) {
                    console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
                    if (result.dispatchError) {
                        this.substrateListener(result, callback)
                    } else if (callback) {
                        callback({
                            status: "inBlock",
                            id: `${itemNum}`,
                            error: undefined,
                            collectionId: collectionId,
                            itemId: itemNum
                        })
                    }
                    unsub();
                }
            });
    }

    async nftGetCollectionId(modelHash: string): Promise<number> {
        const result = await this.api.query.nfts.collectionMetadataOf.entries()

        for(let item of result){
            if(item.length < 2 ){
                continue
            }
            // @ts-ignore
            if(item[1].toHuman().data === modelHash && item[0]){
                const numArr = item[0].toHuman()
                if(numArr instanceof Array){
                    // @ts-ignore
                    return parseInt(numArr[0])
                }
            }
        }
        throw new Error('storage not found')
    }

    async userNFT(address: string): Promise<NFT[]> {

        const result:NFT[] = []
        const collectionAccountCodec = await this.api.query.nfts.collectionAccount.entries(address)

        for(let item of collectionAccountCodec){
            const keys = item[0].toHuman()
            const collectionId = keys[1]

            // 查询此collectionId 下有多少NFT
            const nfsCodec = await this.api.query.nfts.account.entries(address,collectionId)

            for(let account of nfsCodec){
                const accountKeys = account[0].toHuman()
                const itemId = accountKeys[2]
                const nft = await this.getNFT(collectionId,itemId)
                result.push(nft)
            }
        }

        return result
    }

    async getNFT(collectionId: number, itemId: number): Promise<NFT>{
        const modelHashCodec = await this.api.query.nfts.collectionMetadataOf(collectionId)
        const modelHash = modelHashCodec.toHuman().data
        const postCodec = await this.api.query.nfts.itemMetadataOf(collectionId,itemId)
        const postAndImageUUID = postCodec.toHuman().data

        const postUuid = postAndImageUUID.split('/')[0]
        const imageUuid = postAndImageUUID.split('/')[1]
        const post = await this.getCreatePostVO(modelHash,postUuid)
        const mintedImage = post.images.find(t => t.image = imageUuid)

        if(mintedImage === undefined){
            throw new Error("stroage value error")
        }

        const nameCodec = await this.api.query.nfts.attribute(collectionId,itemId,"ItemOwner","name")
        const descriptionCodec = await this.api.query.nfts.attribute(collectionId,itemId,"ItemOwner","name")
        let nameValue = ""
        let descriptionValue = ""
        if(nameCodec.toHuman() && nameCodec.toHuman() instanceof Array){
            nameValue = nameCodec.toHuman()[0]
        }
        if(descriptionCodec.toHuman() && descriptionCodec.toHuman() instanceof Array){
            descriptionValue = descriptionCodec.toHuman()[0]
        }

        const itemCodec = await this.api.query.nfts.item(collectionId,itemId)
        let owner = ""
        if(itemCodec.toHuman() != null){
            owner = itemCodec.toHuman().owner
        }

        return {
            collectionId: collectionId,
            itemId: itemId,
            post: post,
            itemUuid: mintedImage.image,
            itemLink: mintedImage.imageLink,
            name: nameValue,
            description: descriptionValue,
            owner: owner
        }
    }

    async userModelSelect(address: string): Promise<ModelVO[]> {

        const codec = await this.api.query.aiModel.userPaid(address)

        if(codec.toHuman() === null){
            return []
        }

        const result = []
        for(let modelHash of codec.toHuman()){
            const model = await this.modelDetail(modelHash)
            result.push(model)
        }

        return result
    }

    async userPostList(address: string): Promise<CreatePostVO[]> {

        const codec = await this.api.query.aiModel.userPost(address)
        const result = []

        if(codec.toHuman() == null){
            return []
        }

        for(let postUUID of codec.toHuman()){
            const postCodec = await this.api.query.aiModel.aiPosts(postUUID)
            const post = this.toCreatePostVO(postCodec.toHuman())
            result.push(post)
        }

        return result
    }

    async nftDetail(collectionId: number, itemId: number): Promise<NFT> {
        return await this.getNFT(collectionId,itemId)
    }

    async setAttribute(collectionId: number, itemId: number, key: string , value: string,callback: Callback ){

        const injector = await web3FromAddress(this.sender)
        const unsub =  await this.api.tx.nfts.setAttribute(
            collectionId,itemId,"ItemOwner",key,value
        ).signAndSend(this.sender, {signer: injector.signer}, (result) => {
            if (result.status.isInBlock) {
                console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
                if (result.dispatchError) {
                    this.substrateListener(result, callback)
                } else if (callback) {
                    callback({status: "inBlock", id: `${itemId}`, error: undefined})
                }
                unsub();
            }
        });

        const codec = await this.api.query.nfts.attribute(0,1,"CollectionOwner","name")
        console.log(codec)
    }

    async nftTransfer(collectionId: number, itemId: number, dest: string, callback: Callback): Promise<void> {
        const injector = await web3FromAddress(this.sender)
        const unsub =  await this.api.tx.nfts.transfer(
            collectionId,itemId,dest
        ).signAndSend(this.sender, {signer: injector.signer}, (result) => {
            if (result.status.isInBlock) {
                console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
                if (result.dispatchError) {
                    this.substrateListener(result, callback)
                } else if (callback) {
                    callback({status: "inBlock", id: `${itemId}`, error: undefined})
                }
                unsub();
            }
        });
    }
}
