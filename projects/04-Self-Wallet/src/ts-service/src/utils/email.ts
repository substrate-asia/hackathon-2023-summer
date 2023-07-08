import {config} from "../config";

export function SendEmail(email_to: string,subject:string,text:string){

    var nodemailer = require('nodemailer');

    // 创建发送对象
    var transporter = nodemailer.createTransport({
        // 邮箱服务的主机: qq: smtp.qq.com; 163: smtp.163.com
        host: config.email.email_host,
        // 开启安全连接
        secureConnection: true,
        port: 465,
        secure: true,
        auth: {
            // 发件人的邮箱账号
            user: config.email.email_from,
            // 发件人邮箱的授权码
            pass: config.email.email_pass,
        }
    });

    // 配置发送内容
    var mailOptions = {
        // 发件人邮箱
        from: config.email.email_from,
        // 收件人邮箱, 多个邮箱地址用逗号隔开
        to: email_to,
        // 邮件主题
        subject: '验证码',
        // 邮件内容 text: 纯文本; html: 识别标签
        text: text,
        // 发送邮箱附件
        // attachments: [{
        //     // 文件名
        //     filename: 'index.js',
        //     // 文件路径
        //     path: './'
        // }]
    }

    // 发送邮件
    transporter.sendMail(mailOptions, (err:any, info:any) => {
        if (err) {
            console.log(err)
        } else {
            console.log("邮件发送成功:"+info.response)
        }
    });
}

export function IsEmail(strEmail:string) {
    return strEmail.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1;
}