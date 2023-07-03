# Deep Diary

## Basic Information

Project Name: Deep Diary

Project Initiation Date: 2023.5

## Brief Introduction

**Mission**: Make personal data valuable, both for yourself and others

**Vision**: Establish a decentralized personal web disk platform to help users store personal diary, images, videos and other personal data at a low cost, Make all memories search-able and traceable.

**Values**: the user is supreme, prestige first, dedication, honesty a win-win situation

### Background

- we will store Thousands of pictures in our disk, in the other words: personal data is hard to search and manage
- each of us has many personal data, such like images, hoby, realtions, skills, etc. however, none of this data has bringed value to you
- we will create many memories in our daily life like wechat, diary, image, video, sound, diary, gps rount, ect. however, each of them is independent and lake of relation ship
- centralized: many current web albums are centralized and the data only belongs to operators 

### Problems to be Solved

- quick search for your personly data
- quick search for your social resources and demands
- Decentralized storage
- data encryption
- train all the personal data and run in a robot, we call it as **personal memory hoursekeeper**
- make personal data value

deep-diary, which is based on `deep leaning` and `web3` technology, extract features from your pictures, videos, diary text,  chatting records, gps records etc., then fuse and train all the features together. in the other words, it could fuse all the shard of your memories, which could help you remember your friends' detail information, resources and needed, help you remember all your experience, like travel, parties, activities, help you find the relationship among friends, resources and needs. for the storage, all the resource will be stored in the decentralized storage server and will be more safe and are only belongs to you, which could bring you some incoming if any body visit your resources.

## Demo

### Feature Lists

- upload the images

- Extract image information

- Search for personal data using multimode like natural language, text, voice and image
- Visualization for personal data
- Web3 storage
- Event diary
- Social resource
- NFT Token for personal data


### Upload the image

there are 3 ways to upload the image. 

- web
- win app
- dapp

![image-20220721073138187](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/image-20220721073138187.png)

### Extract Image Information

after uploading the img, our system will do those process: 

- synchronize the resource to the MCS
- auto tagging
- auto category
- face recognition
- fetch colors
- fetch any other exif(Exchangeable Image File) info like GPS , date, layout(wide or tall), etc.
- fetch image features
- fetch image caption

#### Synchronize the Resource to the CESS

for the storage, Unlike traditional web2.0 network disk, which have the features of centralized, so it will be hard controlled by the user, for this project, we are using the CESS(Cumulus Encrypted Storage System) as the default storage. which will be decentralized and more safe for the data

#### Auto Tagging

![img](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/1310f1459e8cabf0e02cea3fd5960e7d.jpeg)

```json
 "tags": "people,attractive,cover girl,adult,pretty,fashion,sexy,model,portrait,person,face,hair,lady,eyes,makeup,brunette,skin,smasher,lips,blond,cute,smile,human,youth",
```

For example, this photo will likely have the tags ‘people’, ‘hair’, ‘lady’, and the like. But depending on the system, it may also have tags like colors, objects, and other specific items and characteristics in the image — including abstract terms like ‘attractive’, ‘sexy’, and more. 

#### Auto Category

for the auto category, it is based on the deep learning. and the accuracy will be improved by iterative loop like this.

- predefine the categories and prepare some images
- training the model
- do the auto category, then do the Manual correction for our own image.
- if someone could share the high accuracy category images, we could do the training again, and the result will be more better

in the near future, we will provide some service that the user could train their own data 

![image-20230703213055563](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/image-20230703213055563.png)

#### Face Recognition

face recognition could help you auto tagging the img with the personal name, which will be helpful to organize or search your images based on the face names or face numbers

![image-20220813134822201](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/image-20220813134822201.png)

![image-20230703213302296](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/image-20230703213302296.png)

There are also could selected a person,  using dynamic planning algorithm, automatically splicing into a large picture, which can specify the aspect ratio, as follows is an example of multiple faces put together,

which function also could:

- use multiple faces of a person and put together

- extract face photos from class or alumni group photos and put them together

![face_maker_out](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/face_maker_out.jpg)

#### Fetch Colors

this is the result of this color extraction. let's make an example. 

![image-20220918090919667](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/image-20220918090919667.png)

pls watch the third image, which is a beautiful girl. in this image, there mainly have three parts.

- white background, marking as number ==1==
- hair, marking as number ==2==
- skin, marking as number ==3==

based on which, we could do the color search both based on background color, foreground color, or the total image colors. it will be interest, isn't it.

OK, now let's see the code how to realized this result

**why shall we need to fetch colors**

If we uploads tons of product images to the system, we would have to identify and assign the right colors for each product. This can be hard for us  and also requires time that could otherwise be spent on doing something more creative and productive. Our color extraction solves this automatically.

based on which, we could do the color search both based on the background color, foreground color, or the total image colors. it will be interest, isn't it.

after fetching the color, we could search the image based on the color attribute

#### Fetch any other exif Information

other exif info are like GPS , date, layout(wide or tall), etc. which have 2 advantages:

- make our image searchable by location or city name, date and layout
- show all the images through map dimension based on the GPS

#### Fetch Caption of a Image

input an image

![demo2](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/demo2.jpg)

**output a caption**

['a little boy that is standing in the grass']



### Quick Search for personal data 

we could search a image by those items using multi mode like natural language, text, voice, image etc.: 

- date
- location
- people
- people group (person A and B)
- people numbers （2 or 3 ...）
- foreground color
- background color
- image color
- scene（indoor, outdoor, ....could define by the user）
- tags
- layout
- image
- description
- voice
- rating
- name (name A & name B, could multi choose)

#### One Search

![image-20230703223200676](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/image-20230703223200676.png)

#### Person Number Search

![image-20230703223318597](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/image-20230703223318597.png)

#### Person Group Search

![image-20230703223622803](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/image-20230703223622803.png)

#### Tags Search

![image-20230703223728004](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/image-20230703223728004.png)

#### Color Search

![image-20230703224057433](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/image-20230703224057433.png)

#### Date Search

![image-20230703224037412](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/image-20230703224037412.png)

#### Image Search

if we fetched the image feature, then we could search the image by image or text, or by voice(voice to text comes first)

![search_top_6_IMG_20210909_194805](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/search_top_6_IMG_20210909_194805.png)

#### Caption Search



![search_top_6_some people having dinner in home](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/search_top_6_some%20people%20having%20dinner%20in%20home.png)

### Visualization for personal data

#### Gallery Show

![image-20220813122052430](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/image-20220813122052430.png)

![image-20220813122131977](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/image-20220813122131977.png)

#### Face Show

Double click on the face to view all the face photos or original photos of the person in a gallery

![image-20220813132310886](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/image-20220813132310886.png)

#### Map Show

![image-20230703225036246](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/image-20230703225036246.png)

#### Graph Show

each category could be a kind of node. like person address, diary, audio, video, diary, company, then we could find or search the relationship.

- after we recode enough personal data, we could train the mulitmodel by GCN and Transformers.
- after we recode enough person's resource and demands and train,  it will help us do the demand matching

![image-20230703225153458](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/image-20230703225153458.png)

==we could combine all the personal data and trained a model, then could run in the robot, that robot will be our memory hourskeeper, here memory will be better then you one day in the future, you need count on her==



## Technical Famework

- openAI api
- insight face
- lavis
- detectron
- transforms
- vue-admin-better
- django

## Logo

![logo_lg](https://deep-diary.oss-cn-hangzhou.aliyuncs.com/blog/logo_lg.png)

## First Commit

### For the Frontend

we develop the web based on vue-admin-better

### For the Backend

we develop it by ourself while using some open source packages and models: 

- insightface
- openai
  - clip
  - chatgpt 3.5 api
- detectron
- lavis
- transformers

## team member
|姓名|角色|github|通讯方式|
|---|---|---|---|
|Max|项目组织，项目开发|max1015070108@gmail.com||
|Blue|全栈开发|deep-diary@qq.com||
|Harry|合约开发|defiking0108@gmail.com||

