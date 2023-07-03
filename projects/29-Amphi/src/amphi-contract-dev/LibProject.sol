// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library LibProject {
    //项目状态：已发布、进行中、超时、无人选择、已关闭,已完成
    //  enum ProjectState {Waiting ,Published,Processing,Overtime, NoOnePick, Closed,Completed }
    enum ProjectState {
        Waiting,
        WaitingForTrans,
        WaitingForVf,
        Processing,
        Overtime,
        NoOnePick,
        Closed,
        Completed
    }
    // 校验者||翻译者状态
    enum TaskerState {
        Processing,
        Submitted,
        Return,
        Completed,
        Overtime
    }
    //文件状态 Waiting-等待翻译者、校验者接单 WaitingForTrans-等待翻译者接单，校验者已接单 , WaitingForVf-等待校验者接单，翻译者已接单
    enum FileState {
        Waiting,
        WaitingForTrans,
        WaitingForVf,
        Translating,
        Validating,
        WaitTransModify,
        BuyerReview,
        WaitVfModify,
        Accepted,
        NoOnePick,
        Overtime,
        Closed
    }
    //文件
    struct FileInfo {
        string name;
        uint256 size;
        uint256 videoLength;
        uint256 Page;
        uint256 words;
        uint256 fileType; //文件类型
        string path; //文件链接
    }
    //任务者
    struct Tasker {
        uint256[] taskIndex; //任务（文件）索引
        uint256 number;
        mapping(uint256 => FileIndexInfo) info;
    }
    //子任务详情
    struct TaskInfo {
        FileInfo file; //文件信息
        uint256 bounty; //赏金
        string info; //任务说明
        FileState state; //任务状态
        uint256 lastUpload; //最后更新时间
    }
    struct FileIndexInfo {
        TaskerState state; //任务者状态
        string file; //提交的文件
        bool isUsed;
        //  uint256 bounty;
    }
    struct ReturnTasker {
        address taskerAddress; //任务者地址
        uint256[] taskIndex; //接的任务的索引值
        FileIndexInfo[] taskerinfo; //接收的任务信息
    }
    struct ReturnRecord {
         address toAddress; //打回者地址
         string returnFile; //打回文件
         string illustrate; //打回说明
     }
    //项目
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
        uint256 workLoadType;
        bool isNonDisclosure; //是否保密
        bool isCustomize; //是否为自定义支付
        uint256 bounty; //赏金
        TaskInfo[] tasks; //子任务
        address[] translators; //翻译者名单
        address[] verifiers; //校验者名单
        //mapping(address => Tasker) transInfo; //翻译者接单信息
        // mapping(address => Tasker) vfInfo; //校验者接单信息
        // Tasker[] translators; //翻译者
        // Tasker[] verifiers;   //校验者
        uint256 maxT; //任务总量-翻译
        uint256 maxV; //任务总量-校验
        uint256 numberT; //已接任务数-翻译
        uint256 numberV; //已接任务数-校对
        bool isTransActive; //翻译者状态: true.开启 false：关闭
        bool isVerActive; //校验者状态: true:开启 false:关闭
        ProjectState state; //项目状态
    }
    //项目发布参数
    struct ProParm {
        uint256 releaseTime; //发布时间
        string introduce; //项目介绍
        string need; //项目需求说明
        uint256 deadline; //截至日期
        uint256 sourceLanguage; //源语言
        uint256 goalLanguage; //目标语言
        uint256[] preferList; //偏好
        uint256 translationType; //类型
        uint256 workLoad;
        uint256 workLoadType;
        bool isNonDisclosure; //是否保密
        bool isCustomize; //是否为自定义支付
        uint256 bounty; //赏金
        TaskInfo[] tasks; //子任务
    }
    //返回任务详情
    struct ReturnTask {
        // address buyer; //发布者
        // uint256 releaseTime; //发布时间
        // string introduce; //项目介绍
        // string need; //项目需求说明
        // uint256 deadline; //截至日期
        // uint256 sourceLanguage; //源语言
        // uint256 goalLanguage; //目标语言
        // uint256[] preferList; //偏好
        // uint256 translationType; //类型
        // uint256 workLoad; //工作量
        // bool isNonDisclosure; //是否保密
        // bool isCustomize; //是否为自定义支付
        // uint256 bounty; //赏金
        // TaskInfo[] tasks; //子任务
        // address[] translators; //翻译者名单
        // address[] verifiers; //校验者名单
        TranslationPro pro;
        ReturnTasker[] transInfo; //翻译者详细信息
        ReturnTasker[] vfInfo; //校验者详细信息
        // uint256 maxT; //任务总量-翻译
        // uint256 maxV; //任务总量-校验
        // uint256 numberT; //已接任务数-翻译
        // uint256 numberV; //已接任务数-校对
        // bool isTransActive; //翻译者状态: true.开启 false：关闭
        // bool isVerActive; //校验者状态: true:开启 false:关闭
        // ProjectState state; //项目状态
    }
}
