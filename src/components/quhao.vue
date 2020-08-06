<template>
    <div class="main" >
        <div class="time">
            <ht-time />
        </div>

        <div v-if="isJH" style="margin-top: 30px; font-size: 3rem" ref="scroll">
        <span class="yellow">{{nowNum}}</span>
    </div>

        <div class="title">
            <h2 >当前排队人数：{{num}}</h2>
            <el-button type="success" round style="width: 200px; font-size: larger"  @click="quhao">取号</el-button>
            <div style="margin-top: 30px; font-size: 2rem; color: brown">{{yourNum}}</div>
        </div>


    </div>
</template>

<script>
    import HtTime from '@/components/time'

    export default {

        name : 'quhao',
        data() {
            return {
                callings: [],
                scrollTimer: -1,
                timer: -1,

                websock: null,
                num:0, //当前排队人数
                yourNum:null,//当前取的号
                nowNum: null,//当前叫到的号
                isJH:false,//是否开始叫号

            }
        },
        components: {
            HtTime,
        },
        created() {
            this.initWebSocket();
        },
        mounted(){
            this.$axios.post('http://localhost:8080/paiduiData').then(resp=>{
                if (resp && resp === 200) {
                    console.log('排队数据',resp.data);
                    this.num = resp.data.length;
                }
            });

        },

        destroyed() {
            this.websock.close() //离开路由之后断开websocket连接
        },
        methods: {


            //取号
            quhao(){
                console.log("开始取号");
                this.$axios.post('/api/quhao').then(resp=>{
                    console.log('返回',resp);
                    if (resp && resp.status === 200) {
                        this.yourNum = resp.data.msg;
                    }
                });
            },

            initWebSocket(){ //初始化weosocket
                const wsuri = "ws://"+ this.$store.state.serverHostIP +":8080/websocket/quhao";
                this.websock = new WebSocket(wsuri);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            websocketonopen(){ //连接建立之后,执行send方法发送数据，
                let actions = {type:"quhao",name:"窗口"};//区别叫号和取号
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
                    this.voicePrompt(redata.msg); //语音播报
                    setTimeout(() => {
                        this.voicePrompt(redata.msg); //语音播报
                    }, 5000); // 延时五秒再次播报
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
    .main{
        align-items: center;
        text-align: center;
        vertical-align: middle;

    }
    .time {
        margin-top: 10px;
        height: 100%;
        width: 100%;
        line-height: 1rem;
        /*float: right;*/
        /*display: inline-block;*/
    }
    .title{
        margin-top: 50px;

    }

</style>
