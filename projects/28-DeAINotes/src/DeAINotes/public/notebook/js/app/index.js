let forAPP = {
    clearNode:async function(){
        let i=0;
        this.loading(true);
        for (let a1 of dal.allList) {
            i++;
            await dal.del(a1.id);
            sleep(500);
            console.log(i,'/',dal.allList.length)
        }
        this.loading(false);
        console.log('end');
        this.alert('清除完成!');
    },
    aysncNote: async function () {
        let tmp = '';
        this.loading(true);
        let count = {
            all: 0,
            ok: 0,
            err: 0
        };
        for (let a1 of noteDB) {
            for (let a2 of a1.children) {
                if (a2.children.length == 0) continue;
                for (let a3 of a2.children) {
                    //內容
                    count.all++;
                    tmp = await dal.add(a3.label, a3.body, a3.isPrivate);
                    // console.log('tmp',tmp);
                    // let tmp={id:new Date().valueOf(),msg:'ok'};
                    if (tmp.msg == 'ok'&&tmp.id) {
                        count.ok++;
                        a3.id=tmp.id;
                    } else {
                        count.err++;
                    }
                    delete a3.body;
                    delete a3.pid;
                    // console.log(count);
                    // console.log(a3);
                    // break;
                    sleep(500);
                }
                // break;
            }
            // break;
        }
        tmp = await dal.setTree(noteDB);
        console.log('tree 保存结果 ：', tmp);
        console.log('***********noteDB*****************');
        console.log(noteDB);
        this.loading(false);
        console.log('***********完成*****************');
    }
}