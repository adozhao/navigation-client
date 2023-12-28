<template>
    <el-drawer title="设置" :visible.sync="open" :direction="direction" :before-close="handleClose" :size="320" :wrapperClosable="false" :modal="true">
        <div class="drawer-box">
            <el-form label-position="left" label-width="80px" size="mini">
                <el-form-item label="跳转方式">
                    <el-select v-model="linkOpenWay" @change="onChange">
                        <el-option :value="0" label="当前窗口"></el-option>
                        <el-option :value="1" label="新窗口"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="背景">
                    <el-upload
                        :action='uploadUrl'
                        :limit="1"
                        :show-file-list="false"
                        :on-success="onSuccess"
                        :headers="{Authorization: token}"
                        :before-upload="beforeUpload"
                        >
                        <div class="upload-box" :class="{'none': !bgSrc}">
                            <div class="icon-box">
                                <i class="el-icon-upload"></i>
                            </div>
                            <img class="image-uploaded" :src="bgSrc">
                        </div>
                    </el-upload>
                    <el-button v-if="bgSrc" @click="recoverBg">恢复默认</el-button>
                </el-form-item>
            </el-form>
            <el-button class="btn-logout" type="primary" @click="logout">退出登录</el-button>
        </div>
    </el-drawer>
</template>
<script>
import constants from '@/constants'
import { unlinkBg } from '@/api/user'
export default{
    data(){
        return{
            direction: 'rtl',
            fileList: []
        }
    },
    props:{
        open:{
            type: Boolean,
            default: false
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
        uploadUrl(){
            const baseUrl = constants.baseUrl
            const path = '/upload/upload'
            return baseUrl + path
        },
        token(){
            let token = this.$store.state.user.token
            return `Bearer ${token}`
        },
        linkOpenWay:{
            get(){
                return Number(this.$store.state.user.linkOpenWay)
            },
            set(){

            }
        }
    },
    methods:{
        recoverBg(){
            unlinkBg().then(res=>{
                this.$store.commit('user/SET_BG_IMAGE', '')
            })
        },
        beforeUpload(file){
            const isAllowImgType = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt1M = file.size / 1024 / 1024 < 1;
            if (!isAllowImgType) {
                this.$notify({
                    title: '警告',
                    message: '上传头像图片只能是 JPG 或 PNG 格式!',
                    type: 'success'
                });
            }
            if (!isLt1M) {
                this.$notify({
                    title: '警告',
                    message: '上传图片大小不能超过 1MB!',
                    type: 'success'
                });
            }
            return isAllowImgType && isLt1M;
        },
        onSuccess(response, file, fileList){
            this.$store.commit('user/SET_BG_IMAGE', response.data)
        },
        onChange(val){
            this.$store.commit('user/SET_LINK_OPEN_WAY', val)
        },
        logout(){
            localStorage.removeItem('token')
            this.$router.push('/login')
        },
        handleClose(){
            this.$emit('update:open', false)
        },
    }
}
</script>
<style lang="scss" scoped>
.upload-box{
    position: relative;
    width: 160px;
    height: 100px;
    &.none{
        .icon-box{
            display: block;
        }
        .image-uploaded{
            display: none;
        }
    }
    &:hover{
        .icon-box{
            display: block;
            transition: all .2s;
        }
    }
    .image-uploaded{
        display: block;
        width: 100%;
        height: 100%;
    }
    .icon-box{
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.1);
        
        .el-icon-upload{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 40px;
            color: #fff;
        }
    }
}
.drawer-box{
    position: relative;
    height: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    .btn-logout{
        position: absolute;
        width: calc(100% - 40px);
        bottom: 30px;
    }
}
</style>