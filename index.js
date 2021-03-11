const Koa = require('koa');
const Router = require('koa-router');
const glob = require("glob");
const { resolve } = require('path');
const fs = require('fs');
 
const app = new Koa();
const router = new Router({prefix: '/api'});
const routerMap = {};  // 存放路由映射

// 注册路由
glob.sync(resolve('./api', "**/*.json")).forEach((item, i) => {
    let apiJsonPath = item && item.split('/api')[1];
    let apiPath = apiJsonPath.replace('.json', '');

    // get请求
    router.get(apiPath, (ctx, next) => {
        // console.log('get', apiPath)
        try {
            let jsonStr = fs.readFileSync(item).toString();
            ctx.body = {
                data: JSON.parse(jsonStr),
                error: false,
                errorCode: null,
                errorMessage: "",
                stock: false,
            }
        }catch(err) {
            ctx.throw('服务器错误', 500);
        }
    });

    // post请求
    router.post(apiPath, (ctx, next) => {
        // console.log('post', apiPath)
    try {
        let jsonStr = fs.readFileSync(item).toString();
        ctx.response.body = {
            data: JSON.parse(jsonStr),
            error: false,
            errorCode: null,
            errorMessage: "",
            stock: false,
        }
    }catch(err) {
        ctx.throw('服务器错误', 500);
    }
    });
    
    // 记录路由
    routerMap[apiJsonPath] = '/api' + apiPath;
});

// 保存路由
fs.writeFile('./routerMap.json', JSON.stringify(routerMap, null , 4), err => {
    if(err) {
        console.log(err)
    }
});
 
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, () => {
    console.log("run:", "http://localhost:3000")
});