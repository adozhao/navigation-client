<template>
    <div class="container">
        <img v-if="bgSrc" class="image-bg" :src="bgSrc">
        <form class="login-box">
            <el-input v-model="username" class="input" prefix-icon="el-icon-user" placeholder="用户名" clearable></el-input>
            <el-input v-model="password" class="input" prefix-icon="el-icon-lock" placeholder="密码" show-password clearable @keyup.enter.native="btnHandler"></el-input>
            <el-button class="btn-login" type="primary" @click="btnHandler">{{ isLoginType? '登录' : '注册'  }}</el-button>
            <div class="text-link" @click="btnSwitch">{{ isLoginType? '注册' : '已有账号，去登录' }}</div>

            <div class="version">v1.0.0</div>
        </form>
    </div>
</template>

<script>
import { login, register } from '@/api/user'
import constants from '@/constants'
export default{
    data(){
        return {
            username: '',
            password: '',
            isLoginType: true
        }
    },
    computed:{
        bgSrc(){
            let bgPath = this.$store.state.user.bgPath
            if(!bgPath || bgPath == 'undefined'){
                return ''
            }else{
                return constants.baseUrl + bgPath
            }
        },
    },
    methods:{
        btnSwitch(){
            this.isLoginType = !this.isLoginType
            this.username = ''
            this.password = ''
        },
        btnHandler(){
            if(!this.username || !this.password){
                return this.$notify({
                    title: '警告',
                    message: '请输入用户名和密码',
                    position: 'bottom-right',
                    type: 'warning'
                });
            }
            if(this.isLoginType){
                login({
                    username: this.username,
                    password: this.password
                }).then(res=>{
                    const data = res.data
                    this.$store.commit('user/SET_TOKEN', data.token)
                    this.$store.commit('user/SET_BG_IMAGE', data.bgPath)
                    this.$router.push('Home')
                })
            }
            else{
                register({
                    username: this.username,
                    password: this.password
                }).then(res=>{
                    this.username = ''
                    this.password = ''
                    this.isLoginType = true
                    this.$notify({
                        title: '成功',
                        message: '您的账号已注册完成，快去登录吧~',
                        position: 'bottom-right',
                        type: 'success'
                    });
                })
            }
           
        }
    }
}
</script>

<style lang="scss" scoped>
.image-bg{
    display: block;
    width: 100%;
    height: 100%;
    pointer-events:none;
}
.container{
    position: relative;
    width: 100%;
    height: 100vh;
    background: linear-gradient(-135deg, #506f8f, #9b2f2f);
    background-repeat: no-repeat;
    background-size: cover;
    user-select: none;
    cursor: default;
}
.login-box{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 320px;
    height: 300px;
    padding: 30px;
    box-sizing: border-box;
    background-color:#fff;
    border-radius: 32px;
    transform: translate(-50%, -50%);
    .version{
        position: absolute;
        right: 30px;
        bottom: 10px;
        color: #c0c4cc;
        text-align: center;
        font-size: 12px;
    }
    .text-link{
        text-align: center;
        margin-top: 10px;
        color: #f56c6c;
    }
    .input{
        margin-top: 14px;
    }
    .btn-login{
        width: 100%;
        margin-top: 20px;
    }
}
</style>