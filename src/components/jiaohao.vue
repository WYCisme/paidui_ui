<template>
    <div class="test">

        <div class="time">
            <ht-time />
        </div>
        <div class="title">
            <h2>{{this.$route.query.windowNum}}</h2>
            <h2>当前排队人数：{{num}}</h2>
        </div>
        <div class="control">
            <el-button type="primary" round style="width: 200px; font-size: larger" @click="jiaohao" :disabled="!num>0">下一位</el-button>
        </div>

        <div v-if="isJH" style="margin-top: 30px; font-size: 3rem" ref="scroll">
            <!--<span>请</span>-->
            <span class="yellow">{{nowNum}}</span>
            <!--<span>号到窗口办理业务</span>-->

        </div>
    </div>
</template>

<script>
    import HtTime from '@/components/time'
    export default {
        name : 'jiaohao',
        data() {
            return {
                websock: null,
                num: 0,
                nowNum:null,
                windowNum:null,//窗口号

                isJH:false,//是否开始叫号
            }
        },
        components: {
            HtTime,
        },
        mounted(){
            this.$axios.post('/api/paiduiData').then(resp=>{
                if (resp && resp.status === 200) {
                    console.log('排队数据',resp.data);
                    this.num = resp.data.data.length;
                }
            });
        },
        created() {
            this.initWebSocket();
        },
        destroyed() {
            this.websock.close() //离开路由之后断开websocket连接
        },
        methods: {

            //叫号
            jiaohao(){
                console.log("开始叫号");
                this.$axios.post('/api/jiaohao/'+ this.$route.query.windowNum ).then(resp=>{
                    // console.log('返回',resp);
                    if (resp && resp.status === 200) {
                        // this.yourNum = resp.data.msg;
                    }
                });
            },

            initWebSocket(){ //初始化weosocket
                const wsuri = "ws://"+ this.$store.state.serverHostIP +":8080/websocket/jiaohao_"+ this.$route.query.windowNum;
                this.websock = new WebSocket(wsuri);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            websocketonopen(){ //连接建立之后,执行send方法发送数据，
                let actions = {type:"jiaohao",name:"窗口"};//区别叫号和取号
                this.websocketsend(JSON.stringify(actions));
            },
            websocketonerror(){//连接建立失败重连
                this.initWebSocket();
            },
            websocketonmessage(e){ //数据接收
                const redata = JSON.parse(e.data);
                console.log('服务端更新数据：' ,redata);
                this.num = redata.data.length;
                if (redata.type === "jiaohao") {
                    this.isJH = true;
                    this.nowNum = redata.msg;
                }
            },
            websocketsend(Data){//数据发送
                this.websock.send(Data);
            },
            websocketclose(e){  //关闭
                console.log('断开连接',e);
            },
        },
    }
</script>
<style lang='less'>
    .title{
        margin-top: 50px;
    }
    .control{
        margin-top: 50px;
    }
</style>
