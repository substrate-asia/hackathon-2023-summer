// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library LibProject {
    // 服务者
    enum TaskerState {
        Processing,
        Submitted,
        Return,
        Completed,
        Overtime
    }
    //任务状态
    enum TaskState {
        Waiting,
        Processing,
        WaitTaskerModify,
        BuyerReview,
        Overtime,
        Completed,
        Closed
    }
    //子任务详情
    struct FileInfo {
        string name;
        uint256 size;
        uint256 videoLength;
        uint256 Page;
        uint256 words;
        uint256 fileType; //文件类型
        string path; //文件链接
        string transFile;
        string taskerFile;
        uint256 lastUpload; //最后更新时间
    }
    struct ReturnRecord {
        address toAddress; //打回者地址
        string returnFile; //打回文件
        string illustrate; //打回说明
    }
    //任务
    struct TranslationPro {
        address buyer; //发布者
        uint256 releaseTime; //发布时间
        string introduce; //项目介绍
        string need; //项目需求说明
        uint256 deadline; //截至日期
        uint256 sourceLanguage; //源语言
        uint256 goalLanguage; //目标语言
        uint256[] preferList; //偏好
        uint256 translationType; //类型
        uint256 workLoad; //工作量
        uint256 workLoadType; //任务类型
        bool isNonDisclosure; //是否保密
        bool isCustomize; //是否为组织
        bool isAITrans; //是否加入了AI翻译
        uint256 bounty; //赏金
        FileInfo[] tasks; //子任务
        address tasker; //任务者地址
        TaskerState transState; //服务者任务状态
        TaskState state; //项目状态
        string translationIndex;
    }
}
