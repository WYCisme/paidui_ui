<template>
  <div class="home">
    <!--<div>-->
      <!--<el-input v-model="hostIP" style="width: 200px;"></el-input><el-button @click="test">测试</el-button>-->
    <!--</div>-->

    <div class="butn">
      <router-link class="link" to="/quhao" >取号端</router-link>
    </div>
    <br/>
    <br/>
    <br/>

    <div class="butn">
      <!--<router-link class="link" to="/jiaohao">叫号</router-link>-->
      <el-dropdown @command="handleCommand">
        <span class="link">
          叫号端
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in windowNums" :command="item.num" :disabled="item.isSelected">{{item.num}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
export default {
  name: 'home',
    data() {
        return {
            hostIP:null,//主机IP
            windowNums:[
                {
                    num:"1号窗口",
                    isSelected:false,//是否已选择
                },{
                    num:"2号窗口",
                    isSelected:false,//是否已选择
                },{
                    num:"3号窗口",
                    isSelected:false,//是否已选择
                },
            ],//窗口号
        }
    },
    mounted(){
        this.init();//初始化数据

    },
    methods:{
      init(){
          if (typeof(WebSocket) === "undefined") {
              alert("您的浏览器不支持socket")
          }
          //窗口数据初始化
          this.$axios.post('/api/windowInit',this.windowNums).then(resp=>{
              if (resp && resp.status === 200) {
                  console.log("当前窗口数据",resp.data.data);
                  this.windowNums = resp.data.data;
              }
          })

      },
        //选择窗口号
        handleCommand(cmd){
            console.log('窗口号',cmd);
            // this.$router.replace({path: '/jiaohao',params:{windowNum:cmd} });
            this.$router.push({name:'Jiaohao',query: {windowNum:cmd}})

        },
        test(){
            this.$store.commit('setIP',this.hostIP);//储存
            console.log('setIP',this.hostIP);//储存
            console.log('测试连接','http://'+ this.hostIP + ':8080/test');//储存

            this.$axios.get('http://'+ this.hostIP + ':8080/test').then(resp=>{
                if (resp && resp.static === 200) {
                    this.$notify({
                        title: '成功！',
                        message: '连接完成！',
                        type: 'success'
                    });

                }else{
                    this.$notify.error({
                        title: '失败！',
                        message: '连接未完成！',
                        type: 'success'
                    });
                }
            })

        }
    },
  components: {
    HelloWorld,
  }
}
</script>
<style>
  .home{
    font-size: 3rem;
    /*float: left;*/
    text-align-all: center;
    /*padding-left: 40%;*/
  }
  .butn{
    margin-top: 20px;
    width: auto;
    display: inline-block;
    border: #62b6ff;
    background-color: chartreuse;
  }
  .link{
    padding: 3px;
    font-size: 3rem;
    color: chartreuse;
    text-decoration-line: none;
    -webkit-text-fill-color: #ffdaa6;/*文字的填充色*/
    -webkit-text-stroke: 1.2px #000;
  }
</style>